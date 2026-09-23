import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { validateBody } from './document.mjs';

const parser = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkGfm);
export const normalize = (text) => text.replace(/\r?\n/g, ' ');
export const validPath = (path) => typeof path === 'string' &&
  /^src\/content\/docs\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.md$/.test(path);

export function passages(source) {
  const result = [];
  function visit(node) {
    if (node.type === 'paragraph') {
      const runs = [];
      let text = '', supported = true;
      function flatten(child) {
        if (['text', 'inlineCode'].includes(child.type)) {
          const value = normalize(child.value);
          runs.push({ type: child.type, from: text.length, to: text.length + value.length,
            start: child.position.start.offset, end: child.position.end.offset,
            literal: source.slice(child.position.start.offset, child.position.end.offset) === child.value });
          text += value;
        } else if (['paragraph', 'emphasis', 'strong', 'delete', 'link', 'linkReference'].includes(child.type)) {
          child.children.forEach(flatten);
        } else supported = false;
      }
      flatten(node);
      if (supported && text.trim() && text.length <= 6000) result.push({
        id: `${node.position.start.offset}-${node.position.end.offset}`,
        text, runs, start: node.position.start.offset, end: node.position.end.offset,
      });
    } else node.children?.forEach(visit);
  }
  visit(parser.parse(source));
  return result;
}

// Patch source text, never serialize a rendered page or accept visitor-supplied Markdown.
export function prepareEdit(source, { passage, original, replacement }) {
  const block = passages(source).find((item) => item.id === passage);
  if (!block || block.text !== original) throw new Error('The original passage does not match the source.');
  if (replacement === original || !replacement.trim()) throw new Error('Please make a change before sending.');
  if (/[\r\n]/.test(replacement)) return { reason: 'The suggestion changes paragraph structure.' };
  let left = 0, right = 0;
  while (left < original.length && left < replacement.length && original[left] === replacement[left]) left++;
  while (right < original.length - left && right < replacement.length - left &&
    original[original.length - right - 1] === replacement[replacement.length - right - 1]) right++;
  const run = block.runs.find((item) => item.type === 'text' && item.literal &&
    item.from <= left && item.to >= original.length - right);
  if (!run) return { reason: 'The suggestion crosses formatting boundaries or changes formatted code.' };
  // Newlines in a text run occupy one display character; CRLF requires manual review.
  if (source.slice(run.start, run.end).includes('\r')) return { reason: 'This source uses different line endings.' };
  const inserted = replacement.slice(left, replacement.length - right);
  const escaped = inserted.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '\\$&');
  const start = run.start + left - run.from;
  const end = run.start + original.length - right - run.from;
  const content = source.slice(0, start) + escaped + source.slice(end);
  const next = passages(content).find((item) => item.start === block.start);
  if (!next || next.text !== replacement) return { reason: 'This change needs a manual formatting check.' };
  return { content };
}

export function validateSubmission(value) {
  if (!value || typeof value !== 'object') throw new Error('Invalid submission.');
  const { id, path, revision, kind, passage = '', original = '', replacement = '', explanation = '', version = '' } = value;
  if (!/^[a-f0-9-]{36}$/.test(id ?? '') || !validPath(path) || !/^[a-f0-9]{40}$/.test(revision ?? '') ||
    !['edit', 'problem', 'page'].includes(kind)) throw new Error('Invalid page or submission identity.');
  for (const text of [passage, original, replacement, explanation, version]) {
    if (typeof text !== 'string' || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) throw new Error('Invalid text.');
  }
  if (original.length > 6000 || (kind !== 'page' && replacement.length > 6000) || explanation.length > 3000 || version.length > 80 ||
    passage.length > 40) throw new Error('Please shorten your suggestion.');
  if (kind === 'edit' && (!/^\d+-\d+$/.test(passage) || !original.trim() || !replacement.trim() || original === replacement))
    throw new Error('Please change the wording before sending.');
  if (kind === 'problem' && !explanation.trim()) throw new Error('Please describe the problem.');
  if (kind === 'page') { if (original || passage) throw new Error('Invalid page suggestion.'); validateBody(replacement); }
  return { id, path, revision, kind, passage, original, replacement, explanation, version };
}
