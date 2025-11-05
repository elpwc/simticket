import { useEffect, useRef, useState } from 'react';
import { drawTicket } from '@/utils/drawTicket';

interface Props {
	width: number;
	height: number;
	className?: string;
	borderRadius?: string;
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
}

export const TicketViewer = ({ width, height, className, borderRadius, companyId, ticketTypeId, ticketData = {} }: Props) => {
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
	}, []);

	return (
		<div
			style={{
				display: 'inline-table',
				width: canvasWidth,
				height: '100%',
			}}
		>
			<canvas className={className} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
		</div>
	);
};
