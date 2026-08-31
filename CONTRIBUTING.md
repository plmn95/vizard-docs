# Contributing to Vizard Documentation

Corrections, clearer explanations, and missing documentation are welcome.

## Suggest a correction

If you do not want to edit Markdown, open a
[documentation correction](https://github.com/plmn95/vizard-docs/issues/new?template=documentation-correction.yml).
Include the page URL, what is unclear or incorrect, and the wording you suggest
when you have it.

## Edit a page on GitHub

Use **Edit page** at the bottom of a published article. GitHub will guide you
through proposing the change. Contributors without write access can submit the
change from a fork as a pull request.

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
