'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import zh from '@/messages/zh.json';
import ja from '@/messages/ja.json';

export const LanguageList = [
	{ id: 'zh', name: '中文' },
	{ id: 'ja', name: '日本語' },
];
export type Locale = 'zh' | 'ja';
type Messages = Record<string, string | Record<string, any>>;

const locales: Record<Locale, Messages> = { zh, ja };
const STORAGE_KEY = 'locale';

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
	const result = path.split('.').reduce<any>((acc, key) => {
		if (acc && typeof acc === 'object' && key in acc) {
			return acc[key];
		}
		return undefined;
	}, obj);
	return typeof result === 'string' ? result : undefined;
}

const LocaleContext = createContext<{
	locale: Locale;
	t: (key: string) => string;
	setLocale: (l: Locale) => void;
}>({
	locale: 'zh',
	t: (key: string) => key,
	setLocale: () => {},
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocaleState] = useState<Locale>('zh');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
		if (saved && locales[saved]) {
			setLocaleState(saved);
		} else {
			const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'ja';
			setLocaleState(browserLang as Locale);
			localStorage.setItem(STORAGE_KEY, browserLang);
		}
	}, []);

	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, newLocale);
		}
	};

	const t = (key: string) => {
		const value = getNestedValue(locales[locale], key);
		if (typeof value === 'string') return value;
		return key; // fallback
	};

	return <LocaleContext.Provider value={{ locale, t, setLocale }}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
	const { locale, t: rawT, setLocale } = useContext(LocaleContext);

	const t = (key: string, params?: Record<string, unknown> | unknown, ...rest: unknown[]) => {
		if (typeof window === 'undefined') return '';
		let translated = rawT(key);

		if (params !== undefined && params !== null && typeof params === 'object' && !Array.isArray(params)) {
			translated = translated.replace(/\{(\w+)\}/g, (match, name: string) => {
				const value = (params as Record<string, unknown>)[name];
				return value !== undefined && value !== null ? String(value) : match;
			});
		} else if (params !== undefined || rest.length > 0) {
			const args = [params, ...rest];
			translated = translated.replace(/\{(\d+)\}/g, (match, p1: string) => {
				const value = args[parseInt(p1, 10) - 1];
				return value !== undefined && value !== null ? String(value) : match;
			});
		}

		return translated;
	};

	return { locale, t, setLocale };
};
