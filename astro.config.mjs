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
			customCss: [
				'@fontsource-variable/ibm-plex-sans',
				'@fontsource-variable/jetbrains-mono',
				'./src/styles/vizard.css',
			],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
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
