'use client';

import { JSX, useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import TiltCanvas from '../TiltCanvas';
import Toggle from '../../InfrastructureCompo/Toggle';
import { useCompactTicketListLayout } from '@/utils/hooks';
import clsx from 'clsx';
import { SaveImageModal } from '@/components/Modals/SaveImageModal';
import { useLocale } from '@/utils/hooks/useLocale';
import { AppContext } from '@/app/app';
import { UploadTicketModal } from '@/components/Modals/UploadTicketModal';
import { CopyLinkModal } from '@/components/Modals/CopyLinkModal';

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
	ticketData: any;
	saveFilename: string;
	form: JSX.Element | null;
	isFontLoading?: boolean;
	isBgImageLoading?: boolean;
	onScaleChange?: (scale: number) => void;
	onFlip?: (isFlip: boolean) => void;
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
	isBgImageLoading,
	onScaleChange,
	onFlip,
}: Props) => {
	const isCompactEditor = useCompactTicketListLayout();
	const { t } = useLocale();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const mobilePreviewRef = useRef<HTMLDivElement | null>(null);

	const [enableCanvasTilt, setEnableCanvasTilt] = useState(!isCompactEditor);
	const [currentSizeScale, setCurrentSizeScale] = useState(isCompactEditor ? 0.85 : 1.4);
	const [previewExpanded, setPreviewExpanded] = useState(true);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);
	const [showUploadTicketModal, setShowUploadTicketModal] = useState(false);
	const [showCopyLinkModal, setShowCopyLinkModal] = useState(false);
	const [isFlipSide, setIsFlipSide] = useState(false);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		drawTicket();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSizeScale, canvasHeight, canvasWidth, scaleXWidth, scaleYWidth]);

	// 窄屏：根据预览区实际高度，让分组 Tab 始终贴在预览区下方
	useEffect(() => {
		if (!isCompactEditor) return;
		const previewEl = mobilePreviewRef.current;
		const rootEl = previewEl?.closest('.editor-template--compact') as HTMLElement | null;
		if (!previewEl || !rootEl) return;

		const syncNavOffset = () => {
			rootEl.style.setProperty('--editor-mobile-section-nav-top', `calc(var(--editor-mobile-header-height) + ${previewEl.offsetHeight}px)`);
		};

		syncNavOffset();
		const observer = new ResizeObserver(syncNavOffset);
		observer.observe(previewEl);
		return () => observer.disconnect();
	}, [isCompactEditor, previewExpanded]);

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

	const handleFlip = () => {
		onFlip?.(!isFlipSide);
		setIsFlipSide((prev) => !prev);
	};

	const loadingHint = (
		<span className="editor-template__loading-hint text-sm text-gray-500">
			{isFontLoading && t('TicketEditorTemplate.loadingFontText')}
			{isFontLoading && isBgImageLoading ? '　' : null}
			{isBgImageLoading && t('TicketEditorTemplate.loadingImage')}
		</span>
	);

	const canvasNode = (
		<TiltCanvas
			doTilt={enableCanvasTilt && !isCompactEditor}
			ref={canvasRef}
			width={canvasWidth * currentSizeScale}
			height={canvasHeight * currentSizeScale}
			className={clsx(isCompactEditor ? 'editor-template__canvas--compact' : 'm-10', canvasShowShandow && 'shadow-[0_0_16px_0px_#d1d1d1]')}
			borderRadius={`${canvasBorderRadius}px`}
			onWheel={(isZoomIn: boolean) => {
				if (isZoomIn) increaseScale();
				else reduceScale();
			}}
		/>
	);

	const secondaryToolbar = (
		<div className="editor-template__secondary-tools">
			<div className="ticketEditorTemplateToolBarItem flex items-center">
				<button type="button" className="editor-template__icon-btn" onClick={increaseScale} aria-label="Zoom in">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
					</svg>
				</button>
				<span className="text-xs">{currentSizeScale.toFixed(1)}×</span>
				<button type="button" className="editor-template__icon-btn" onClick={reduceScale} aria-label="Zoom out">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
					</svg>
				</button>
			</div>
			<button type="button" className="editor-template__icon-btn" onClick={drawTicket} aria-label={t('TicketEditorTemplate.updateButton')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
					<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
				</svg>
			</button>
			<button type="button" className="editor-template__icon-btn" onClick={() => setShowCopyLinkModal(true)} title="copy URL">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
				</svg>
			</button>
			<button type="button" className="editor-template__icon-btn" onClick={() => setShowUploadTicketModal(true)} title="投稿">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<path
						fillRule="evenodd"
						d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0m-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0"
					/>
				</svg>
			</button>
			<label className="ticketEditorTemplateToolBarItem flex items-center gap-1 text-xs">
				<Toggle value={enableCanvasTilt} onChange={setEnableCanvasTilt} />
				<span>{t('TicketEditorTemplate.flipEffectButton')}</span>
			</label>
		</div>
	);

	const mobilePreviewToolbar = (
		<div className="editor-template__mobile-preview-tools">
			{secondaryToolbar}
			<button type="button" className="ticketEditorTemplateToolBarItem flex items-center gap-1 primary green" onClick={() => setShowSaveImageModal(true)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
					<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
				</svg>
				{t('TicketEditorTemplate.saveButton')}
			</button>
			<button type="button" className="ticketEditorTemplateToolBarItem flex items-center gap-1" onClick={handleFlip}>
				{isFlipSide ? t('TicketEditorTemplate.reverse2') : t('TicketEditorTemplate.reverse')}
			</button>
		</div>
	);

	const modals = (
		<>
			<SaveImageModal
				show={showSaveImageModal}
				ticketInfo={{
					companyId: selectedCompanyId,
					ticketTypeId: selectedTicketId,
					ticketData: ticketData,
					id: '',
				}}
				saveFilename={saveFilename}
				onClose={() => setShowSaveImageModal(false)}
				defaultCanvasSize={[canvasWidth, canvasHeight]}
			/>
			<UploadTicketModal
				show={showUploadTicketModal}
				ticketInfo={{
					companyId: selectedCompanyId,
					ticketTypeId: selectedTicketId,
					ticketData: ticketData,
					id: '',
				}}
				onClose={() => setShowUploadTicketModal(false)}
			/>
			<CopyLinkModal
				show={showCopyLinkModal}
				ticketInfo={{
					companyId: selectedCompanyId,
					ticketTypeId: selectedTicketId,
					ticketData: ticketData,
					id: '',
				}}
				onClose={() => setShowCopyLinkModal(false)}
				onSubmitButtonClick={() => setShowUploadTicketModal(true)}
			/>
		</>
	);

	if (isCompactEditor) {
		return (
			<div className="editor-template editor-template--compact">
				{/* 窄屏：预览默认展开，整块固定在顶栏下方 */}
				<div ref={mobilePreviewRef} className="editor-template__mobile-preview">
					<div className="editor-template__mobile-preview-bar">
						<button
							type="button"
							className="editor-template__mobile-preview-toggle"
							onClick={() => setPreviewExpanded((v) => !v)}
							aria-expanded={previewExpanded}
						>
							<span>{t('TicketEditorTemplate.previewLabel')}</span>
							<span className="editor-template__mobile-preview-action">{previewExpanded ? t('TicketEditorTemplate.previewCollapse') : t('TicketEditorTemplate.previewExpand')}</span>
						</button>
					</div>
					{previewExpanded && (
						<div className="editor-template__mobile-preview-body">
							{mobilePreviewToolbar}
							<div className="editor-template__canvas-wrap">{canvasNode}</div>
							{loadingHint}
						</div>
					)}
				</div>

				<div className="editor-template-form-column editor-template-form-column--compact">{form}</div>

				{modals}
			</div>
		);
	}

	return (
		<div className="editor-template editor-template--desktop w-[100%] flex flex-row items-start justify-start">
			<div className="editor-template__desktop-preview w-[40%] flex flex-col items-center h-[100%] sticky z-[50] bg-[#ffffff9e] backdrop-blur-[8px]" style={{ top: '56px' }}>
				<div className="flex justify-center items-center flex-wrap">
					{secondaryToolbar}
					<button type="button" className="ticketEditorTemplateToolBarItem flex items-center gap-1 primary green" onClick={() => setShowSaveImageModal(true)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
							<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
						</svg>
						{t('TicketEditorTemplate.saveButton')}
					</button>
					<button type="button" className="ticketEditorTemplateToolBarItem flex items-center gap-1" onClick={handleFlip}>
						{isFlipSide ? t('TicketEditorTemplate.reverse2') : t('TicketEditorTemplate.reverse')}
					</button>
				</div>
				{canvasNode}
				{loadingHint}
			</div>
			<div className="editor-template-form-column w-[60%]">{form}</div>
			{modals}
		</div>
	);
};
