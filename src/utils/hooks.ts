'use client';
import { useEffect, useState } from 'react';

export const useIsMobile = () => {
	const testMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	const getInitial = () => {
		if (typeof navigator !== 'undefined') return testMobile();
		// SSR
		return null;
	};
	const [isMobile, setIsMobile] = useState<boolean | null>(getInitial());

	useEffect(() => {
		const getIsMobile = () => testMobile();

		const handleResize = () => {
			setIsMobile(getIsMobile());
		};

		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
};

/**
 * 订阅 CSS media query，用于布局断点（与 Tailwind md: 768px 对齐）。
 * SSR 首帧返回 null，客户端 mount 后更新。
 */
export const useMediaQuery = (query: string): boolean | null => {
	const [matches, setMatches] = useState<boolean | null>(() => {
		if (typeof window === 'undefined') return null;
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		const mq = window.matchMedia(query);
		const update = () => setMatches(mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	}, [query]);

	return matches;
};

/** 竖屏/窄屏：打印列表用 Sheet 而非底部 Dock（≤767px） */
export const useCompactTicketListLayout = (): boolean => {
	const matches = useMediaQuery('(max-width: 767px)');
	return matches ?? false;
};
