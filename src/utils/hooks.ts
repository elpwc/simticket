import { useEffect, useState } from 'react';

export const useIsMobile = () => {
	const getIsMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(getIsMobile());
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
};
