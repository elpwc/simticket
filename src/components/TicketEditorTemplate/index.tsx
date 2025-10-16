'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import './index.css';
import { saveCanvasToLocal } from '@/utils/utils';
import TiltCanvas from '../TiltCanvas';
import Toggle from '../Toggle';
import { useIsMobile } from '@/utils/hooks';
import clsx from 'clsx';

interface Props {
	onCanvasLoad: (
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D | null,
		scaleX: (x: number) => number,
		scaleY: (y: number) => number,
		fontSize: (size: number, isSerif?: boolean) => string,
		wordWidth: number
	) => void;
	canvasWidth: number;
	canvasHeight: number;
	scaleXWidth: number;
	scaleYWidth: number;
	saveFilename: string;
	form: JSX.Element | null;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ onCanvasLoad, canvasWidth, canvasHeight, scaleXWidth, scaleYWidth, saveFilename, form }: Props) => {
	const isMobile = useIsMobile();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [enableCanvasTilt, setEnableCanvasTilt] = useState(true);
	const [currentSizeScale, setCurrentSizeScale] = useState(1);

	const drawTicket = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const w = canvas.width * currentSizeScale;
		const h = canvas.height * currentSizeScale;

		const scaleX = (x: number) => (x / (scaleXWidth * currentSizeScale)) * w;
		const scaleY = (y: number) => (y / (scaleYWidth * currentSizeScale)) * h;
		const wordWidth = h / (100 * currentSizeScale);
		const fontSize = (size: number, isSerif: boolean = false) => `${(size / (100 * currentSizeScale)) * h}px ${isSerif ? 'serif' : 'sans-serif'}`;

		ctx.clearRect(0, 0, w, h);

		onCanvasLoad(canvas, ctx, scaleX, scaleY, fontSize, wordWidth);
	};

	useEffect(() => {
		drawTicket();
	}, []);

	useEffect(() => {
		drawTicket();
	}, [currentSizeScale]);

	const increaseScale = () => {
		setCurrentSizeScale((prev) => Number((prev + 0.1).toFixed(1)));
	};

	const reduceScale = () => {
		setCurrentSizeScale((prev) => Number((prev - 0.1).toFixed(1)));
	};

	return (
		<div className={clsx(isMobile ? 'flex-col' : 'flex-row', 'w-[100%] flex items-start justify-start')}>
			<div className={clsx(isMobile ? 'w-[100%] border-b-[solid_1px_#ccc]' : 'w-[40%]', 'flex flex-col items-center h-[100%] sticky top-[56px] z-[50] bg-[#ffffff9e] backdrop-blur-[8px] ')}>
				<div className="flex justify-center items-center">
					<button
						onClick={() => {
							increaseScale();
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
						</svg>
					</button>
					<span>{currentSizeScale.toFixed(1)}</span>
					<button
						onClick={() => {
							reduceScale();
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
						</svg>
					</button>
					<button
						className="flex items-center gap-1"
						onClick={() => {
							drawTicket();
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
							<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
						</svg>
						画像更新
					</button>
					<button
						className="flex items-center gap-1"
						onClick={() => {
							saveCanvasToLocal(canvasRef.current, saveFilename);
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
							<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
						</svg>
						画像保存
					</button>
					<label>
						<Toggle
							value={enableCanvasTilt}
							onChange={(value) => {
								setEnableCanvasTilt(value);
							}}
						/>
						<span>翻转效果</span>
					</label>
				</div>

				<TiltCanvas
					doTilt={enableCanvasTilt}
					ref={canvasRef}
					width={canvasWidth * currentSizeScale}
					height={canvasHeight * currentSizeScale}
					className="m-10 shadow-[0_0_16px_0px_#d1d1d1]"
					onWheel={(isZoomIn: boolean) => {
						if (isZoomIn) {
							increaseScale();
						} else {
							reduceScale();
						}
					}}
				/>
			</div>
			<div className={clsx(isMobile ? 'w-[100%]' : 'w-[60%]')}>{form}</div>
		</div>
	);
};
