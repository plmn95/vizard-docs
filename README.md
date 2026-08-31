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
