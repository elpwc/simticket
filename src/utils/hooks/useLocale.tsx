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

export const useLocale = (...baseKeys: string[]) => {
	const { locale, t: rawT, setLocale } = useContext(LocaleContext);

	const t = (key: string) => {
		for (const baseKey of baseKeys) {
			const fullKey = `${baseKey}.${key}`;
			const translated = rawT(fullKey);
			if (translated !== fullKey) return translated;
		}
		return rawT(key);
	};

	return { locale, t, setLocale };
};
