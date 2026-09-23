import { validateSubmission } from '../../src/lib/suggestions/source.mjs';
import { deliver, githubClient, InvalidSuggestion, reviewStatus } from './github.mjs';

const statusText = {
  received: 'Your suggestion is saved. We are preparing it for review.',
  delayed: 'Your suggestion is saved, but delivery is delayed. There is no need to send it again.',
  review: 'Your suggestion is awaiting review.', accepted: 'Your suggestion was accepted.', closed: 'This suggestion was closed.',
};
const sha256 = async (value) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))))
  .map(byte => byte.toString(16).padStart(2, '0')).join('');
const origins = (env) => env.ALLOWED_ORIGINS.split(',').map(value => value.trim());

export async function drain(env, apiFactory = githubClient) {
  const now = Date.now();
  const { results } = await env.DB.prepare("SELECT * FROM suggestions WHERE status IN ('received', 'delayed') AND next_attempt <= ? AND lease_until < ? ORDER BY created_at LIMIT 5").bind(now, now).all();
  let api;
  for (const row of results) {
    const claimTime = Date.now();
    const lease = await env.DB.prepare("UPDATE suggestions SET lease_until = ? WHERE id = ? AND lease_until < ? AND status IN ('received', 'delayed') RETURNING id")
      .bind(claimTime + 600000, row.id, claimTime).first();
    if (!lease) continue;
    try {
      api ??= await apiFactory(env);
      const delivered = await deliver(row, env, api);
      await env.DB.prepare("UPDATE suggestions SET status = 'review', github_number = ?, github_kind = ?, lease_until = 0, updated_at = ?, message = NULL WHERE id = ?")
        .bind(delivered.number, delivered.kind, Date.now(), row.id).run();
    } catch (error) {
      const permanent = error instanceof InvalidSuggestion;
      const attempts = row.attempts + 1;
      await env.DB.prepare('UPDATE suggestions SET status = ?, attempts = ?, next_attempt = ?, lease_until = 0, updated_at = ?, message = ? WHERE id = ?')
        .bind(permanent ? 'closed' : 'delayed', attempts, now + Math.min(86400000, 60000 * 2 ** Math.min(attempts, 10)), now,
          permanent ? error.message : null, row.id).run();
      // Do not put submission text, IPs, or credentials into operational logs.
      console.error('suggestion_delivery', row.id, permanent ? 'invalid_source' : 'retry_required');
    }
  }
}

async function webhook(request, env, apiFactory = githubClient) {
  const raw = await limitedBody(request, 1000000);
  const signature = request.headers.get('x-hub-signature-256') ?? '';
  if (!/^sha256=[a-f0-9]{64}$/.test(signature)) return new Response('Invalid signature', { status: 401 });
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.GITHUB_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const bytes = Uint8Array.from(signature.slice(7).match(/../g), value => parseInt(value, 16));
  if (!await crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(raw))) return new Response('Invalid signature', { status: 401 });
  const payload = JSON.parse(raw);
  if (payload.repository?.full_name !== env.GITHUB_REPO) return new Response('Ignored');
  const item = payload.pull_request ?? payload.issue;
  if (item) {
    const kind = payload.pull_request ? 'pull' : 'issue';
    // Webhooks can be replayed/out of order: fetch authoritative current state.
    const api = await apiFactory(env);
    const fresh = await api(`/${kind === 'pull' ? 'pulls' : 'issues'}/${item.number}`);
    await env.DB.prepare('UPDATE suggestions SET status = ?, updated_at = ? WHERE github_number = ? AND github_kind = ?')
      .bind(reviewStatus(fresh, kind), Date.now(), item.number, kind).run();
  }
  return new Response('OK');
}

export async function limitedBody(request, limit) {
  if (Number(request.headers.get('content-length')) > limit) throw new Error('Submission is too large.');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let size = 0, text = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new Error('Submission is too large.'); }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

export async function handle(request, env, ctx, dependencies = {}) {
  const url = new URL(request.url);
  if (url.pathname === '/webhook' && request.method === 'POST') return webhook(request, env, dependencies.apiFactory);
  const origin = request.headers.get('origin');
  const allowed = origins(env);
  const headers = { 'Cache-Control': 'no-store', 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff',
    ...(allowed.includes(origin) ? { 'Access-Control-Allow-Origin': origin } : {}) };
  const json = (value, status = 200) => Response.json(value, { status, headers });
  if (origin && !allowed.includes(origin)) return json({ error: 'This origin is not allowed.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
    ...headers, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type',
  } });
  if (request.method === 'GET' && /^\/receipts\/[a-f0-9-]{36}$/.test(url.pathname)) {
    const row = await env.DB.prepare('SELECT status, message FROM suggestions WHERE id = ?').bind(url.pathname.split('/').pop()).first();
    return row ? json({ status: row.status, message: row.message ?? statusText[row.status] }) : json({ error: 'Receipt not found.' }, 404);
  }
  if (url.pathname !== '/suggestions' || request.method !== 'POST') return json({ error: 'Not found.' }, 404);
  if (!allowed.includes(origin)) return json({ error: 'Submit from the documentation site.' }, 403);
  if (env.ENABLED !== 'true') return json({ error: 'Suggestions are temporarily unavailable. Your draft has been kept.' }, 503);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Expected JSON.' }, 415);
  let value, item;
  try { value = JSON.parse(await limitedBody(request, 250000)); item = validateSubmission(value); }
  catch (error) { return json({ error: error.message }, 400); }
  const saved = await env.DB.prepare('SELECT payload FROM suggestions WHERE id = ?').bind(item.id).first();
  if (saved) return saved.payload === JSON.stringify(item) ? json({ id: item.id }, 202) : json({ error: 'This receipt belongs to a different submission.' }, 409);
  if (typeof value.token !== 'string' || value.token.length > 2048) return json({ error: 'Please complete the spam check.' }, 400);
  const fetcher = dependencies.fetch ?? fetch;
  const verification = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: value.token }), signal: AbortSignal.timeout(10000),
  });
  const verified = await verification.json();
  if (!verified.success || verified.action !== 'suggestion' || !allowed.some(o => new URL(o).hostname === verified.hostname))
    return json({ error: 'The spam check expired or failed. Please try again.' }, 400);
  const now = Date.now(), day = Math.floor(now / 86400000);
  const ipKey = await sha256(`${env.RATE_SALT}:${day}:${request.headers.get('cf-connecting-ip') ?? 'unknown'}`);
  for (const [key, limit] of [[`ip:${ipKey}`, 10], [`global:${day}`, 200]]) {
    const rate = await env.DB.prepare('INSERT INTO rate_limits(key, hits, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET hits = hits + 1 RETURNING hits')
      .bind(key, (day + 2) * 86400000).first();
    if (rate.hits > limit) return json({ error: 'The daily suggestion limit has been reached. Your draft has been kept; please try again later.' }, 429);
  }
  await env.DB.prepare('INSERT OR IGNORE INTO suggestions(id, payload, created_at, updated_at) VALUES (?, ?, ?, ?)')
    .bind(item.id, JSON.stringify(item), now, now).run();
  const actual = await env.DB.prepare('SELECT payload FROM suggestions WHERE id = ?').bind(item.id).first();
  if (actual.payload !== JSON.stringify(item)) return json({ error: 'Submission conflict. Please reopen the form.' }, 409);
  ctx.waitUntil(drain(env, dependencies.apiFactory));
  return json({ id: item.id }, 202);
}

export default {
  async fetch(request, env, ctx) {
    try { return await handle(request, env, ctx); }
    catch {
      const origin = request.headers.get('origin');
      return Response.json({ error: 'Could not complete the request. Your draft has been kept; please retry.' }, { status: 503,
        headers: { 'Cache-Control': 'no-store', ...(origins(env).includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}) } });
    }
  },
  async scheduled(_event, env) {
    if (env.ENABLED !== 'true') return;
    await drain(env);
    await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Date.now()).run();
    // Repair webhook gaps, including a merge racing with initial delivery storage.
    const { results } = await env.DB.prepare("SELECT id, github_number, github_kind FROM suggestions WHERE status = 'review' ORDER BY updated_at LIMIT 10").all();
    if (results.length) {
      const api = await githubClient(env);
      for (const row of results) {
        const item = await api(`/${row.github_kind === 'pull' ? 'pulls' : 'issues'}/${row.github_number}`);
        await env.DB.prepare('UPDATE suggestions SET status = ?, updated_at = ? WHERE id = ?')
          .bind(reviewStatus(item, row.github_kind), Date.now(), row.id).run();
      }
    }
  },
};
