// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://plmn95.github.io',
	base: '/vizard-docs',
	integrations: [
		starlight({
			title: 'Vizard Documentation',
			description: 'Documentation for the Vizard video synthesizer.',
			editLink: {
				baseUrl: 'https://github.com/plmn95/vizard-docs/edit/main/',
			},
			lastUpdated: true,
			social: [
				{
					icon: 'github',
					label: 'Vizard documentation on GitHub',
					href: 'https://github.com/plmn95/vizard-docs',
				},
			],
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
