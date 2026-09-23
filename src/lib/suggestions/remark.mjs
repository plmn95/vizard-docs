import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { passages, validPath } from './source.mjs';

export default function suggestionPassages({ revision, enabled }) {
  return (tree, file) => {
    if (!enabled || !file.path) return;
    const root = fileURLToPath(new URL('../../../', import.meta.url));
    const path = relative(root, file.path).replaceAll('\\', '/');
    if (!validPath(path)) return;
    const source = readFileSync(file.path, 'utf8');
    const blocks = passages(source);
    // Astro strips frontmatter before rendering. Positions survive typography
    // plugins, whereas comparing rendered quotation marks with source does not.
    const offset = source.indexOf(String(file.value));
    if (offset < 0) return;
    function visit(node, parent, grandparent) {
      if (node.type === 'paragraph') {
        const block = blocks.find(block => block.start === node.position?.start.offset + offset);
        if (block) {
          node.data ??= {};
          // Tight-list rendering unwraps <p>, dropping its attributes. A span
          // preserves the passage identity without changing list structure.
          if (parent?.type === 'listItem' && grandparent?.type === 'list' &&
            !grandparent.spread && grandparent.children.every(item => !item.spread)) node.data.hName = 'span';
          node.data.hProperties = { ...node.data.hProperties,
            'data-suggestion': JSON.stringify({ path, revision, passage: block.id, original: block.text }) };
        }
      } else node.children?.forEach(child => visit(child, node, parent));
    }
    visit(tree);
  };
}
