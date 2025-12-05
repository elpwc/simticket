'use client';

import { useEffect, useRef, useState } from 'react';
import { drawTicket } from '@/utils/drawTicket';
import { s } from 'motion/react-client';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	width: number;
	height: number;
	className?: string;
	style?: React.CSSProperties;
	borderRadius?: string;
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
	showLoadingStatus?: boolean;
	isFlip?: boolean;
}

export const TicketViewer = ({ width, height, className, style, borderRadius, companyId, ticketTypeId, ticketData = {}, showLoadingStatus = true, isFlip = false }: Props) => {
	const { t } = useLocale();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [canvasWidth, setCanvasWidth] = useState(width);
	const [canvasHeight, setCanvasHeight] = useState(height);

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
			},
			/*onHeightChanged*/
			(newValue: number) => {
				setCanvasHeight(newValue);
			},
			isFlip,
			/*onDone*/ () => {
				setLoadingBgHintText('');
			},
			/* onBgImageLoadStart */ () => {
				setLoadingBgHintText(showLoadingStatus ? '>' + t('TicketViewer.loadingBackgroundImage') + '...' : '');
			},
			/* onBgImageLoaded */ () => {
				setLoadingBgHintText('');
			}
		);
	}, [canvasWidth, canvasHeight, canvasRef.current?.width, canvasRef.current?.height, canvasRef.current, isFlip, ticketData, ticketTypeId, companyId]);

	return (
		<div className="relative">
			<canvas className={className} style={style} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
			<div className="absolute top-0 left-0 text-[gray] text-[12px]">
				<p>{loadingBgHintText}</p>
			</div>
		</div>
	);
};
