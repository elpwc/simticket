'use client';

import { JSX, useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import { saveCanvasToLocal } from '@/utils/utils';
import TiltCanvas from '../TiltCanvas';
import Toggle from '../../InfrastructureCompo/Toggle';
import { useIsMobile } from '@/utils/hooks';
import clsx from 'clsx';
import { SaveImageModal } from '@/components/Modals/SaveImageModal';
import { useLocale } from '@/utils/hooks/useLocale';
import { AppContext } from '@/app/app';

export const getInitialMethods = (w: number, h: number, scaleXWidth: number, scaleYWidth: number, currentSizeScale: number = 1) => {
	const scaleX = (x: number) => (x / (scaleXWidth * currentSizeScale)) * w;
	const scaleY = (y: number) => (y / (scaleYWidth * currentSizeScale)) * h;
	const font = (size: number, fontName: string, isBold: boolean = false) => `${isBold ? 'bold' : ''} ${(size / (100 * currentSizeScale)) * h}px ${fontName}`;
	return { scaleX, scaleY, font };
};

interface Props {
	onCanvasLoad: (
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D | null,
		scaleX: (x: number) => number,
		scaleY: (y: number) => number,
		font: (size: number, fontName: string) => string
	) => void;
	canvasWidth: number;
	canvasHeight: number;
	canvasBorderRadius?: number;
	canvasShowShandow?: boolean;
	scaleXWidth: number;
	scaleYWidth: number;
	// save
	ticketData: any;
	saveFilename: string;
	// form
	form: JSX.Element | null;
	isFontLoading?: boolean;
	onScaleChange?: (scale: number) => void;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
	onCanvasLoad,
	canvasWidth,
	canvasHeight,
	canvasBorderRadius = 0,
	canvasShowShandow = true,
	scaleXWidth,
	scaleYWidth,
	ticketData,
	saveFilename,
	form,
	isFontLoading,
	onScaleChange,
}: Props) => {
	const isMobile = useIsMobile();
	const { t } = useLocale();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [enableCanvasTilt, setEnableCanvasTilt] = useState(true);
	const [currentSizeScale, setCurrentSizeScale] = useState(isMobile ? 1 : 1.4);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);

	const drawTicket = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const w = canvasWidth * currentSizeScale ** 2;
		const h = canvasHeight * currentSizeScale ** 2;

		const { scaleX, scaleY, font } = getInitialMethods(w, h, scaleXWidth, scaleYWidth, currentSizeScale);

		ctx.clearRect(0, 0, w, h);

		onCanvasLoad(canvas, ctx, scaleX, scaleY, font);
	};

	useEffect(() => {
		drawTicket();
	}, []);

	useEffect(() => {
		drawTicket();
	}, [currentSizeScale, canvasHeight, canvasWidth, scaleXWidth, scaleYWidth]);

	const increaseScale = () => {
		setCurrentSizeScale((prev) => {
			onScaleChange?.(Number((prev + 0.1).toFixed(1)));
			return Number((prev + 0.1).toFixed(1));
		});
	};

	const reduceScale = () => {
		setCurrentSizeScale((prev) => {
			onScaleChange?.(Number((prev - 0.1).toFixed(1)));
			return Number((prev - 0.1).toFixed(1));
		});
	};

	return (
		<div className={clsx(isMobile ? 'flex-col' : 'flex-row', 'w-[100%] flex items-start justify-start')}>
			<div
				className={clsx(
					isMobile ? 'w-[100%] border-b border-solid border-gray-300' : 'w-[40%]',
					'flex flex-col items-center h-[100%] sticky top-[56px] z-[50] bg-[#ffffff9e] backdrop-blur-[8px] '
				)}
			>
				<div className="flex justify-center items-center flex-wrap">
					<div className="ticketEditorTemplateToolBarItem flex">
						<button
							onClick={() => {
								increaseScale();
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
							</svg>
						</button>
						<span>{currentSizeScale.toFixed(1) + '×'}</span>
						<button
							onClick={() => {
								reduceScale();
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
							</svg>
						</button>
					</div>
					<button
						className="ticketEditorTemplateToolBarItem flex items-center gap-1"
						onClick={() => {
							drawTicket();
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
							<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
						</svg>
						{t('TicketEditorTemplate.updateButton')}
					</button>
					<button
						className="ticketEditorTemplateToolBarItem flex items-center gap-1"
						onClick={() => {
							setShowSaveImageModal(true);
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
							<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
						</svg>
						{t('TicketEditorTemplate.saveButton')}
					</button>
					<button
						className="ticketEditorTemplateToolBarItem flex items-center gap-1"
						onClick={() => {
							setShowSaveImageModal(true);
						}}
					>
						{t('TicketEditorTemplate.reverse')}
					</button>
					<label className="ticketEditorTemplateToolBarItem">
						<Toggle
							value={enableCanvasTilt}
							onChange={(value) => {
								setEnableCanvasTilt(value);
							}}
						/>
						<span>{t('TicketEditorTemplate.flipEffectButton')}</span>
					</label>
				</div>
				<div>{isFontLoading && <span className="text-sm text-gray-500">{t('TicketEditorTemplate.loadingFontText')}</span>}</div>

				<TiltCanvas
					doTilt={enableCanvasTilt}
					ref={canvasRef}
					width={canvasWidth * currentSizeScale}
					height={canvasHeight * currentSizeScale}
					className={`m-10 ${canvasShowShandow ? 'shadow-[0_0_16px_0px_#d1d1d1]' : ''}`}
					borderRadius={`${canvasBorderRadius}px`}
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
			<SaveImageModal
				show={showSaveImageModal}
				ticketInfo={{
					companyId: selectedCompanyId,
					ticketTypeId: selectedTicketId,
					ticketData: ticketData,
					id: '',
				}}
				saveFilename={saveFilename}
				onClose={() => {
					setShowSaveImageModal(false);
				}}
				defaultCanvasSize={[canvasWidth, canvasHeight]}
			/>
		</div>
	);
};
