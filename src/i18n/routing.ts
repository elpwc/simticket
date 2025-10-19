import { defineRouting } from 'next-intl/routing';

export const LanguageList = [
	{
		id: 'zh',
		name: '中文',
	},
	{
		id: 'ja',
		name: '日本語',
	},
];

export const routing = defineRouting({
	locales: LanguageList.map((lang) => lang.id),

	defaultLocale: 'zh',
});
