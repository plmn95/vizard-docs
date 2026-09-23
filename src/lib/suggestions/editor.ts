import { CrepeBuilder } from '@milkdown/crepe/builder';
import { table } from '@milkdown/crepe/feature/table';
import { listItem } from '@milkdown/crepe/feature/list-item';
import { linkTooltip } from '@milkdown/crepe/feature/link-tooltip';
import { cursor } from '@milkdown/crepe/feature/cursor';
import { topBar } from '@milkdown/crepe/feature/top-bar';
import { editorViewCtx } from '@milkdown/kit/core';
import { undoCommand, redoCommand } from '@milkdown/kit/plugin/history';
import { callCommand } from '@milkdown/kit/utils';
import { cleanEditorMarkdown, equivalent, validateBody } from './document.mjs';
import { installToolbarTooltip } from './toolbar-tooltip';

export async function createDocumentEditor(root: HTMLElement, markdown: string, onChange = (_text: string) => {}) {
  validateBody(markdown);
  const editor = new CrepeBuilder({ root, defaultValue: markdown })
    .addFeature(table).addFeature(listItem).addFeature(linkTooltip).addFeature(cursor)
    .addFeature(topBar, {
      headingOptions: [{ label: 'Paragraph', level: null }, ...[2, 3, 4, 5, 6].map(level => ({label: `Heading ${level - 1}`, level}))],
      buildTopBar(builder) {
        builder.getGroup('formatting').group.items = builder.getGroup('formatting').group.items.filter(item => item.key !== 'strikethrough');
        builder.getGroup('list').group.items = builder.getGroup('list').group.items.filter(item => item.key !== 'task-list');
        builder.getGroup('block').clear();
        builder.getGroup('more').clear();
        builder.addGroup('history', 'History')
          .addItem('undo', { icon: '↶', active: () => false, onRun: ctx => callCommand(undoCommand.key)(ctx) })
          .addItem('redo', { icon: '↷', active: () => false, onRun: ctx => callCommand(redoCommand.key)(ctx) });
        const labels: Record<string, string> = { bold: 'Bold', italic: 'Italic', code: 'Inline code', 'bullet-list': 'Bullet list', 'ordered-list': 'Numbered list', link: 'Insert link', table: 'Insert table', undo: 'Undo', redo: 'Redo' };
        for (const group of builder.build()) for (const item of group.items) {
          if (labels[item.key]) item.icon = `<span aria-hidden="true">${item.icon}</span><span class="sr-only">${labels[item.key]}</span>`;
        }
      },
    });
  await editor.create();
  const readMarkdown = editor.getMarkdown;
  editor.getMarkdown = () => cleanEditorMarkdown(readMarkdown());
  if (!equivalent(markdown, editor.getMarkdown())) {
    await editor.destroy();
    throw new Error('This page contains formatting the visual editor cannot preserve. You can still describe a change below.');
  }
  editor.editor.action(ctx => {
    const view = ctx.get(editorViewCtx);
    view.dom.setAttribute('role', 'textbox');
    view.dom.setAttribute('aria-label', 'Page content');
    view.dom.setAttribute('aria-multiline', 'true');
    view.dom.setAttribute('spellcheck', 'true');
    // File uploads are outside this text-only contribution flow.
    view.setProps({ handleDOMEvents: { drop: (_view, event) => {
      if (event.dataTransfer?.files.length) { event.preventDefault(); return true; } return false;
    }, paste: (_view, event) => {
      if (event.clipboardData?.files.length) { event.preventDefault(); return true; } return false;
    } } });
  });
  // Crepe's top bar currently runs commands only on pointerdown. Bridge native
  // keyboard button activation as well, without moving the editor selection.
  root.querySelector('.milkdown-top-bar')?.addEventListener('keydown', event => {
    const key = (event as KeyboardEvent).key;
    const target = event.target as HTMLElement;
    if ((key === 'Enter' || key === ' ') && target.tagName === 'BUTTON') {
      event.preventDefault(); target.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, cancelable: true}));
    }
  });
  const toolbar = root.querySelector<HTMLElement>('.milkdown-top-bar');
  if (toolbar) {
    const removeTooltip = installToolbarTooltip(root, toolbar);
    const destroy = editor.destroy.bind(editor);
    editor.destroy = async () => { removeTooltip(); await destroy(); };
  }
  editor.on(listener => listener.markdownUpdated((_ctx, markdown, previous) => {
    if (markdown !== previous) onChange(cleanEditorMarkdown(markdown));
  }));
  return editor;
}

export { editorViewCtx };
