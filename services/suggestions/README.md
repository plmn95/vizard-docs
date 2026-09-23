# Account-free documentation suggestions

Readers edit the whole page in a Milkdown visual editor, review changed sections, and send
it without a login. A separate Cloudflare Worker saves each submission in D1.
A GitHub App opens a pull request for page edits, or an issue for problem reports.
Older passage submissions remain supported, including their manual-review fallbacks. Maintainers
review in GitHub. Merging a PR invokes the existing docs deployment.

The feature is off unless both site build variables are configured. The service
also has its own `ENABLED` switch. Nothing in a static page grants repository
access; GitHub credentials live only in Worker secrets.

## Local validation

Use Node 24 or newer for the service tests/tooling (the docs retain their existing
Node requirement).

```sh
npm ci
npm run test:suggestions
npm run check
npm run test:archives
npm run suggestions:check
npx playwright install chromium
npm run test:editor
```

The browser suite opens all authored pages in the actual Milkdown editor, verifies
semantic import/export equivalence, byte-identical no-op saves, and an edit to each
page. It also covers desktop/mobile editing, table cells, keyboard toolbar controls,
local draft recovery, review, failed submission/retry, and problem reports. GitHub
and Turnstile are mocked in browser tests. On a Mac with installed Chrome, use
`PLAYWRIGHT_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:editor`.

## Full-page editing contract

- Editor code loads only on `/edit/.../`, never on the reading page. These routes
  are absent from disabled/release builds and excluded from indexing.
- The page body is editable; the existing page title and other frontmatter remain
  protected. Tables, headings, lists, links, code, and paragraphs are supported.
  Raw HTML, uploads, images, scripts, and unsupported Markdown nodes are rejected.
- The original source is captured with its commit. Matching unchanged top-level
  blocks (including duplicate blocks) and intervening whitespace are reused verbatim.
  Changed blocks may be normalized by Milkdown. The reconstructed body must parse
  to the same semantic document as the proposal. No-op submissions are rejected.
- Empty table cells in Milkdown 7.22.1 export as `<br />`. Our adapter removes only
  a sole HTML break inside an otherwise empty table cell. It never strips arbitrary
  HTML. Initial import/export checks fail closed if any other content changes.
- Crepe's top bar lacks button names and keyboard activation in this version. The
  integration supplies accessible names and bridges Enter/Space to its pointer
  command handler. These are narrow compatibility adaptations, not a dependency fork.
- Drafts stay in localStorage on the reader's device, keyed by page and mode. They
  retain their original source/revision across site updates. Discard clears a draft;
  successful submission clears it. If storage is blocked, the UI says it is tab-only.
- Full-page requests allow at most 100,000 UTF-8 bytes of body and 250,000 bytes of
  JSON transport. The server validates content independently and retains metadata.
- If the page changed since the draft began, the bot branches from the original
  verified main-branch revision. GitHub then exposes conflicts against current main;
  it never commits the old full page directly onto the newer main revision. Review
  the warning on such PRs before merging. Existing review and build rules still apply.
- Deploy the backward-compatible Worker update before merging the UI PR. Old
  passage clients and saved submissions continue to work during the transition.

To preview the UI, use a local Worker endpoint and Cloudflare's public test key:

```sh
VIZARD_SUGGESTIONS_API=http://127.0.0.1:8787 \
VIZARD_TURNSTILE_SITE_KEY=1x00000000000000000000AA \
npm run dev -- --host 127.0.0.1
```

The test key is for local testing only. There is no production CAPTCHA bypass.
For a local Worker, copy `wrangler.jsonc` to the ignored `wrangler.local.jsonc`,
add `http://127.0.0.1:4321` to `ALLOWED_ORIGINS`, and use a **test repository**
for `GITHUB_REPO`. Initialize local D1 with the command below using `--local`,
then run `wrangler dev --config services/suggestions/wrangler.local.jsonc`.
Put local secrets in `services/suggestions/.dev.vars` (ignored by Git). Use
Cloudflare's matching test secret for local Turnstile. Local mode still requires
GitHub App credentials if you want it to create real review items.

## Production setup

1. Log into the existing account with `npx wrangler login`. If several accounts
   are available, set the intended `account_id` in the Worker configuration.
2. Create a D1 database:

   ```sh
   npx wrangler d1 create vizard-doc-suggestions
   ```

   Copy its database ID into `services/suggestions/wrangler.jsonc`, then run:

   ```sh
   npx wrangler d1 migrations apply vizard-doc-suggestions --remote --config services/suggestions/wrangler.jsonc
   ```

3. Create a Turnstile widget for `plmn95.github.io` (and only additional domains
   actually serving current docs). Use managed mode. Keep its secret in the
   Worker and its public site key in the docs build variable described below.
4. Register a GitHub App owned by the maintainer. Set the homepage to the docs
   site and its webhook URL to `https://<worker-host>/webhook`. Grant repository
   permissions **Contents: read/write**, **Pull requests: read/write**, and
   **Issues: read/write**. Subscribe to **Pull request** and **Issues** events.
   No user OAuth authorization or contributor login is needed.
5. Install the App on **only `plmn95/vizard-docs`**. Generate a private key and
   convert it to unencrypted PKCS#8 locally if GitHub downloads PKCS#1:

   ```sh
   openssl pkcs8 -topk8 -nocrypt -in downloaded-private-key.pem -out private-key-pkcs8.pem
   ```

   Never commit private keys. Store these values with
   `npx wrangler secret put NAME --config services/suggestions/wrangler.jsonc`:

   | Secret | Value |
   | --- | --- |
   | `GITHUB_APP_ID` | Registered App ID |
   | `GITHUB_INSTALLATION_ID` | Installation ID for the docs repository |
   | `GITHUB_PRIVATE_KEY` | Complete PKCS#8 PEM private key |
   | `GITHUB_WEBHOOK_SECRET` | Random secret matching the App webhook settings |
   | `TURNSTILE_SECRET` | Production widget secret |
   | `RATE_SALT` | Independently generated random secret |

   For the PEM, pipe the file to `wrangler secret put GITHUB_PRIVATE_KEY` rather
   than pasting its content into a command line or chat.
6. Protect `main`: require a pull request and passing docs checks, and do not
   grant this App a bypass. GitHub's Contents permission is repository-wide;
   the service's path validation restricts its writes to existing docs Markdown
   files. No workflow-writing permission is requested. Keep PR validation
   unprivileged (`pull_request`, never a privileged checkout of submitted code).
7. Deploy initially with `ENABLED: "false"`:

   ```sh
   npx wrangler deploy --config services/suggestions/wrangler.jsonc
   ```

   Confirm the Worker URL and finish webhook configuration. Set `ENABLED` to
   `"true"` and redeploy once secrets and repository rules are in place.
8. Set these **GitHub Actions repository variables**, then build/deploy the docs:

   - `VIZARD_SUGGESTIONS_API`: Worker origin, with no trailing slash.
   - `VIZARD_TURNSTILE_SITE_KEY`: Production Turnstile site key.

   The Pages workflow passes them to Astro. For other hosts, configure the same
   build environment variables there and update `ALLOWED_ORIGINS` explicitly.
   `ALLOWED_ORIGINS` contains origins only; `DOCS_URL` includes `/vizard-docs`.

## Launch verification

- First rehearse against a test repository and a staging Worker/database.
- Submit a plain wording correction and inspect the exact PR diff. Verify that
  no unrelated Markdown, frontmatter, links, or workflow files change.
- Submit a multi-section edit with inline code and tables. Verify unrelated blocks
  remain unchanged. Submit a stale revision and verify its PR branches from the
  original commit, with a warning and any conflicts visible against current main.
- Retry after a simulated network error; verify one review item and one receipt.
- Merge the test PR; check the receipt changes to Accepted and the normal
  deployment succeeds. Accepted does not claim the site is already published.
- Close and reopen review items to check webhook synchronization. The five-minute
  scheduled handler repairs missed updates for pending reviews.
- Verify keyboard selection, Escape/Close, small screens, and blocked spam-check
  loading. User wording stays in the open page after failure or cancellation.
- Ask a nontechnical reader to make a correction unaided.

## Delivery and operational behavior

The API only reports receipt after D1 storage. It tries delivery immediately;
the five-minute scheduled handler retries failures with backoff up to one day.
An atomic ten-minute lease prevents concurrent delivery of the same submission.
Deterministic branch names and receipt markers reconcile lost GitHub responses.
If reconciliation cannot be completed, delivery remains delayed rather than
creating another review item. Logs identify the receipt and failure category,
never the proposed text, client IP, or credentials.

Daily quotas allow 10 new submissions per IP and 200 globally. IP keys are
salted and rotated daily; expired counters are deleted. Receipt endpoints reveal
only status, not submission text or identifiers on GitHub. The receipt token is
a random UUID stored in the URL fragment. No email, user account, or raw IP is
stored. Submission text and receipts remain in D1 until an operator removes
them; review items are public in GitHub. Do not treat this as a private inbox.

Watch for `suggestion_delivery ... retry_required` logs and old `received` or
`delayed` rows. Fix the underlying credentials/API problem and leave retries
enabled. To retry a particular saved submission immediately, set its
`next_attempt` and `lease_until` to zero after ensuring no delivery is running.
Suggestions closed because the claimed source cannot be verified are not retried.

Setting `ENABLED` to `"false"` stops new submissions and scheduled delivery;
in-flight delivery may finish. To remove the UI, clear the docs build variables
and redeploy current docs. Existing receipts continue to work while the service
is running. Rotate compromised secrets through Wrangler and the corresponding
provider settings.

Release builds never embed visual editors or CAPTCHA requests. Future manuals
link to the matching current online page with their version attached; archived
manual files already published are never rewritten by this feature.
