import { execFileSync } from 'node:child_process';

export const revision = process.env.VIZARD_DOCS_COMMIT || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
export const api = (process.env.VIZARD_SUGGESTIONS_API || '').replace(/\/$/, '');
export const siteKey = process.env.VIZARD_TURNSTILE_SITE_KEY || '';
export const enabled = Boolean(api && siteKey && !process.env.VIZARD_DOCS_VERSION);
if (api && !/^https:\/\/[^\s]+$/.test(api) && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(api))
  throw new Error('VIZARD_SUGGESTIONS_API must be an HTTPS URL (or localhost for development).');

// Unconfigured mirrors still offer the canonical, account-free editor.
export const contributionEnabled = !process.env.VIZARD_DOCS_VERSION;
export function editorUrl(path, base = '') {
  return `${enabled ? base.replace(/\/$/, '') : 'https://plmn95.github.io/vizard-docs'}/edit/${path.replace(/\.md$/, '')}/`;
}
