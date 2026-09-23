import { changedBlocks, equivalent, preserveSource, validateBody } from './document.mjs';

const data = JSON.parse(document.querySelector('#page-source')!.textContent!);
const q = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const message = q('[data-message]'), status = q('[data-draft-status]');
const review = q<HTMLButtonElement>('[data-review]'), send = q<HTMLButtonElement>('[data-send]');
const explanation = q<HTMLTextAreaElement>('#explanation'), problem = q<HTMLTextAreaElement>('#problem');
const kind = new URLSearchParams(location.search).get('mode') === 'problem' ? 'problem' : 'page';
const key = `vizard-page-draft:${data.path}:${kind}`;
const version = new URLSearchParams(location.search).get('manual')?.slice(0, 80) ?? '';
let original = data.body, markdown = original, revision = data.revision, id = crypto.randomUUID();
let editor: Awaited<ReturnType<typeof import('./editor').createDocumentEditor>> | undefined;
let token = '', widget: string | undefined, sending = false, completed = false, timer: ReturnType<typeof setTimeout>;
let storageAvailable = true, restored = false;
type Turnstile = { render: (root: HTMLElement, options: Record<string, unknown>) => string; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

try {
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved && typeof saved.markdown === 'string' && typeof saved.original === 'string' &&
      typeof saved.explanation === 'string' && /^[a-f0-9]{40}$/.test(saved.revision) && /^[a-f0-9-]{36}$/.test(saved.id)) {
    markdown = saved.markdown; original = saved.original; revision = saved.revision; id = saved.id;
    explanation.value = saved.explanation; problem.value = saved.problem || ''; restored = true;
  }
} catch { storageAvailable = false; }

function dirty() { return kind === 'problem' ? Boolean(problem.value.trim()) : !equivalent(original, markdown); }
function save() {
  if (completed) return;
  try {
    localStorage.setItem(key, JSON.stringify({ markdown, original, revision, id, explanation: explanation.value, problem: problem.value }));
    status.textContent = 'Draft saved on this device'; storageAvailable = true;
  } catch { storageAvailable = false; status.textContent = 'Draft kept in this tab only. Keep this tab open until you send.'; }
  q('[data-discard]').hidden = false;
}
function changed() { id = crypto.randomUUID(); clearTimeout(timer); timer = setTimeout(save, 200); }
function sync() { if (editor) markdown = editor.getMarkdown(); clearTimeout(timer); save(); }
window.addEventListener('pagehide', sync);
window.addEventListener('beforeunload', event => {
  if (sending || (!storageAvailable && dirty() && !completed)) { event.preventDefault(); event.returnValue = ''; }
});
q('[data-discard]').addEventListener('click', () => {
  if (!confirm('Discard this saved draft and start again from the published page?')) return;
  try { localStorage.removeItem(key); } catch {} completed = true; location.reload();
});
q<HTMLAnchorElement>('[data-cancel]').href = data.returnUrl + (version ? `?manual=${encodeURIComponent(version)}` : '');
q<HTMLAnchorElement>('[data-problem-link]').href = `?mode=problem${version ? `&manual=${encodeURIComponent(version)}` : ''}`;
explanation.addEventListener('input', changed); problem.addEventListener('input', changed);

// Render the Markdown syntax tree using DOM APIs, never reader-supplied HTML.
function markedText(text: string, previous?: string): Node {
  if (text === previous) return document.createTextNode(text);
  let left = 0, right = 0;
  if (previous !== undefined) {
    while (left < text.length && left < previous.length && text[left] === previous[left]) left++;
    while (right < text.length - left && right < previous.length - left && text[text.length - right - 1] === previous[previous.length - right - 1]) right++;
  }
  const fragment = document.createDocumentFragment(), mark = document.createElement('mark');
  mark.textContent = text.slice(left, text.length - right);
  fragment.append(document.createTextNode(text.slice(0, left)), mark, document.createTextNode(text.slice(text.length - right)));
  return fragment;
}
function renderNode(node: any, previous?: any): Node {
  if (node.type === 'text') return markedText(node.value.replace(/\r?\n/g, ' '), previous?.value?.replace(/\r?\n/g, ' '));
  const tags: Record<string, string> = { paragraph: 'p', strong: 'strong', emphasis: 'em', delete: 's', inlineCode: 'code',
    code: 'pre', blockquote: 'blockquote', listItem: 'li', table: 'table', tableRow: 'tr', tableCell: 'td', link: 'a', break: 'br', thematicBreak: 'hr' };
  const tag = node.type === 'heading' ? `h${node.depth}` : node.type === 'list' ? (node.ordered ? 'ol' : 'ul') : tags[node.type] || 'div';
  const el = document.createElement(tag);
  if (node.type === 'link') { (el as HTMLAnchorElement).href = new URL(node.url, new URL(data.returnUrl, location.origin)).href; el.setAttribute('rel', 'noopener noreferrer'); el.setAttribute('target', '_blank'); }
  if (node.type === 'list' && node.ordered && node.start) el.setAttribute('start', String(node.start));
  if (node.value) el.append(markedText(node.value, previous?.value));
  node.children?.forEach((child: any, index: number) => el.append(renderNode(child, previous?.children?.[index])));
  if (node.type === 'link' && node.url !== previous?.url) {
    const target = document.createElement('small'); target.textContent = ` (${node.url})`; el.append(target);
  }
  return el;
}
let challengeLoading: Promise<void> | undefined;
async function challenge() {
  token = '';
  if (widget && window.turnstile) { window.turnstile.reset(widget); return; }
  if (!window.turnstile) {
    challengeLoading ??= new Promise<void>((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true;
      const timeout = setTimeout(() => { script.remove(); challengeLoading = undefined; reject(new Error('The spam check did not load. Your draft is safe; try again.')); }, 15000);
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); script.remove(); challengeLoading = undefined; reject(new Error('The spam check could not load. Your draft is safe; try again.')); };
      document.head.append(script);
    });
    await challengeLoading;
  }
  widget = window.turnstile!.render(q('[data-challenge]'), {sitekey: data.siteKey, action: 'suggestion', theme: 'dark',
    callback: (value: string) => { token = value; }, 'expired-callback': () => { token = ''; },
    'error-callback': () => { token = ''; message.textContent = 'The spam check could not complete. Please try again; your draft is kept.'; } });
}
review.addEventListener('click', () => {
  message.textContent = '';
  try {
    sync();
    if (!dirty()) throw new Error(kind === 'page' ? 'Make a change before reviewing your suggestion.' : 'Describe the problem before reviewing.');
    const diff = q('[data-diff]'); diff.replaceChildren();
    if (kind === 'page') {
      const proposed = preserveSource(original, markdown);
      const changes = changedBlocks(original, proposed);
      const removed = changes.filter(change => change.kind === 'removed'), added = changes.filter(change => change.kind === 'added');
      let removedIndex = 0, addedIndex = 0;
      for (const change of changes) {
        const counterpart = change.kind === 'removed' ? added[removedIndex++] : removed[addedIndex++];
        const section = document.createElement('section'); section.className = `change ${change.kind}`;
        const label = document.createElement('p'); label.className = 'change-label'; label.textContent = change.kind === 'removed' ? 'Before' : 'After';
        section.append(label, renderNode(change.node, counterpart?.node.type === change.node.type ? counterpart.node : undefined)); diff.append(section);
      }
    } else {
      diff.textContent = problem.value; q('[data-review-hint]').textContent = 'Your description will be sent for review.';
      explanation.hidden = true; q('label[for="explanation"]').hidden = true;
    }
    q('[data-edit]').hidden = true; q('[data-problem]').hidden = true; q('[data-preview]').hidden = false;
    review.hidden = true; send.hidden = false; q('[data-back]').hidden = false; q('[data-preview]').focus(); window.scrollTo(0, 0);
    challenge().catch(error => { message.textContent = error.message; });
  } catch (error) { message.textContent = (error as Error).message; }
});
q('[data-back]').addEventListener('click', () => {
  if (sending) return;
  q('[data-preview]').hidden = true; q('[data-edit]').hidden = kind !== 'page'; q('[data-problem]').hidden = kind !== 'problem';
  review.hidden = false; send.hidden = true; q('[data-back]').hidden = true;
  (kind === 'page' ? q('[role="textbox"]') : problem).focus(); window.scrollTo(0, 0);
});
send.addEventListener('click', async () => {
  if (sending || send.hidden) return;
  if (!token) { message.textContent = 'Please complete the spam check, then send again.'; await challenge().catch(error => { message.textContent = error.message; }); return; }
  sending = true; send.disabled = true; q<HTMLButtonElement>('[data-back]').disabled = true; explanation.disabled = true;
  q('[data-cancel]').setAttribute('aria-disabled', 'true'); save(); message.textContent = 'Sending your suggestion…';
  try {
    const payload = { id, kind, path: data.path, revision, replacement: kind === 'page' ? preserveSource(original, markdown) : '',
      explanation: kind === 'problem' ? problem.value : explanation.value, version, token };
    const response = await fetch(`${data.api}/suggestions`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    const result = await response.json();
    if (!response.ok || result.id !== id) throw new Error(result.error || 'Could not confirm receipt. Please retry.');
    completed = true; clearTimeout(timer); try { localStorage.removeItem(key); } catch {}
    q('[data-preview]').hidden = true; send.hidden = true; q('[data-back]').hidden = true; q('[data-editor-footer]').hidden = true;
    q('[data-success]').hidden = false; message.textContent = ''; status.textContent = 'Sent for review';
    const receipt = q<HTMLAnchorElement>('[data-receipt]'); receipt.href = `${data.receipt}#${id}`; receipt.focus();
  } catch (error) { message.textContent = `${(error as Error).message} Your draft has been kept.`; await challenge().catch(() => {}); }
  finally { sending = false; send.disabled = false; explanation.disabled = false; q<HTMLButtonElement>('[data-back]').disabled = false; q('[data-cancel]').removeAttribute('aria-disabled'); }
});
q('[data-cancel]').addEventListener('click', event => { if (sending) event.preventDefault(); else sync(); });

async function start() {
  if (kind === 'problem') {
    q('[data-edit]').hidden = true; q('[data-problem]').hidden = false; q('[data-intro]').textContent = 'Tell us what needs to change. No account needed.';
    q('[data-problem-link]').hidden = true; review.disabled = false;
  } else {
    try {
      validateBody(original);
      const { createDocumentEditor } = await import('./editor');
      editor = await createDocumentEditor(q('[data-editor]'), markdown, value => { markdown = value; changed(); });
      review.disabled = false;
    } catch (error) { message.textContent = (error as Error).message; status.textContent = 'Editor unavailable'; return; }
  }
  status.textContent = restored ? (revision !== data.revision ? 'Saved draft restored from an earlier page version. Newer edits will be preserved during review.' : 'Saved draft restored') : 'Changes are saved on this device';
  q('[data-discard]').hidden = !restored;
}
start();
