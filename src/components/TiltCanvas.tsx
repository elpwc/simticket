'use client';

import { motion, useMotionValue } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface Props {
	width: number | string;
	height: number | string;
	className: string;
	doTilt?: boolean;
	onWheel: (isZoomIn: boolean) => void;
}

const TiltCanvas = forwardRef<HTMLCanvasElement, Props>(({ width, height, className, doTilt = true, onWheel }: Props, ref) => {
	const rotateX = useMotionValue(0);
	const rotateY = useMotionValue(0);
	const [enabled, setEnabled] = useState(true);
	const maxRotate = 20;
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

	// mouse
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!enabled) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const offsetX = x / rect.width - 0.5;
		const offsetY = y / rect.height - 0.5;

		rotateX.set(-offsetY * maxRotate);
		rotateY.set(offsetX * maxRotate);
	};

	const handleMouseLeave = () => {
		if (!enabled) return;
		rotateX.set(0);
		rotateY.set(0);
	};

	useEffect(() => {
		setEnabled(doTilt);
	}, [doTilt]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const wheelHandler = (e: any) => {
			e.preventDefault();
			if (e.deltaY > 0) {
				onWheel(false);
			} else if (e.deltaY < 0) {
				onWheel(true);
			}
		};
		canvas?.addEventListener('wheel', wheelHandler, { passive: false });

		return () => {
			canvas?.removeEventListener('wheel', wheelHandler);
		};
	}, []);

	// mobile gyroscope
	useEffect(() => {
		if (!enabled) return;

		const handleOrientation = (e: DeviceOrientationEvent) => {
			// beta: 前後, gamma: 左右
			const beta = e.beta ?? 0; // [-180, 180]
			const gamma = e.gamma ?? 0; // [-90, 90]

			const mappedX = Math.max(-maxRotate, Math.min(maxRotate, -beta / 10));
			const mappedY = Math.max(-maxRotate, Math.min(maxRotate, gamma / 10));

			rotateX.set(mappedX);
			rotateY.set(mappedY);
		};

		window.addEventListener('deviceorientation', handleOrientation, true);
		// eslint-disable-next-line consistent-return
		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, [enabled, rotateX, rotateY]);
	return (
		<motion.div
			style={{
				display: 'inline-table',
				width: width,
				height: '100%',
				perspective: 1000,
			}}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<motion.canvas
				className={className}
				id="tiltCanvas"
				ref={canvasRef}
				width={width}
				height={height}
				style={{
					transformStyle: 'preserve-3d',
					rotateX: enabled ? rotateX : 0,
					rotateY: enabled ? rotateY : 0,
					scale: 1,
				}}
				transition={{
					type: 'spring',
					stiffness: 150,
					damping: 20,
				}}
			/>
		</motion.div>
	);
});

TiltCanvas.displayName = 'TiltCanvas';
export default TiltCanvas;
