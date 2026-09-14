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

The development server prints the local URL. To validate the documentation and
create a production build, run:

```sh
npm run check
```

## Contributing

Small corrections can be made with the **Edit page** link on the published
site. For larger changes, read [CONTRIBUTING.md](CONTRIBUTING.md) and open a
pull request.

## Manuals shipped with Vizard

`npm run build:release -- vX.Y.Z` builds a complete manual at
`/vizard-docs/releases/vX.Y.Z/`, with release identity, local search and a hashed
file inventory in `dist/manifest.json`. The app build captures newest docs main
once and keeps the generated bundle for every platform and release retry.

Current docs continue deploying on main pushes. App releases upload the already
built `manual.zip` and `manual.zip.json` to matching docs releases. Deployment
runs `npm run assemble:archives` after building current docs, copying those
verified files unchanged into `dist/releases`. Never rebuild/restyle old manuals
or replace published release tags/assets. The `/versions/` page links to current
and archived manuals; links from installed manuals are marked online.

Run `npm run test:archives` to check preservation and failure behavior. To deploy
current docs explicitly: `gh workflow run deploy.yml --repo plmn95/vizard-docs`.
The app repository owns publication credentials and the build/release procedure.
