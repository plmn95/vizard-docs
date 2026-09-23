// Public assets are shared by Starlight pages and the standalone editor.
export const LOGO_PATH = '/vizard-logo.svg';
export const FAVICON_PATH = '/favicon.svg';

export function assetWithBase(base, path) {
  return `${base.replace(/\/$/, '')}${path}`;
}
