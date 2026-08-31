import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const docsRoot = path.resolve('src/content/docs');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(entryPath);
  }
  return files;
}

const files = await walk(docsRoot);
const errors = [];
const routes = new Set(
  files.map((file) => {
    const sourcePath = path.relative(docsRoot, file).split(path.sep).join('/');
    const withoutExtension = sourcePath.replace(/\.md$/, '');
    return withoutExtension === 'index' ? '' : withoutExtension.replace(/\/?index$/, '');
  }),
);

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const name = path.relative(docsRoot, file).split(path.sep).join('/');
  const withoutExtension = name.replace(/\.md$/, '');
  const currentRoute = withoutExtension === 'index'
    ? ''
    : withoutExtension.replace(/\/?index$/, '');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  const titleMatches = frontmatter?.[1].match(/^title:\s*.+$/gm) ?? [];
  if (!frontmatter || titleMatches.length !== 1) {
    errors.push(`${name}: expected one frontmatter title`);
  }
  if (/^#\s+/m.test(source.slice(frontmatter?.[0].length ?? 0))) {
    errors.push(`${name}: body contains an H1; Starlight renders the page title`);
  }

  const links = source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
  for (const [, rawTarget] of links) {
    const target = rawTarget.trim().split('#')[0];
    if (!target || /^(?:[a-z]+:|\/)/i.test(target)) continue;
    if (target.endsWith('.md')) {
      errors.push(`${name}: source link must use a Starlight route, not ${rawTarget}`);
      continue;
    }
    if (!target.endsWith('/')) continue;
    const resolvedRoute = path.posix.normalize(path.posix.join(currentRoute, target));
    const normalizedRoute = resolvedRoute === '.' ? '' : resolvedRoute.replace(/\/$/, '');
    if (!routes.has(normalizedRoute)) {
      errors.push(`${name}: missing route target ${rawTarget}`);
    }
  }
}

if (files.length === 0) errors.push('no documentation pages found');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} documentation pages.`);
}
