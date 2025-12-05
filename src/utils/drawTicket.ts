import { drawCRWideTicket } from '@/components/TicketEditors/CRWideTicket/draw';
import { CRTicketBackGround } from '@/components/TicketEditors/CRWideTicket/type';
import { MAG_TICKET_SIZE, PAPER_TICKET_SIZE } from '@/components/TicketEditors/CRWideTicket/value';
import { drawJRWideTicket } from '@/components/TicketEditors/JRWideTicket/draw';
import { JR_MARS_PAPER_TICKET_SIZE } from '@/components/TicketEditors/JRWideTicket/value';

export const drawTicket = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	companyId: number,
	ticketTypeId: number,
	ticketData: any,
	width: number,
	height: number,
	onWidthChanged?: (newValue: number) => void,
	onHeightChanged?: (newValue: number) => void,
	isFlip?: boolean,
	onDone?: () => void,
	onBgImageLoadStart?: () => void,
	onBgImageLoaded?: () => void
) => {
	if (!ticketData) {
		return;
	}
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;

	if (width < 0 && height < 0) {
		onWidthChanged?.(600);
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
							onWidthChanged?.((canvasHeight / PAPER_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[0]);
							width = (canvasHeight / PAPER_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[0];
						} else {
							onWidthChanged?.((canvasHeight / MAG_TICKET_SIZE[1]) * MAG_TICKET_SIZE[0]);
							width = (canvasHeight / MAG_TICKET_SIZE[1]) * MAG_TICKET_SIZE[0];
						}
					}
					if (height < 0) {
						if ([CRTicketBackGround.SoftBlue, CRTicketBackGround.SoftRed, CRTicketBackGround.SoftNoneBackground].includes(ticketData.background || CRTicketBackGround.SoftRed)) {
							onHeightChanged?.((canvasWidth / PAPER_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[1]);
							height = (canvasWidth / PAPER_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[1];
						} else {
							onHeightChanged?.((canvasWidth / MAG_TICKET_SIZE[0]) * MAG_TICKET_SIZE[1]);
							height = (canvasWidth / MAG_TICKET_SIZE[0]) * MAG_TICKET_SIZE[1];
						}
					}
					drawCRWideTicket(canvas, width, height, ctx, ticketData, undefined, isFlip, onDone, onBgImageLoadStart, onBgImageLoaded);
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
						onWidthChanged?.((canvasHeight / JR_MARS_PAPER_TICKET_SIZE[1]) * JR_MARS_PAPER_TICKET_SIZE[0]);
						width = (canvasHeight / JR_MARS_PAPER_TICKET_SIZE[1]) * JR_MARS_PAPER_TICKET_SIZE[0];
					}
					if (height < 0) {
						onHeightChanged?.((canvasWidth / JR_MARS_PAPER_TICKET_SIZE[0]) * JR_MARS_PAPER_TICKET_SIZE[1]);
						height = (canvasWidth / JR_MARS_PAPER_TICKET_SIZE[0]) * JR_MARS_PAPER_TICKET_SIZE[1];
					}
					drawJRWideTicket(canvas, width, height, ctx, ticketData, undefined, isFlip, onDone, onBgImageLoadStart, onBgImageLoaded);
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
