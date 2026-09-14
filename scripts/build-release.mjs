import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const [version, base = `/vizard-docs/releases/${version}/`] = process.argv.slice(2);
if (!/^v[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?$/.test(version || ''))
  throw new Error('Usage: npm run build:release -- vX.Y.Z[-prerelease] [basePath]');
if (!/^\/(?:[A-Za-z0-9._-]+\/)+$/.test(base) || base.split('/').includes('..'))
  throw new Error('basePath must be a safe absolute URL directory ending in /');
const commit = process.env.VIZARD_DOCS_COMMIT || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Invalid documentation commit');
execFileSync(process.execPath, ['scripts/check-docs.mjs'], { stdio: 'inherit' });
execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  stdio: 'inherit', env: { ...process.env, VIZARD_DOCS_VERSION: version, VIZARD_DOCS_BASE: base },
});
const root = resolve('dist');
const files = {};
function visit(dir) {
  for (const name of readdirSync(dir).sort()) {
    const path = resolve(dir, name), stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error(`Symlinks cannot ship: ${path}`);
    if (stat.isDirectory()) visit(path);
    else files[relative(root, path).replaceAll('\\', '/')] = createHash('sha256').update(readFileSync(path)).digest('hex');
  }
}
visit(root);
if (!files['index.html'] || !Object.keys(files).some(p => p.startsWith('pagefind/wasm.') && p.endsWith('.pagefind')))
  throw new Error('Missing manual entry or search engine');
writeFileSync(resolve(root, 'manifest.json'), JSON.stringify({
  schemaVersion: 1, appVersion: version, docsCommit: commit, basePath: base,
  entryPage: 'index.html', localPreview: process.env.VIZARD_DOCS_PREVIEW === '1', files,
}, null, 2) + '\n');
console.log(`Release manual: ${version}, documentation ${commit}, ${Object.keys(files).length} files`);
