# Vizard Documentation

This repository contains the public documentation for Vizard, a video
synthesizer you play rather than a video editor you configure.

The published site is available at
[plmn95.github.io/vizard-docs](https://plmn95.github.io/vizard-docs/).

## Local development

Vizard Documentation uses [Starlight](https://starlight.astro.build/) and
requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

### Suggestion form

The per-page **Suggest an edit** drawer runs in an explicit local prototype mode
until `PUBLIC_SUGGESTION_ENDPOINT` is set at build time. The endpoint must accept
an unauthenticated JSON `POST` containing `pageTitle`, `pageUrl`, `problem`,
`wording`, and `email`, and return a successful HTTP status. Keep abuse controls,
rate limiting, storage, and moderation in that service rather than in the public
GitHub Pages client.

The development server prints the local URL. To validate the documentation and
create a production build, run:

```sh
npm run check
```

## Contributing

Small corrections can be made with the **Edit page** link on the published
site. For larger changes, read [CONTRIBUTING.md](CONTRIBUTING.md) and open a
pull request.
