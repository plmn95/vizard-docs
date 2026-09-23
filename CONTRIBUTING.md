# Contributing to Vizard Documentation

Corrections, clearer explanations, and missing documentation are welcome.

## Suggest a correction

Choose **Edit this page** to edit the full document, including paragraphs,
headings, lists, links, and tables. Review the highlighted changes and send. You do not need a GitHub account or
Markdown knowledge. Use **Describe a problem** if you would rather explain a change
than edit the page. Suggestions and explanations are public and reviewed before
publication. Save the receipt link if you want to check progress.

For contributors who already use GitHub, you can also open a
[documentation correction](https://github.com/plmn95/vizard-docs/issues/new?template=documentation-correction.yml).
Include the page URL, what is unclear or incorrect, and the wording you suggest
when you have it.

If the on-page contribution controls are unavailable, the account-free service
has not been enabled or is temporarily disabled. The GitHub route below is an
alternative for people who already have an account.

## Edit a page on GitHub

Use **Edit on GitHub** beside **Edit this page** near the top of a current article. GitHub will guide you
through proposing the change. Contributors without write access can submit the
change from a fork as a pull request.

Archived manuals are preserved snapshots. Their notice links to the matching
page in the current documentation, where corrections can be suggested.

## Work locally

1. Fork and clone this repository.
2. Create a branch for the documentation change.
3. Install dependencies with `npm ci`.
4. Edit files under `src/content/docs/`.
5. Run `npm run check`.
6. Open a pull request describing what changed and why.

Use Node.js 22.12 or newer. Keep each pull request focused on one correction or
closely related group of pages.

## Writing and product accuracy

Read [STYLE_GUIDE.md](STYLE_GUIDE.md) before changing the documentation voice,
terminology, or structure. Describe the current released application rather
than planned or historical behavior. If a fact cannot be confirmed in the
current app, say which version you tested and flag the claim for maintainer
verification in the pull request.

Do not include private source paths, implementation symbols, personal data, or
assets you do not have permission to publish.
