// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { FAVICON_PATH } from './src/lib/brand-assets.mjs';

const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
	site: isVercel ? 'https://vizard-docs.vercel.app' : 'https://plmn95.github.io',
	base: process.env.VIZARD_DOCS_BASE || (isVercel ? '/' : '/vizard-docs'),
	integrations: [
		sitemap({ filter: (page) => !/\/(edit|suggestion)(\/|$)/.test(new URL(page).pathname) }),
		starlight({
			title: 'Vizard Documentation',
			favicon: FAVICON_PATH,
			description: 'Documentation for the Vizard video synthesizer.',
			customCss: [
				'@fontsource-variable/jetbrains-mono',
				'./src/styles/vizard.css',
			],
			components: {
				PageTitle: './src/components/PageTitle.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				Footer: './src/components/ManualFooter.astro',
				EditLink: './src/components/GitHubEditLink.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/plmn95/vizard-docs/edit/main/',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Getting Started',
					items: [{ autogenerate: { directory: 'getting-started' } }],
				},
				{
					label: 'Concepts',
					items: [{ autogenerate: { directory: 'concepts' } }],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
