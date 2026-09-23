// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import suggestionPassages from './src/lib/suggestions/remark.mjs';
import { revision, enabled } from './src/lib/suggestions/config.mjs';

const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
	markdown: { processor: unified({ remarkPlugins: [[suggestionPassages, { revision, enabled }]] }) },
	site: isVercel ? 'https://vizard-docs.vercel.app' : 'https://plmn95.github.io',
	base: process.env.VIZARD_DOCS_BASE || (isVercel ? '/' : '/vizard-docs'),
	integrations: [
		starlight({
			title: 'Vizard Documentation',
			description: 'Documentation for the Vizard video synthesizer.',
			customCss: [
				'@fontsource-variable/jetbrains-mono',
				'./src/styles/vizard.css',
			],
			components: {
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
