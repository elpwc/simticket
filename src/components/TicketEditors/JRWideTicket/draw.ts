import { getInitialMethods } from '@/components/TicketEditorCompo/TicketEditorTemplate';
import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRWideTicketDrawParameters } from './type';
import { JRPaymentMethod, JRWideTicketDrawParametersInitialValues, JR_MARS_PAPER_TICKET_CANVAS_SIZE, JR_MARS_PAPER_TICKET_SIZE } from './value';
import { drawText, DrawTextMethod, TextAlign } from '@/utils/utils';
import jr_h from '../../../assets/tickets/jr_h.jpg';
import jr_e from '../../../assets/tickets/jr_e.jpg';
import jr_c from '../../../assets/tickets/jr_c.jpg';
import jr_w from '../../../assets/tickets/jr_w.jpg';
import jr_s from '../../../assets/tickets/jr_s.jpg';
import jr_k from '../../../assets/tickets/jr_k.jpg';

export const drawJRWideTicket = (
	canvas: HTMLCanvasElement | null,
	ctx: CanvasRenderingContext2D | null,
	partialDrawParameters: Partial<JRWideTicketDrawParameters>,
	initialMethods:
		| {
				scaleX: (x: number) => number;
				scaleY: (y: number) => number;
				font: (size: number, fontName: string, isBold?: boolean) => string;
		  }
		| undefined = undefined
) => {
	if (!ctx || !canvas) {
		return;
	}

	const drawParameters: JRWideTicketDrawParameters = {
		...JRWideTicketDrawParametersInitialValues,
		...partialDrawParameters,
	};
	if (initialMethods === undefined) {
		initialMethods = getInitialMethods(
			canvas?.width || JR_MARS_PAPER_TICKET_CANVAS_SIZE[0],
			canvas?.height || JR_MARS_PAPER_TICKET_CANVAS_SIZE[1],
			JR_MARS_PAPER_TICKET_SIZE[0],
			JR_MARS_PAPER_TICKET_SIZE[1],
			1
		);
	}

	const w = canvas.width;
	const h = canvas.height;

	const resizedScaleX = (value: number) => {
		return initialMethods.scaleX(value);
	};
	const resizedScaleY = (value: number) => {
		return initialMethods.scaleY(value);
	};
	const offsetScaleX = (value: number, addOffsetValue: boolean = true) => {
		return initialMethods.scaleX(value) + (addOffsetValue ? drawParameters.offsetX : 0);
	};
	const offsetScaleY = (value: number, addOffsetValue: boolean = true) => {
		return initialMethods.scaleY(value) + (addOffsetValue ? drawParameters.offsetY : 0);
	};
	const resizedFont = (size: number, fontName: string, isBold?: boolean) => {
		return initialMethods.font(size, fontName, isBold);
	};

	const bg = new Image();
	switch (drawParameters.background) {
		case JRTicketBackGround.JR_H:
			bg.src = jr_h.src;
			break;
		case JRTicketBackGround.JR_E:
			bg.src = jr_e.src;
			break;
		case JRTicketBackGround.JR_C:
			bg.src = jr_c.src;
			break;
		case JRTicketBackGround.JR_W:
			bg.src = jr_w.src;
			break;
		case JRTicketBackGround.JR_S:
			bg.src = jr_s.src;
			break;
		case JRTicketBackGround.JR_K:
			bg.src = jr_k.src;
			break;
		case JRTicketBackGround.JR_Empty:
			break;
	}

	const draw = () => {
		// 清空
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// 底图
		switch (drawParameters.background) {
			case JRTicketBackGround.JR_H:
			case JRTicketBackGround.JR_E:
			case JRTicketBackGround.JR_C:
			case JRTicketBackGround.JR_W:
			case JRTicketBackGround.JR_S:
			case JRTicketBackGround.JR_K:
				ctx.drawImage(bg, 0, 0, w, h);
				break;
			case JRTicketBackGround.JR_Empty:
				break;
		}

		// 水印
		if (drawParameters.showWatermark) {
			ctx.fillStyle = '#AF0508';
			ctx.font = `${resizedFont(10, 'DotFont')}`;
			drawText(ctx, drawParameters.watermark, offsetScaleX(116, false), offsetScaleY(921, false), resizedScaleX(300), TextAlign.JustifyAround);

			ctx.strokeStyle = '#AF0508';
			ctx.lineWidth = resizedScaleX(8);
			ctx.strokeRect(offsetScaleX(107, false), offsetScaleY(813, false), resizedScaleX(323), resizedScaleY(125));
			ctx.setLineDash([]);
		}

		// payment method
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(9, 'DotFont')}`;
		if (drawParameters.paymentMethod !== JRPaymentMethod.Cash) {
			let paymentText = '';
			switch (drawParameters.paymentMethod) {
				case JRPaymentMethod.ICCard:
					paymentText = 'IC';
					break;
				case JRPaymentMethod.CreditCard:
					paymentText = 'C制';
					break;
			}
			drawText(ctx, paymentText, offsetScaleX(120), offsetScaleY(220), resizedScaleX(183), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleX(5);
			ctx.strokeRect(offsetScaleX(120), offsetScaleY(139), resizedScaleX(183), resizedScaleY(91));
			ctx.setLineDash([]);
		}

		// ticket type
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(8, 'DotFont')}`;
		drawText(ctx, drawParameters.ticketType, offsetScaleX(313), offsetScaleY(163), resizedScaleX(400), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 0.6);

		// 站名
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(11.5, 'DotFont')}`;
		drawText(
			ctx,
			drawParameters.station1,
			offsetScaleX(113),
			offsetScaleY(drawParameters.doShowEnglish ? 335 : 387),
			resizedScaleX(554),
			TextAlign.JustifyAround,
			DrawTextMethod.fillText,
			0,
			0,
			0.7
		);
		ctx.font = `${resizedFont(11.5, 'DotFont')}`;
		drawText(
			ctx,
			drawParameters.station2,
			offsetScaleX(838),
			offsetScaleY(drawParameters.doShowEnglish ? 335 : 387),
			resizedScaleX(554),
			TextAlign.JustifyAround,
			DrawTextMethod.fillText,
			0,
			0,
			0.7
		);

		// 英文站名
		if (drawParameters.doShowEnglish) {
			ctx.font = resizedFont(4.5, 'DotFont');
			drawText(ctx, drawParameters.station1en, offsetScaleX(183), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
			drawText(ctx, drawParameters.station2en, offsetScaleX(1072), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
		}

		// 箭头
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleY(16);
		ctx.moveTo(offsetScaleX(712), offsetScaleY(337));
		ctx.lineTo(offsetScaleX(751), offsetScaleY(337));
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.lineWidth = resizedScaleY(1);
		ctx.moveTo(offsetScaleX(743), offsetScaleY(360));
		ctx.lineTo(offsetScaleX(766), offsetScaleY(337));
		ctx.lineTo(offsetScaleX(743), offsetScaleY(317));
		ctx.fill();
		ctx.closePath();

		// 経由
		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(ctx, '経由:' + drawParameters.railways.join('・'), offsetScaleX(113), offsetScaleY(458), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

		// 日期时间
		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(ctx, `月   日${'当日限り有効'}`, offsetScaleX(212), offsetScaleY(534), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

		ctx.font = resizedFont(7, 'DotFont');
		drawText(
			ctx,
			`${(drawParameters.date.getMonth() + 1).toString().padStart(2, ' ')} ${drawParameters.date.getDate().toString().padStart(2, ' ')}`,
			offsetScaleX(113),
			offsetScaleY(538),
			resizedScaleX(225),
			TextAlign.Right,
			DrawTextMethod.fillText,
			0,
			0,
			1.25
		);

		// 价格
		ctx.font = resizedFont(5.5, 'DotFont');
		ctx.fillText(`￥`, offsetScaleX(1093), offsetScaleY(534), resizedScaleX(100));
		ctx.font = resizedFont(7, 'DotFont');
		drawText(ctx, `${drawParameters.price}`, offsetScaleX(1133), offsetScaleY(534), resizedScaleX(300), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.25);
	};

	switch (drawParameters.background) {
		case JRTicketBackGround.JR_H:
		case JRTicketBackGround.JR_E:
		case JRTicketBackGround.JR_C:
		case JRTicketBackGround.JR_W:
		case JRTicketBackGround.JR_S:
		case JRTicketBackGround.JR_K:
			// 有背景的
			bg.onload = () => {
				draw();
			};
			break;
		case JRTicketBackGround.JR_Empty:
			draw();
			break;
	}
};
