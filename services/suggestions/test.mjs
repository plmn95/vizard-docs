import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { passages, prepareEdit, validateSubmission, validPath } from '../../src/lib/suggestions/source.mjs';
import { deliver, reviewStatus, InvalidSuggestion, githubClient } from './github.mjs';
import suggestionPassages from '../../src/lib/suggestions/remark.mjs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import worker, { handle, drain, limitedBody } from './worker.mjs';
import { splitDocument, preserveSource, equivalent, preparePage, validateBody, cleanEditorMarkdown } from '../../src/lib/suggestions/document.mjs';

test('Milkdown empty-cell adaptation never strips authored HTML or real line breaks', () => {
  const md = '| A | B |\n|---|---|\n| <br /> | x<br />y |\n\n<br />\n';
  assert.equal(cleanEditorMarkdown(md), md.replace('| <br /> |', '|  |'));
  assert.throws(() => validateBody(cleanEditorMarkdown(md)));
});

test('full-page no-op saves preserve every byte, including metadata and source wrapping', () => {
  const {body} = splitDocument(source);
  assert.equal(preserveSource(body, body.replace(/\n\n/g, '\n\n\n')), body);
  assert.throws(() => preparePage(source, body), /Make a change/);
});
test('full-page edits preserve unrelated sections, tables, relative links, and duplicate paragraphs', () => {
  const input = '\nFirst wrapped\nparagraph.\n\n| Key | Value |\n|---|---|\n| A | `B` |\n\nSame text.\n\nSame text.\n\n[Next](../next/)\n';
  const edited = input.replace('First wrapped\nparagraph.', 'First revised paragraph.').replace('Same text.\n\n[Next]', 'Different text.\n\n[Next]');
  assert.equal(preserveSource(input, edited), edited);
  const inserted = edited + '\n## Added section\n\nUseful content.\n';
  assert.ok(equivalent(preserveSource(input, inserted), inserted));
  assert.ok(preserveSource(input, inserted).includes('|---|---|'));
  const deletion = edited.replace('Same text.\n\n', '');
  assert.ok(equivalent(preserveSource(input, deletion), deletion));
});
test('full-page validation rejects executable HTML, dangerous URLs, images, metadata and oversize documents', () => {
  for (const body of ['<script>alert(1)</script>', '[x](javascript:alert)', '[x](data:text/html,hello)', '![](https://example.com/x)', '---\ntitle: changed\n---', '# New title', 'x'.repeat(100001)])
    assert.throws(() => validateBody(body), body.slice(0, 50));
  assert.doesNotThrow(() => validateBody('Useful `code` and [link](../next/).'));
});
test('full-page delivery creates one PR, preserves metadata, and recovers a lost GitHub response', async () => {
  const body = splitDocument(source).body.replace('useful', 'clearer');
  const item = validateSubmission(submission({kind: 'page', passage: '', original: '', replacement: body}));
  const mock = github({loseResponse: true});
  await assert.rejects(deliver(row(item), environment(), mock.api));
  assert.equal((await deliver(row(item), environment(), mock.api)).kind, 'pull');
  const write = mock.writes.find(w => w.method === 'PUT');
  assert.equal(Buffer.from(write.body.content, 'base64').toString(), source.replace('useful', 'clearer'));
  assert.equal(mock.writes.filter(w => w.path === '/pulls').length, 1);
});
test('a stale full-page draft branches from its verified original revision instead of replacing current main', async () => {
  const item = submission({kind: 'page', passage: '', original: '', replacement: splitDocument(source).body.replace('useful', 'clearer')});
  const mock = github({current: source.replace('useful', 'published')});
  assert.equal((await deliver(row(item), environment(), mock.api)).kind, 'pull');
  assert.equal(mock.writes.find(w => w.path === '/git/refs').body.sha, item.revision);
  assert.match(mock.writes.find(w => w.path === '/pulls').body.body, /published page changed/);
});

const source = '---\ntitle: Example\n---\n\nA useful **bold word** with a [link](../target/) and `CODE`.\n\nSame text.\n\nSame text.\n';
function submission(overrides = {}) {
  const block = passages(source)[0];
  return { id: crypto.randomUUID(), path: 'src/content/docs/concepts/example.md', revision: 'a'.repeat(40), kind: 'edit',
    passage: block.id, original: block.text, replacement: block.text.replace('useful', 'clearer'), explanation: '', version: '', ...overrides };
}
function database() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('./migrations/0001.sql', import.meta.url), 'utf8'));
  return { prepare(sql) {
    let values = [];
    return { bind(...args) { values = args; return this; },
      async first() { return db.prepare(sql).get(...values) ?? null; },
      async all() { return { results: db.prepare(sql).all(...values) }; },
      async run() { return db.prepare(sql).run(...values); } };
  }, raw: db };
}
function environment() { return { DB: database(), ENABLED: 'true', RATE_SALT: 'test-only', TURNSTILE_SECRET: 'test-only',
  GITHUB_REPO: 'owner/docs', DOCS_URL: 'https://docs.example.test', ALLOWED_ORIGINS: 'https://docs.example.test' }; }
const encodedFile = (content = source, sha = 'file-sha') => ({ type: 'file', encoding: 'base64', size: content.length, sha, content: Buffer.from(content).toString('base64') });
function github(overrides = {}) {
  const writes = [], pulls = [], issues = [];
  let branch = false, file = encodedFile();
  const api = async (path, method = 'GET', body) => {
    if (method !== 'GET') writes.push({ path, method, body });
    if (overrides.request) { const result = await overrides.request(path, method, body); if (result !== undefined) return result; }
    if (path.startsWith('/pulls?')) return pulls;
    if (path.startsWith('/issues?')) return issues;
    if (path.startsWith('/compare/')) return { status: overrides.ancestor ?? 'ahead' };
    if (path === '/git/ref/heads/main') return { object: { sha: 'current-main' } };
    if (path.startsWith('/git/ref/heads/suggestion/')) { if (branch) return { object: { sha: 'branch' } }; const error = new Error('missing'); error.status = 404; throw error; }
    if (path === '/git/refs') { branch = true; return {}; }
    if (path.startsWith('/contents/') && method === 'GET') return path.includes('ref=suggestion') ? file : path.includes('ref=current-main') ? encodedFile(overrides.current ?? source, overrides.current ? 'new-sha' : 'file-sha') : encodedFile();
    if (path.startsWith('/contents/') && method === 'PUT') { file = encodedFile(Buffer.from(body.content, 'base64').toString(), 'edited-sha'); return {}; }
    if (path === '/pulls') { const pr = { number: 42, body: body.body }; pulls.push(pr); if (overrides.loseResponse) throw new Error('connection lost'); return pr; }
    if (path === '/issues') { const issue = { number: 43, body: body.body }; issues.push(issue); if (overrides.loseResponse) throw new Error('connection lost'); return issue; }
    throw new Error(`Unexpected mock request: ${method} ${path}`);
  };
  return { api, writes };
}
const row = item => ({ id: item.id, payload: JSON.stringify(item), created_at: Date.now() - 1000 });

test('patch preserves surrounding Markdown, frontmatter, and duplicate passages', () => {
  const result = prepareEdit(source, submission());
  assert.equal(result.content, source.replace('useful', 'clearer'));
  const repeated = passages(source)[2];
  assert.equal(prepareEdit(source, { passage: repeated.id, original: repeated.text, replacement: 'Last text.' }).content,
    source.slice(0, repeated.start) + 'Last text.\n');
});
test('formatting-sensitive changes are held for manual review', () => {
  for (const replacement of ['Rewrite the whole paragraph.', submission().original.replace('CODE', 'NEW'), 'New\nparagraph.'])
    assert.ok(prepareEdit(source, submission({ replacement })).reason);
  assert.throws(() => prepareEdit(source, submission({ original: 'forged' })));
});
test('inserted markup is literal text and cannot execute or change links', () => {
  const replacement = submission().original.replace('useful', '<script>alert(1)</script> [x](javascript:alert(1))');
  const result = prepareEdit(source, submission({ replacement }));
  assert.ok(result.content);
  assert.ok(!result.content.includes('<script>'));
  assert.equal(passages(result.content)[0].text, replacement);
  assert.ok(result.content.includes('[link](../target/)'));
});
test('Unicode and wrapped source text remain intact', () => {
  const input = 'Промяна 🙂\nfrom here.';
  const p = passages(input)[0];
  const result = prepareEdit(input, { passage: p.id, original: p.text, replacement: p.text.replace('here', 'there') });
  assert.equal(result.content, 'Промяна 🙂\nfrom there.');
});
test('validate rejects traversal, non-document paths, malformed identities and oversized text', () => {
  for (const path of ['src/content/docs/../../.github/workflows/run.yml', '.github/workflows/run.yml', 'src/content/docs/x.mdx', '/src/content/docs/x.md']) {
    assert.equal(validPath(path), false); assert.throws(() => validateSubmission(submission({ path })));
  }
  assert.throws(() => validateSubmission(submission({ replacement: 'x'.repeat(6001) })));
  assert.throws(() => validateSubmission(submission({ revision: 'main' })));
});
test('source mapper can correct real documentation without unrelated changes', () => {
  let checked = 0;
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) visit(path);
      else if (entry.name.endsWith('.md')) {
        const content = readFileSync(path, 'utf8');
        for (const block of passages(content)) {
          const run = block.runs.find(item => item.type === 'text' && item.literal && /[A-Za-z]/.test(block.text.slice(item.from, item.to)));
          if (!run) continue;
          const offset = run.from + block.text.slice(run.from, run.to).search(/[A-Za-z]/);
          const replacement = block.text.slice(0, offset) + 'Z' + block.text.slice(offset + 1);
          if (replacement === block.text) continue;
          const patched = prepareEdit(content, { passage: block.id, original: block.text, replacement });
          assert.ok(patched.content, `${path}: ${patched.reason}`);
          assert.equal(patched.content.length, content.length); checked++;
        }
      }
    }
  }
  visit(new URL('../../src/content/docs', import.meta.url).pathname);
  assert.ok(checked > 100);
});
test('delivery creates a focused bot PR and recovers a lost response without duplicates', async () => {
  const mock = github({ loseResponse: true }), item = submission();
  await assert.rejects(deliver(row(item), environment(), mock.api));
  assert.deepEqual(await deliver(row(item), environment(), mock.api), { number: 42, kind: 'pull' });
  assert.equal(mock.writes.filter(w => w.path === '/pulls').length, 1);
  const put = mock.writes.find(w => w.method === 'PUT');
  assert.equal(Buffer.from(put.body.content, 'base64').toString(), source.replace('useful', 'clearer'));
  assert.ok(put.body.branch.startsWith('suggestion/'));
});
test('stale source becomes an issue and lost issue responses are reconciled', async () => {
  const mock = github({ current: source + '\nNew content.', loseResponse: true }), item = submission();
  await assert.rejects(deliver(row(item), environment(), mock.api));
  assert.deepEqual(await deliver(row(item), environment(), mock.api), { number: 43, kind: 'issue' });
  assert.equal(mock.writes.length, 1);
  assert.match(mock.writes[0].body.body, /page has changed/);
});
test('untrusted branch revision is rejected without writes', async () => {
  const mock = github({ ancestor: 'diverged' });
  await assert.rejects(deliver(row(submission()), environment(), mock.api), InvalidSuggestion);
  assert.equal(mock.writes.length, 0);
});
test('account-free request saves, delivers, returns receipt and deduplicates', async () => {
  const env = environment(), mock = github(), waits = [];
  const dependencies = { fetch: async () => Response.json({ success: true, action: 'suggestion', hostname: 'docs.example.test' }), apiFactory: async () => mock.api };
  const item = submission();
  const request = () => new Request('https://worker.test/suggestions', { method: 'POST', headers: { origin: 'https://docs.example.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, token: 'verified' }) });
  const response = await handle(request(), env, { waitUntil: p => waits.push(p) }, dependencies);
  assert.equal(response.status, 202); assert.equal((await response.json()).id, item.id);
  await Promise.all(waits);
  assert.equal((await handle(request(), env, { waitUntil() {} }, dependencies)).status, 202);
  assert.equal(mock.writes.filter(w => w.path === '/pulls').length, 1);
  const receipt = await handle(new Request(`https://worker.test/receipts/${item.id}`), env, {});
  assert.deepEqual(await receipt.json(), { status: 'review', message: 'Your suggestion is awaiting review.' });
  assert.equal(receipt.headers.get('Cache-Control'), 'no-store');
});
test('origin, challenge action, and hostname are enforced', async () => {
  const env = environment(), item = submission();
  function request(origin) { return new Request('https://worker.test/suggestions', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, token: 'x' }) }); }
  assert.equal((await handle(request('https://evil.test'), env, {})).status, 403);
  for (const data of [{ success: true, action: 'different', hostname: 'docs.example.test' }, { success: true, action: 'suggestion', hostname: 'evil.test' }]) {
    assert.equal((await handle(request('https://docs.example.test'), env, {}, { fetch: async () => Response.json(data) })).status, 400);
  }
  assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS n FROM suggestions').get().n, 0);
});
test('delivery errors retain the submission and back off', async () => {
  const env = environment(), item = submission();
  env.DB.raw.prepare('INSERT INTO suggestions(id,payload,created_at,updated_at) VALUES (?,?,?,?)').run(item.id, JSON.stringify(item), Date.now(), Date.now());
  await drain(env, async () => { throw new Error('GitHub offline'); });
  const stored = env.DB.raw.prepare('SELECT * FROM suggestions').get();
  assert.equal(stored.status, 'delayed'); assert.equal(stored.attempts, 1);
  assert.ok(stored.next_attempt > Date.now()); assert.equal(stored.payload, JSON.stringify(item));
});
test('concurrent delivery attempts only claim a submission once', async () => {
  const env = environment(), item = submission(), mock = github();
  env.DB.raw.prepare('INSERT INTO suggestions(id,payload,created_at,updated_at) VALUES (?,?,?,?)').run(item.id, JSON.stringify(item), Date.now(), Date.now());
  await Promise.all([drain(env, async () => mock.api), drain(env, async () => mock.api)]);
  assert.equal(mock.writes.filter(w => w.path === '/pulls').length, 1);
});
test('body limits and webhook signatures reject unsafe requests', async () => {
  await assert.rejects(limitedBody(new Request('https://worker.test', { method: 'POST', body: 'x'.repeat(100) }), 10));
  const result = await worker.fetch(new Request('https://worker.test/webhook', { method: 'POST', body: '{}' }), environment(), {});
  assert.equal(result.status, 401);
});
test('receipt status distinguishes merged, declined, reopened and resolved', () => {
  assert.equal(reviewStatus({ state: 'closed', merged: true }, 'pull'), 'accepted');
  assert.equal(reviewStatus({ state: 'closed', merged: false }, 'pull'), 'closed');
  assert.equal(reviewStatus({ state: 'open' }, 'pull'), 'review');
  assert.equal(reviewStatus({ state: 'closed', state_reason: 'completed' }, 'issue'), 'accepted');
  assert.equal(reviewStatus({ state: 'closed', state_reason: 'not_planned' }, 'issue'), 'closed');
});

test('render mapping survives typography transformations and stripped frontmatter', () => {
  const path = new URL('../../src/content/docs/concepts/signal-chain.md', import.meta.url).pathname;
  const content = readFileSync(path, 'utf8');
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  const tree = unified().use(remarkParse).parse(body);
  function typography(node) { if (node.type === 'text') node.value = node.value.replaceAll("'", '’'); node.children?.forEach(typography); }
  typography(tree);
  suggestionPassages({ enabled: true, revision: 'a'.repeat(40) })(tree, { path, value: body });
  const mapped = tree.children.filter(n => n.type === 'paragraph').map(n => JSON.parse(n.data.hProperties['data-suggestion']));
  assert.equal(mapped.length, 4);
  assert.deepEqual(mapped.map(m => m.original), passages(content).map(p => p.text));
});
test('daily limits prevent additional new submissions without losing existing receipts', async () => {
  const env = environment(), mock = github(), waits = [];
  const dependencies = { fetch: async () => Response.json({ success: true, action: 'suggestion', hostname: 'docs.example.test' }), apiFactory: async () => mock.api };
  const send = item => handle(new Request('https://worker.test/suggestions', { method: 'POST', headers: { origin: env.ALLOWED_ORIGINS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, token: 'ok' }) }), env, { waitUntil: p => waits.push(p) }, dependencies);
  const first = submission();
  assert.equal((await send(first)).status, 202);
  for (let i = 0; i < 9; i++) { assert.equal((await send(submission())).status, 202); await Promise.all(waits); }
  assert.equal((await send(submission())).status, 429);
  assert.equal((await send(first)).status, 202);
  await Promise.all(waits);
});
test('tight list passages retain metadata through Markdown rendering', () => {
  const path = new URL('../../src/content/docs/getting-started/index.md', import.meta.url).pathname;
  const body = readFileSync(path, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  const tree = unified().use(remarkParse).parse(body);
  suggestionPassages({ enabled: true, revision: 'a'.repeat(40) })(tree, { path, value: body });
  const list = tree.children.find(node => node.type === 'list');
  for (const item of list.children) {
    assert.equal(item.children[0].data.hName, 'span');
    assert.ok(item.children[0].data.hProperties['data-suggestion']);
  }
});
test('signed webhook verifies repository and uses current state instead of a stale event', async () => {
  const env = environment(), item = submission(); env.GITHUB_WEBHOOK_SECRET = 'test-signing-secret';
  env.DB.raw.prepare("INSERT INTO suggestions(id,payload,created_at,updated_at,status,github_number,github_kind) VALUES (?,?,?,?, 'review',42,'pull')")
    .run(item.id, JSON.stringify(item), Date.now(), Date.now());
  const body = JSON.stringify({ repository: { full_name: env.GITHUB_REPO }, pull_request: { number: 42, state: 'closed', merged: false } });
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.GITHUB_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = Buffer.from(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))).toString('hex');
  const response = await handle(new Request('https://worker.test/webhook', { method: 'POST', body, headers: { 'x-hub-signature-256': `sha256=${signature}` } }), env, {},
    { apiFactory: async () => async () => ({ state: 'closed', merged: true }) });
  assert.equal(response.status, 200);
  assert.equal(env.DB.raw.prepare('SELECT status FROM suggestions').get().status, 'accepted');
});
test('GitHub App uses signed JWT and installation token scoped to the docs repository', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const pem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(await crypto.subtle.exportKey('pkcs8', keys.privateKey)).toString('base64')}\n-----END PRIVATE KEY-----`;
  let count = 0;
  const client = await githubClient({ GITHUB_PRIVATE_KEY: pem, GITHUB_APP_ID: '123', GITHUB_INSTALLATION_ID: '456', GITHUB_REPO: 'owner/docs' }, async (url, init) => {
    count++;
    if (count === 1) {
      assert.equal(url, 'https://api.github.com/app/installations/456/access_tokens');
      const jwt = init.headers.Authorization.slice(7), parts = jwt.split('.');
      assert.equal(JSON.parse(Buffer.from(parts[1], 'base64url')).iss, '123');
      assert.ok(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', keys.publicKey, Buffer.from(parts[2], 'base64url'), new TextEncoder().encode(`${parts[0]}.${parts[1]}`)));
      assert.deepEqual(JSON.parse(init.body).repositories, ['docs']);
      return Response.json({ token: 'installation-test-token' });
    }
    assert.equal(init.headers.Authorization, 'Bearer installation-test-token');
    assert.equal(url, 'https://api.github.com/repos/owner/docs/git/ref/heads/main');
    return Response.json({ ok: true });
  });
  assert.deepEqual(await client('/git/ref/heads/main'), { ok: true });
});
