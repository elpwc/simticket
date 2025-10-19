'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useCurrentLanguage(defaultLang: string = 'zh') {
	const router = useRouter();
	const [currentLang, setCurrentLang] = useState(defaultLang);

	useEffect(() => {
		const match = document.cookie.match(/locale=([a-zA-Z-]+)/);
		if (match) {
			setCurrentLang(match[1]);
		}
	}, []);

	const switchLanguage = (locale: string) => {
		fetch(`/api/set-locale?locale=${locale}`).then(() => {
			setCurrentLang(locale);
			router.refresh();
		});
	};

	return { currentLang, switchLanguage };
}
