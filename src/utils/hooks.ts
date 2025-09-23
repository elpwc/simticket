'use client';
import { useEffect, useState } from 'react';

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const getIsMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		const handleResize = () => {
			setIsMobile(getIsMobile());
		};

		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
};
