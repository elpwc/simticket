'use client';

import { useEffect, useRef, useState } from 'react';
import { drawTicket } from '@/utils/drawTicket';

interface Props {
	width: number;
	height: number;
	className?: string;
	style?: React.CSSProperties;
	borderRadius?: string;
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
}

export const TicketViewer = ({ width, height, className, style, borderRadius, companyId, ticketTypeId, ticketData = {} }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [canvasWidth, setCanvasWidth] = useState(width);
	const [canvasHeight, setCanvasHeight] = useState(height);

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
			(newValue: number) => {
				setCanvasWidth(newValue);
			},
			(newValue: number) => {
				setCanvasHeight(newValue);
			}
		);
	}, [canvasWidth, canvasHeight, canvasRef.current?.width, canvasRef.current?.height, canvasRef.current]);

	return <canvas className={className} style={style} ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};
