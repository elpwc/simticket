'use client';
import { useEffect, useState } from 'react';

const testMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState<boolean>(testMobile());

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
