'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

type ThemeContextValue = {
	theme: ThemePreference;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemePreference) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
	theme: 'system',
	resolvedTheme: 'light',
	setTheme: () => {},
	toggleTheme: () => {},
});

function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
	return preference === 'system' ? getSystemTheme() : preference;
}

function applyThemeClass(resolved: ResolvedTheme) {
	const root = document.documentElement;
	root.classList.toggle('dark', resolved === 'dark');
	root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<ThemePreference>('system');
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
		const initial = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
		const resolved = resolveTheme(initial);
		setThemeState(initial);
		setResolvedTheme(resolved);
		applyThemeClass(resolved);
	}, []);

	useEffect(() => {
		if (theme !== 'system') return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => {
			const resolved = getSystemTheme();
			setResolvedTheme(resolved);
			applyThemeClass(resolved);
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, [theme]);

	const setTheme = useCallback((next: ThemePreference) => {
		setThemeState(next);
		localStorage.setItem(STORAGE_KEY, next);
		const resolved = resolveTheme(next);
		setResolvedTheme(resolved);
		applyThemeClass(resolved);
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	}, [resolvedTheme, setTheme]);

	const value = useMemo(
		() => ({
			theme,
			resolvedTheme,
			setTheme,
			toggleTheme,
		}),
		[theme, resolvedTheme, setTheme, toggleTheme]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}
