import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const parser = unified().use(remarkParse).use(remarkGfm);
export const MAX_DOCUMENT = 100000;
export function splitDocument(source) {
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('The page metadata could not be read.');
  return { metadata: match[0], body: source.slice(match[0].length) };
}
export function parseBody(body) { return parser.parse(body); }
// Milkdown serializes a lone empty table-cell paragraph as <br />. This is
// editor scaffolding, not authored HTML. Remove ONLY that entire empty-cell
// placeholder; never strip HTML generally or touch real inline line breaks.
export function cleanEditorMarkdown(body) {
  const ranges = [];
  function visit(node) {
    if (node.type === 'tableCell' && node.children.length === 1 && node.children[0].type === 'html' &&
      /^<br\s*\/?\s*>$/i.test(node.children[0].value)) ranges.push(node.children[0].position);
    else node.children?.forEach(visit);
  }
  visit(parseBody(body));
  for (const range of ranges.reverse()) body = body.slice(0, range.start.offset) + body.slice(range.end.offset);
  return body;
}
// Soft source line-wraps and list spacing are presentation, not reader edits.
export function semantic(node) {
  if (Array.isArray(node)) return node.map(semantic);
  if (!node || typeof node !== 'object') return node;
  return Object.fromEntries(Object.entries(node).filter(([key]) => !['position', 'spread'].includes(key))
    .map(([key, value]) => [key, key === 'value' && node.type === 'text' ? value.replace(/\r?\n/g, ' ') : semantic(value)]));
}
const signature = node => JSON.stringify(semantic(node));
export function equivalent(a, b) { return signature(parseBody(a)) === signature(parseBody(b)); }

export function validateBody(body) {
  if (typeof body !== 'string' || !body.trim() || new TextEncoder().encode(body).length > MAX_DOCUMENT)
    throw new Error('Please keep the page between 1 and 100,000 bytes.');
  if (/^\s*---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.test(body)) throw new Error('Page metadata cannot be edited here.');
  const supported = new Set(['root', 'paragraph', 'text', 'heading', 'strong', 'emphasis', 'delete', 'inlineCode',
    'code', 'blockquote', 'list', 'listItem', 'table', 'tableRow', 'tableCell', 'link', 'break', 'thematicBreak']);
  let count = 0;
  function visit(node, depth = 0) {
    if (++count > 12000 || depth > 40) throw new Error('This document is too complex to submit.');
    if (!supported.has(node.type)) throw new Error('This page contains unsupported formatting. Keep your draft and describe the change instead.');
    if (node.type === 'heading' && node.depth === 1) throw new Error('Use section headings below the existing page title.');
    if (node.type === 'link') {
      const url = node.url.replace(/[\u0000-\u0020\u007f]/g, '');
      if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^(https?:|mailto:)/i.test(url)) throw new Error('Use a web, email, or documentation link.');
      if (url.startsWith('//') || url.includes('\\')) throw new Error('Use a complete HTTPS link or a relative documentation link.');
    }
    node.children?.forEach(child => visit(child, depth + 1));
  }
  const tree = parseBody(body); visit(tree);
  if (tree.children.length > 500) throw new Error('Please keep the page below 500 sections and paragraphs.');
  return tree;
}

// Match entire semantic blocks in order. Unchanged blocks and their original
// whitespace are retained verbatim; only changed blocks use editor Markdown.
// A final semantic check ensures reuse can never silently change the proposal.
export function preserveSource(original, edited) {
  const a = parseBody(original).children, b = validateBody(edited).children;
  if (a.length > 500) throw new Error('This page is too large for visual editing.');
  const ak = a.map(signature), bk = b.map(signature);
  if (signature(a) === signature(b)) return original;
  const dp = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--)
    dp[i][j] = ak[i] === bk[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const matches = new Map();
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    if (ak[i] === bk[j]) { matches.set(j++, i++); }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  let output = original.slice(0, a[0]?.position.start.offset ?? 0);
  for (let j = 0; j < b.length; j++) {
    const old = matches.get(j), node = old === undefined ? b[j] : a[old];
    const source = old === undefined ? edited : original;
    output += source.slice(node.position.start.offset, node.position.end.offset);
    if (j < b.length - 1) {
      const next = matches.get(j + 1);
      output += old !== undefined && next === old + 1
        ? original.slice(node.position.end.offset, a[next].position.start.offset) : '\n\n';
    }
  }
  output += original.slice(a.at(-1)?.position.end.offset ?? original.length) || '\n';
  if (!equivalent(output, edited)) throw new Error('The document could not be preserved safely. Your draft has been kept.');
  return output;
}

export function preparePage(source, replacement) {
  const { metadata, body } = splitDocument(source);
  const content = preserveSource(body, replacement);
  if (content === body) throw new Error('Make a change before sending your suggestion.');
  return { content: metadata + content };
}

export function changedBlocks(original, edited) {
  const a = parseBody(original).children, b = parseBody(edited).children;
  const ak = a.map(signature), bk = b.map(signature);
  const dp = Array.from({length: a.length + 1}, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--)
    dp[i][j] = ak[i] === bk[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const result = [];
  for (let i = 0, j = 0; i < a.length || j < b.length;) {
    if (i < a.length && j < b.length && ak[i] === bk[j]) { i++; j++; }
    else if (i < a.length && (j === b.length || dp[i + 1][j] >= dp[i][j + 1])) result.push({kind: 'removed', node: a[i++]});
    else result.push({kind: 'added', node: b[j++]});
  }
  return result;
}
