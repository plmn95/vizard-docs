type Selection = { path: string; revision: string; passage: string; original: string };
type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

const root = document.querySelector<HTMLElement>('[data-suggestions]');
if (root) {
  const query = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const dialog = query<HTMLDialogElement>('dialog'), form = query<HTMLFormElement>('[data-form]');
  const wording = query<HTMLTextAreaElement>('[data-wording]'), explanation = query<HTMLTextAreaElement>('[data-explanation]');
  const message = query('[data-message]'), send = query<HTMLButtonElement>('[data-send]');
  const baseSelection = { path: root.dataset.path!, revision: root.dataset.revision!, passage: '', original: '' };
  const drafts = new Map<string, { wording: string; explanation: string; id: string }>();
  let selection: Selection = baseSelection, kind = 'edit', id = '', token = '', widget: string | undefined, sending = false;
  let opener: HTMLElement | null = null;
  const draftKey = () => `${kind}:${selection.passage}`;
  const save = () => drafts.set(draftKey(), { wording: wording.value, explanation: explanation.value, id });
  function stopPicking() {
    document.querySelectorAll('.suggestion-pick').forEach(button => button.remove());
    query('[data-picker]').hidden = true;
  }
  function editMode() {
    query('[data-edit-fields]').hidden = false;
    query('[data-preview]').hidden = true;
    query('[data-review]').hidden = false;
    send.hidden = true; query('[data-back]').hidden = true;
    wording.readOnly = false; explanation.readOnly = false;
  }
  async function challenge() {
    token = '';
    if (widget && window.turnstile) { window.turnstile.reset(widget); return; }
    if (!window.turnstile) {
      await new Promise<void>((resolve, reject) => {
        document.querySelector('script[data-vizard-turnstile]')?.remove();
        const script = document.createElement('script');
        script.dataset.vizardTurnstile = ''; script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true; script.onload = () => resolve(); script.onerror = () => reject(new Error('The spam check could not load. Please retry when connected.'));
        document.head.append(script);
      });
    }
    widget = window.turnstile!.render(query('[data-challenge]'), { sitekey: root!.dataset.key, action: 'suggestion', theme: 'dark',
      callback: (value: string) => { token = value; }, 'expired-callback': () => { token = ''; },
      'error-callback': () => { token = ''; message.textContent = 'The spam check could not complete. Your draft is kept; please retry.'; } });
  }
  function open(nextKind: string, nextSelection: Selection, trigger: HTMLElement) {
    kind = nextKind; selection = nextSelection; opener = trigger;
    const draft = drafts.get(draftKey());
    id = draft?.id ?? crypto.randomUUID();
    wording.value = draft?.wording ?? selection.original;
    explanation.value = draft?.explanation ?? '';
    query('[data-original]').textContent = selection.original;
    query('[data-editor]').hidden = kind !== 'edit';
    query('[data-explanation-label]').textContent = kind === 'edit' ? 'Why this change? (optional)' : 'What is incorrect, unclear, or missing?';
    query('#suggestion-title').textContent = kind === 'edit' ? 'Suggest a change' : 'Describe a problem';
    query('[data-success]').hidden = true; message.textContent = ''; editMode();
    dialog.showModal(); (kind === 'edit' ? wording : explanation).focus();
    challenge().catch(error => { message.textContent = error.message; });
  }
  query('[data-start]').addEventListener('click', () => {
    stopPicking();
    const blocks = document.querySelectorAll<HTMLElement>('.sl-markdown-content [data-suggestion]');
    if (!blocks.length) { open('problem', baseSelection, query('[data-start]')); return; }
    query('[data-picker]').hidden = false;
    blocks.forEach((block, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'suggestion-pick'; button.textContent = 'Edit this passage';
      button.setAttribute('aria-label', `Edit passage ${index + 1}: ${JSON.parse(block.dataset.suggestion!).original.slice(0, 70)}`);
      button.dataset.pagefindIgnore = '';
      button.addEventListener('click', () => open('edit', JSON.parse(block.dataset.suggestion!), button));
      block.after(button);
    });
    document.querySelector<HTMLButtonElement>('.suggestion-pick')?.focus();
  });
  query('[data-problem]').addEventListener('click', () => open('problem', baseSelection, query('[data-problem]')));
  query('[data-stop]').addEventListener('click', () => { stopPicking(); query('[data-start]').focus(); });
  query('[data-close]').addEventListener('click', () => { if (!sending) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (sending) event.preventDefault(); });
  dialog.addEventListener('close', () => {
    if (query('[data-success]').hidden) save();
    if (widget && window.turnstile) window.turnstile.remove(widget);
    widget = undefined; token = '';
    (opener?.isConnected ? opener : query('[data-start]')).focus();
  });
  [wording, explanation].forEach(field => field.addEventListener('input', () => { id = crypto.randomUUID(); save(); }));
  query('[data-back]').addEventListener('click', () => { editMode(); (kind === 'edit' ? wording : explanation).focus(); });
  query('[data-review]').addEventListener('click', () => {
    message.textContent = '';
    if (kind === 'edit' && (!wording.value.trim() || wording.value === selection.original)) { message.textContent = 'Change the wording before reviewing your suggestion.'; wording.focus(); return; }
    if (kind === 'problem' && !explanation.value.trim()) { message.textContent = 'Describe the problem before reviewing.'; explanation.focus(); return; }
    query('[data-before]').textContent = kind === 'edit' ? `Original: ${selection.original}` : '';
    query('[data-after]').textContent = kind === 'edit' ? `Your wording: ${wording.value}` : explanation.value;
    query('[data-review-reason]').textContent = kind === 'edit' && explanation.value ? `Explanation: ${explanation.value}` : '';
    query('[data-edit-fields]').hidden = true;
    query('[data-preview]').hidden = false; query('[data-review]').hidden = true;
    send.hidden = false; query('[data-back]').hidden = false;
    wording.readOnly = true; explanation.readOnly = true; send.focus();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || send.hidden) return;
    if (!token) { message.textContent = 'Please complete the spam check, then send again.'; await challenge().catch(error => { message.textContent = error.message; }); return; }
    sending = true; send.disabled = true; query<HTMLButtonElement>('[data-back]').disabled = true;
    message.textContent = 'Sending your suggestion…'; save();
    try {
      const version = new URLSearchParams(location.search).get('manual')?.slice(0, 80) ?? '';
      const response = await fetch(`${root!.dataset.api}/suggestions`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, kind, ...selection, replacement: kind === 'edit' ? wording.value : '', explanation: explanation.value, version, token }),
        signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your suggestion. Please try again.');
      if (result.id !== id) throw new Error('Could not confirm receipt. Please retry.');
      drafts.delete(draftKey()); message.textContent = ''; query('[data-success]').hidden = false;
      query('[data-preview]').hidden = true; send.hidden = true; query('[data-back]').hidden = true;
      const link = query<HTMLAnchorElement>('[data-status-link]');
      link.href = `${root!.dataset.receipt}#${result.id}`; link.focus(); stopPicking();
    } catch (error) {
      message.textContent = error instanceof Error ? `${error.message} Your draft has been kept.` : 'Could not send. Your draft has been kept.';
      await challenge().catch(() => {});
    } finally { sending = false; send.disabled = false; query<HTMLButtonElement>('[data-back]').disabled = false; }
  });
}
