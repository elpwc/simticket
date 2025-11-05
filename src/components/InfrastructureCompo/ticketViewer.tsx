import { useEffect, useRef, useState } from 'react';
import { drawCRWideTicket } from '../TicketEditors/CRWideTicket/draw';
import { MAG_TICKET_SIZE, PAPER_TICKET_SIZE } from '../TicketEditors/CRWideTicket/value';
import { CRTicketBackGround } from '../TicketEditors/CRWideTicket/type';
import { drawJRWideTicket } from '../TicketEditors/JRWideTicket/draw';
import { JR_MARS_PAPER_TICKET_SIZE } from '../TicketEditors/JRWideTicket/value';

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

	const draw = () => {
		if (!ticketData) {
			return;
		}
		const canvas = canvasRef.current;
		if (canvas) {
			ctxRef.current = canvas.getContext('2d');
		}
		const ctx = ctxRef.current;

		if (width < 0 && height < 0) {
			setCanvasWidth(600);
		}
		switch (companyId) {
			case 0: //CR
				switch (ticketTypeId) {
					case 0:
					case 1:
					case 2:
					case 3:
						break;
					case 4:
						if (width < 0) {
							if ([CRTicketBackGround.SoftBlue, CRTicketBackGround.SoftRed, CRTicketBackGround.SoftNoneBackground].includes(ticketData.background || CRTicketBackGround.SoftRed)) {
								setCanvasWidth((canvasHeight / PAPER_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[0]);
							} else {
								setCanvasWidth((canvasHeight / MAG_TICKET_SIZE[1]) * MAG_TICKET_SIZE[0]);
							}
						}
						if (height < 0) {
							if ([CRTicketBackGround.SoftBlue, CRTicketBackGround.SoftRed, CRTicketBackGround.SoftNoneBackground].includes(ticketData.background || CRTicketBackGround.SoftRed)) {
								setCanvasHeight((canvasWidth / PAPER_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[1]);
							} else {
								setCanvasHeight((canvasWidth / MAG_TICKET_SIZE[0]) * MAG_TICKET_SIZE[1]);
							}
						}
						drawCRWideTicket(canvas, ctx, ticketData);
						break;
					default:
						break;
				}
			case 1: // JR
				switch (ticketTypeId) {
					case 0:
						break;
					case 1:
						if (width < 0) {
							setCanvasWidth((canvasHeight / JR_MARS_PAPER_TICKET_SIZE[1]) * JR_MARS_PAPER_TICKET_SIZE[0]);
						}
						if (height < 0) {
							setCanvasHeight((canvasWidth / JR_MARS_PAPER_TICKET_SIZE[0]) * JR_MARS_PAPER_TICKET_SIZE[1]);
						}
						drawJRWideTicket(canvas, ctx, ticketData);
						break;
					case 2:
					default:
						break;
				}
			case 2: // JNR
				switch (ticketTypeId) {
					case 0:
					default:
						break;
				}
			case 3: // TR
				switch (ticketTypeId) {
					case 0:
					case 1:
					case 2:
					default:
						break;
				}
			case 4: // THSR
			case 5: // VNR
			case 6: // KR
			default:
				break;
		}
	};

	useEffect(() => {
		draw();
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
