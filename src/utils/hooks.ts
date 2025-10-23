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
