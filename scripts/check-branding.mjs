import { readFileSync, existsSync } from 'node:fs';
import { assetWithBase, FAVICON_PATH, LOGO_PATH } from '../src/lib/brand-assets.mjs';

const base = process.env.VIZARD_DOCS_BASE || (process.env.VERCEL === '1' ? '/' : '/vizard-docs');
const expectedLogo = assetWithBase(base, LOGO_PATH);
const expectedFavicon = assetWithBase(base, FAVICON_PATH);

function checkPage(file) {
  const html = readFileSync(file, 'utf8');
  const brand = html.match(/<a\b[^>]*data-vizard-brand[^>]*>[\s\S]*?<\/a>/)?.[0];
  if (!brand || !brand.includes(`src="${expectedLogo}"`)) {
    throw new Error(`${file}: brand link is missing ${expectedLogo}`);
  }
  const icons = [...html.matchAll(/<link\b[^>]*rel="[^"]*icon[^"]*"[^>]*>/g)].map(([tag]) => tag);
  if (!icons.some((tag) => tag.includes(`href="${expectedFavicon}"`))) {
    throw new Error(`${file}: favicon link is missing ${expectedFavicon}`);
  }
}

for (const asset of [LOGO_PATH, FAVICON_PATH]) {
  if (!existsSync(`dist${asset}`)) throw new Error(`Built brand asset missing: dist${asset}`);
}
checkPage('dist/index.html');
const editorPage = 'dist/edit/index/index.html';
const editorExpected = Boolean(
  process.env.VIZARD_SUGGESTIONS_API && process.env.VIZARD_TURNSTILE_SITE_KEY && !process.env.VIZARD_DOCS_VERSION
);
if (editorExpected && !existsSync(editorPage)) {
  throw new Error(`Editor branding cannot be checked because ${editorPage} is missing`);
}
if (existsSync(editorPage)) checkPage(editorPage);
console.log(`Branding verified for ${base}: home${existsSync(editorPage) ? ' and editor' : ''}.`);
