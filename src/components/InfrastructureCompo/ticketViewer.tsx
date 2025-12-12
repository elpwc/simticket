'use client';

import { useEffect, useRef, useState } from 'react';
import { drawTicket } from '@/utils/drawTicket';
import { useLocale } from '@/utils/hooks/useLocale';
import TiltCanvas from '../TicketEditorCompo/TiltCanvas';
import { CRTicketBackGround } from '../TicketEditors/CRWideTicket/type';

interface Props {
	width: number;
	height: number;
	className?: string;
	style?: React.CSSProperties;
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
	borderRadius?: string;
	showLoadingStatus?: boolean;
	isFlip?: boolean;
	isTiltable?: boolean;
	doPreventRenderError?: boolean;
	onCanvasSizeChanged?: (w: number, h: number) => void;
}

export const TicketViewer = ({
	width,
	height,
	className,
	style,
	companyId,
	ticketTypeId,
	ticketData = {},
	/** unused */
	borderRadius,
	showLoadingStatus = true,
	isFlip = false,
	isTiltable = false,
	/** Render another time after normal render, とにかくdon't use it unless errorが出た */
	doPreventRenderError = false,
	onCanvasSizeChanged = (w: number, h: number) => {},
}: Props) => {
	const { t } = useLocale();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [canvasWidth, setCanvasWidth] = useState(width);
	const [canvasHeight, setCanvasHeight] = useState(height);

	const [loadingFontHintText, setLoadingFontHintText] = useState<string>('');
	const [loadingBgHintText, setLoadingBgHintText] = useState<string>('');

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			ctxRef.current = canvas.getContext('2d');
		}
		const ctx = ctxRef.current;
		if (!ticketData || !canvas || !ctx) {
			return;
		}
		const draw = () => {
			drawTicket(
				canvas,
				ctx,
				companyId,
				ticketTypeId,
				ticketData,
				width,
				height,
				/*onWidthChanged*/
				(newValue: number) => {
					setCanvasWidth(newValue);
					onCanvasSizeChanged?.(newValue, height);
				},
				/*onHeightChanged*/
				(newValue: number) => {
					setCanvasHeight(newValue);
					onCanvasSizeChanged?.(width, newValue);
				},
				isFlip,
				/*onDone*/ () => {
					setLoadingFontHintText('');
					setLoadingBgHintText('');
				},
				/* onBgImageLoadStart */ () => {
					setLoadingBgHintText(showLoadingStatus ? '>' + t('TicketViewer.loadingBackgroundImage') + '...' : '');
				},
				/* onBgImageLoaded */ () => {
					setLoadingBgHintText('');
				},
				/* onFontLoadStart */ () => {
					setLoadingFontHintText(showLoadingStatus ? '>' + t('TicketViewer.loadingFont') + '...' : '');
				},
				/* onFontLoaded */ () => {
					setLoadingFontHintText('');
				}
			);
		};

		draw();
		if (doPreventRenderError) {
			setTimeout(() => {
				draw();
			}, 500);
		}
	}, [canvasRef.current?.width, canvasRef.current?.height, canvasRef.current, isFlip, ticketData, ticketTypeId, companyId]);

	const canvasBorderRadius = companyId === 0 && ticketTypeId === 4 && (ticketData.background === CRTicketBackGround.MagBlue || ticketData.background === CRTicketBackGround.MagRed) ? 16 : 0;
	const canvasShowShandow = (companyId === 0 && ticketTypeId === 4 && ticketData.background !== CRTicketBackGround.MagBlue && ticketData.background !== CRTicketBackGround.MagRed) || companyId !== 0;

	return (
		<div className="relative flex justify-center items-center">
			{isTiltable ? (
				<TiltCanvas
					doTilt={true}
					ref={canvasRef}
					width={canvasWidth}
					height={canvasHeight}
					className={`m-10 ${canvasShowShandow ? 'shadow-[0_0_16px_0px_#d1d1d1]' : ''}`}
					borderRadius={`${canvasBorderRadius}px`}
					onWheel={(isZoomIn: boolean) => {}}
				/>
			) : (
				<canvas className={className} style={style} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
			)}
			<div className="absolute top-0 left-0 text-[gray] text-[12px]">
				<p>{loadingFontHintText}</p>
				<p>{loadingBgHintText}</p>
			</div>
		</div>
	);
};
