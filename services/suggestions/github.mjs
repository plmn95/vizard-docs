import { passages, prepareEdit } from '../../src/lib/suggestions/source.mjs';

const encoder = new TextEncoder();
const base64 = (bytes) => {
  let text = '';
  for (let offset = 0; offset < bytes.length; offset += 8192) text += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  return btoa(text);
};
const b64url = (value) => base64(encoder.encode(JSON.stringify(value))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
export class InvalidSuggestion extends Error {}

export async function githubClient(env, fetcher = fetch) {
  const now = Math.floor(Date.now() / 1000);
  const pem = env.GITHUB_PRIVATE_KEY.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({ iat: now - 60, exp: now + 540, iss: env.GITHUB_APP_ID })}`;
  const signature = base64(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(unsigned))))
    .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  async function request(path, token, method = 'GET', body) {
    const response = await fetcher(`https://api.github.com${path}`, { method,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'vizard-doc-suggestions', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      const error = new Error(`GitHub request failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }
  const installation = await request(`/app/installations/${env.GITHUB_INSTALLATION_ID}/access_tokens`, `${unsigned}.${signature}`, 'POST', {
    repositories: [env.GITHUB_REPO.split('/')[1]], permissions: { contents: 'write', pull_requests: 'write', issues: 'write' },
  });
  return (path, method, body) => request(`/repos/${env.GITHUB_REPO}${path}`, installation.token, method, body);
}

const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/');
const textBlock = (text) => text.split('\n').map(line => `    ${line}`).join('\n');
const decodeContent = (data) => new TextDecoder().decode(Uint8Array.from(atob(data.content.replace(/\s/g, '')), c => c.charCodeAt(0)));

export async function deliver(row, env, api) {
  const item = JSON.parse(row.payload);
  const branch = `suggestion/${item.id}`;
  const marker = `<!-- vizard-suggestion:${item.id} -->`;
  const owner = env.GITHUB_REPO.split('/')[0];
  // Recover a previous successful request when its HTTP response or DB update was lost.
  const prs = await api(`/pulls?state=all&head=${encodeURIComponent(`${owner}:${branch}`)}`);
  if (prs.length) return { number: prs[0].number, kind: 'pull' };
  // Issues do not offer an idempotency key. Reconcile all items created since this
  // submission before another create; stop and retry rather than guess at a bound.
  for (let page = 1; ; page++) {
    if (page > 10) throw new Error('Issue reconciliation needs operator attention.');
    const issues = await api(`/issues?state=all&sort=created&direction=asc&since=${encodeURIComponent(new Date(row.created_at - 60000).toISOString())}&per_page=100&page=${page}`);
    const existing = issues.find(issue => issue.body?.startsWith(marker));
    if (existing) return { number: existing.number, kind: existing.pull_request ? 'pull' : 'issue' };
    if (issues.length < 100) break;
  }
  let ancestor;
  try { ancestor = await api(`/compare/${item.revision}...main`); }
  catch (error) { if (error.status === 404 || error.status === 422) throw new InvalidSuggestion('The original document revision could not be verified.'); throw error; }
  if (!['ahead', 'identical'].includes(ancestor.status)) throw new InvalidSuggestion('The source is not a published main-branch revision.');
  let base;
  try { base = await api(`/contents/${encodePath(item.path)}?ref=${item.revision}`); }
  catch (error) { if (error.status === 404) throw new InvalidSuggestion('The original page could not be found.'); throw error; }
  if (base.type !== 'file' || base.encoding !== 'base64' || base.size > 150000) throw new InvalidSuggestion('Unsupported source file.');
  const source = decodeContent(base);
  let patch = { reason: 'Reader reported a documentation problem.' };
  if (item.kind === 'edit') {
    if (!passages(source).some(p => p.id === item.passage && p.text === item.original)) throw new InvalidSuggestion('The original passage could not be verified.');
    patch = prepareEdit(source, item);
  }
  const main = await api('/git/ref/heads/main');
  let current;
  try { current = await api(`/contents/${encodePath(item.path)}?ref=${main.object.sha}`); }
  catch (error) { if (error.status !== 404) throw error; }
  if (!current || current.sha !== base.sha) patch = { reason: 'The page has changed since the reader opened it. Review against current documentation.' };
  const route = item.path.replace('src/content/docs/', '').replace(/(?:\/index)?\.md$/, '').replace(/^index$/, '');
  const pageURL = `${env.DOCS_URL.replace(/\/$/, '')}/${route}/`;
  const body = [marker, 'An account-free contribution from the documentation site. Treat this text as an untrusted reader submission.',
    `Page: ${pageURL}`, `Source revision: ${item.revision}`, item.version ? `Reported manual version:\n${textBlock(item.version)}` : '',
    item.original ? `### Original\n${textBlock(item.original)}` : '', item.replacement ? `### Suggested wording\n${textBlock(item.replacement)}` : '',
    item.explanation ? `### Explanation\n${textBlock(item.explanation)}` : '', patch.reason ? `### Manual review needed\n${patch.reason}` : '',
  ].filter(Boolean).join('\n\n');
  const title = `Docs: ${item.kind === 'edit' ? 'wording correction' : 'reader report'} for ${route || 'home'}`;
  if (!patch.content) {
    const issue = await api('/issues', 'POST', { title, body });
    return { number: issue.number, kind: 'issue' };
  }
  let existingBranch;
  try { existingBranch = await api(`/git/ref/heads/${branch}`); } catch (error) { if (error.status !== 404) throw error; }
  if (!existingBranch) await api('/git/refs', 'POST', { ref: `refs/heads/${branch}`, sha: main.object.sha });
  const branchFile = await api(`/contents/${encodePath(item.path)}?ref=${encodeURIComponent(branch)}`);
  if (decodeContent(branchFile) !== patch.content) {
    if (branchFile.sha !== base.sha) throw new Error('Suggestion branch changed; refusing to overwrite it.');
    await api(`/contents/${encodePath(item.path)}`, 'PUT', { branch, sha: branchFile.sha,
      message: title, content: base64(encoder.encode(patch.content)) });
  }
  const pr = await api('/pulls', 'POST', { title, body, head: branch, base: 'main', maintainer_can_modify: true });
  return { number: pr.number, kind: 'pull' };
}

export function reviewStatus(item, kind) {
  if (kind === 'pull' && (item.merged || item.merged_at)) return 'accepted';
  if (item.state !== 'closed') return 'review';
  return kind === 'issue' && item.state_reason === 'completed' ? 'accepted' : 'closed';
}
