import { getInitialMethods } from '@/components/TicketEditorCompo/TicketEditorTemplate';
import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRStationNameType, JRTitleUnderlineStyle, JRWideTicketDrawParameters, ShinkansenRange } from './type';
import {
	JRPaymentMethod,
	JRTicketFlipSideText,
	JRWideTicketDrawParametersInitialValues,
	JR_MARS_120_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_120_PAPER_TICKET_SIZE,
	JR_MARS_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_PAPER_TICKET_SIZE,
} from './value';
import { drawText, DrawTextMethod, TextAlign } from '@/utils/utils';
import { getJRPrintingTicketTitleUnchinkasanAsteriskNum } from './utils';
import jr_h from '../../../assets/tickets/jr_h.jpg';
import jr_e from '../../../assets/tickets/jr_e.jpg';
import jr_c from '../../../assets/tickets/jr_c.jpg';
import jr_w from '../../../assets/tickets/jr_w.jpg';
import jr_s from '../../../assets/tickets/jr_s.jpg';
import jr_k from '../../../assets/tickets/jr_k.jpg';
import jr_e_120 from '../../../assets/tickets/jr_e_120.jpg';

export const drawJRWideTicket = (
	canvas: HTMLCanvasElement | null,
	width: number,
	height: number,
	ctx: CanvasRenderingContext2D | null,
	partialDrawParameters: Partial<JRWideTicketDrawParameters>,
	initialMethods:
		| {
				scaleX: (x: number) => number;
				scaleY: (y: number) => number;
				font: (size: number, fontName: string, isBold?: boolean) => string;
		  }
		| undefined = undefined,
	isFlip?: boolean,
	onDone?: () => void,
	onBgImageLoadStart?: () => void,
	onBgImageLoaded?: () => void
) => {
	if (!ctx || !canvas) {
		return;
	}

	const is120mm = partialDrawParameters.is120mm === true;

	const w = canvas.width > width ? canvas.width : width;
	const h = canvas.height > height ? canvas.height : height;

	const drawParameters: JRWideTicketDrawParameters = {
		...JRWideTicketDrawParametersInitialValues,
		...partialDrawParameters,
	};
	if (initialMethods === undefined) {
		if (is120mm) {
			initialMethods = getInitialMethods(
				width || JR_MARS_120_PAPER_TICKET_CANVAS_SIZE[0],
				height || JR_MARS_120_PAPER_TICKET_CANVAS_SIZE[1],
				JR_MARS_120_PAPER_TICKET_SIZE[0],
				JR_MARS_120_PAPER_TICKET_SIZE[1],
				1
			);
		} else {
			initialMethods = getInitialMethods(
				width || JR_MARS_PAPER_TICKET_CANVAS_SIZE[0],
				height || JR_MARS_PAPER_TICKET_CANVAS_SIZE[1],
				JR_MARS_PAPER_TICKET_SIZE[0],
				JR_MARS_PAPER_TICKET_SIZE[1],
				1
			);
		}
	}

	const resizedScaleX = (value: number) => {
		return initialMethods.scaleX(value);
	};
	const resizedScaleY = (value: number) => {
		return initialMethods.scaleY(value);
	};
	const offsetScaleX = (value: number, addOffsetValue: boolean = true) => {
		return initialMethods.scaleX(value + (addOffsetValue ? drawParameters.offsetX : 0));
	};
	const offsetScaleY = (value: number, addOffsetValue: boolean = true) => {
		return initialMethods.scaleY(value + (addOffsetValue ? drawParameters.offsetY : 0));
	};
	const resizedFont = (size: number, fontName: string, isBold?: boolean) => {
		return initialMethods.font(size, fontName, isBold);
	};

	const bg = new Image();
	if (is120mm) {
		switch (drawParameters.background) {
			case JRTicketBackGround.JR_H:
				bg.src = jr_h.src;
				break;
			case JRTicketBackGround.JR_E:
				bg.src = jr_e_120.src;
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
	} else {
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
	}

	const draw = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);
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
				case JRPaymentMethod.JRE:
					paymentText = '東C';
					break;
				case JRPaymentMethod.JRC:
					paymentText = '海C';
					break;
				case JRPaymentMethod.JRW:
					paymentText = '西C';
					break;
				case JRPaymentMethod.JRCreditCard:
					paymentText = 'クレジツト';
					break;
				default:
					break;
			}
			drawText(ctx, paymentText, offsetScaleX(120), offsetScaleY(220), resizedScaleX(183), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleX(5);
			ctx.strokeRect(offsetScaleX(120), offsetScaleY(139), resizedScaleX(183), resizedScaleY(91));
			ctx.setLineDash([]);
		}

		// ticket type
		let JR120TicketOffsetX = is120mm ? 443 : 0;
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(7.4, 'DotFont')}`;
		const ticketTitleText = drawParameters.ticketType + '　' + '*'.repeat(getJRPrintingTicketTitleUnchinkasanAsteriskNum(drawParameters.ticketType));
		drawText(ctx, ticketTitleText, offsetScaleX(347 + JR120TicketOffsetX), offsetScaleY(166), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 1.6, 0, 0.5);

		// shinkansen
		if (drawParameters.hasSinkansen) {
			ctx.fillStyle = 'black';
			ctx.font = `${resizedFont(7.4, 'DotFont')}`;
			drawText(ctx, '(幹)', offsetScaleX(861 + JR120TicketOffsetX), offsetScaleY(166), resizedScaleX(300), TextAlign.Left, DrawTextMethod.fillText, 1.6, 0, 0.5);
		}

		// underline
		const drawOneShinkansenRangeBlock = (type: ShinkansenRange, x: number, y: number) => {
			switch (type) {
				case ShinkansenRange.NotPass:
					ctx.strokeStyle = 'black';
					ctx.lineWidth = resizedScaleY(3);
					ctx.fillText('・', offsetScaleX(x - 20), offsetScaleY(y + 49));
					break;
				case ShinkansenRange.Zairaisen:
					ctx.strokeStyle = 'black';
					ctx.lineWidth = resizedScaleY(3);
					ctx.strokeRect(offsetScaleX(x), offsetScaleY(y), resizedScaleX(27), resizedScaleY(49));
					break;
				case ShinkansenRange.Shinkansen:
					ctx.strokeStyle = 'black';
					ctx.lineWidth = resizedScaleY(3);
					ctx.fillRect(offsetScaleX(x), offsetScaleY(y), resizedScaleX(27), resizedScaleY(49));
					break;
			}
		};
		const drawShinkansenRangeBlocks = (range1: ShinkansenRange, range2: ShinkansenRange, range3: ShinkansenRange, count: number, x: number, y: number = 190) => {
			const ranges = [range1, range2, range3];
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < count; j++) {
					drawOneShinkansenRangeBlock(ranges[i], x + (i * count + j) * 47, y);
				}
			}
		};

		switch (drawParameters.titleUnderlineStyle) {
			case JRTitleUnderlineStyle.StraightLine:
				ctx.beginPath();
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleY(6);
				ctx.moveTo(offsetScaleX(347 + JR120TicketOffsetX), offsetScaleY(190));
				ctx.lineTo(offsetScaleX(347 + JR120TicketOffsetX + ticketTitleText.length * 38), offsetScaleY(190));
				ctx.stroke();
				ctx.closePath();
				break;
			case JRTitleUnderlineStyle.Shinkansen4Blocks:
				drawShinkansenRangeBlocks(drawParameters.sinkansenRange1, drawParameters.sinkansenRange2, drawParameters.sinkansenRange3, 4, 310);
				break;
			case JRTitleUnderlineStyle.Shinkansen2Blocks:
				drawShinkansenRangeBlocks(drawParameters.sinkansenRange1, drawParameters.sinkansenRange2, drawParameters.sinkansenRange3, 2, 310);
				break;
			case JRTitleUnderlineStyle.Shinkansen1Blocks:
				drawShinkansenRangeBlocks(drawParameters.sinkansenRange1, drawParameters.sinkansenRange2, drawParameters.sinkansenRange3, 1, 310);
				break;
			case JRTitleUnderlineStyle.None:
			default:
				break;
		}

		// station
		const drawJRStation = (isRight: boolean, stationName: string, stationAreaChar: string, stationType: JRStationNameType, x: number, y: number = 370) => {
			ctx.fillStyle = 'black';
			const horizPositionX = [x, x + 95, x + 193, x + 289, x + 385, x + 479];
			const horizPositions = isRight
				? // right
				  [[2], [1, 4], [1, 3, 5], [1, 2, 3, 4], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]]
				: // left
				  [[3], [1, 4], [0, 2, 4], [1, 2, 3, 4], [1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5]];
			const Y = y;

			// 近郊区间
			if (stationAreaChar.length > 0) {
				const tmpCanvas = document.createElement('canvas');
				const tmpCtx = tmpCanvas.getContext('2d');
				if (tmpCtx) {
					tmpCtx.fillStyle = 'black';
					tmpCtx.fillRect(0, 0, resizedScaleX(66), resizedScaleY(105));
					tmpCtx.globalCompositeOperation = 'destination-out';
					//ctx.fillStyle = 'white';
					tmpCtx.font = resizedFont(9.8, 'DotFont', true);
					drawText(tmpCtx, stationAreaChar, resizedScaleX(3), resizedScaleY(91), resizedScaleX(58));
					tmpCtx.globalCompositeOperation = 'source-over';
				}
				ctx.drawImage(tmpCanvas, offsetScaleX(x + 13), offsetScaleY(y - 95));
			}

			// 站名
			let stationName1 = stationName,
				stationName2 = '',
				stationName3 = '';
			if (stationName.includes('/')) {
				const splitRes = stationName.split('/');
				stationName1 = splitRes[0];
				if (stationType === JRStationNameType.LeftLargeRightUpAndDown || stationType === JRStationNameType.LeftUpAndDownRightLarge) {
					stationName2 = splitRes[1];
					stationName3 = splitRes.slice(2, splitRes.length).join('/');
				} else {
					stationName2 = splitRes.slice(1, splitRes.length).join('/');
				}
			}

			ctx.fillStyle = 'black';
			const hasKinkouKukan = stationAreaChar.length > 0;
			let width = 0;
			switch (stationType) {
				case JRStationNameType.Normal:
					if (hasKinkouKukan && stationName.length > 5) {
						ctx.font = resizedFont(9.8, 'DotFont');
						drawText(ctx, stationName, offsetScaleX(x + 95), offsetScaleY(Y - 2), resizedScaleX(466), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.85);
					} else if (stationName.length > 6) {
						ctx.font = resizedFont(9.8, 'DotFont');
						drawText(ctx, stationName, offsetScaleX(x), offsetScaleY(Y - 2), resizedScaleX(585), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.85);
					} else {
						ctx.font = resizedFont(11.0, 'DotFont');
						for (let i = 0; i < stationName.length; i++) {
							const char = stationName.substring(i, i + 1);
							let X = horizPositionX[horizPositions[stationName.length - 1][i]];
							if (hasKinkouKukan) {
								if (horizPositions[stationName.length - 1][0] === 0) {
									X = horizPositionX[horizPositions[stationName.length - 1][i] + 1];
								}
							}
							drawText(ctx, char, offsetScaleX(X), offsetScaleY(Y), resizedScaleX(75));
						}
					}
					break;
				case JRStationNameType.Small:
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(585));
					break;
				case JRStationNameType.UpAndDownAlignLeft:
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName1, offsetScaleX(x), offsetScaleY(Y - 70), resizedScaleX(585));
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName2, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(585));
					break;
				case JRStationNameType.UpAlignLeftAndDownAlignRight:
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName1, offsetScaleX(x), offsetScaleY(Y - 70), resizedScaleX(585));
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName2, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(585), TextAlign.Right);
					break;
				case JRStationNameType.UpAlignLeftAndDownAlignCenter:
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName1, offsetScaleX(x), offsetScaleY(Y - 70), resizedScaleX(585));
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName2, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(585), TextAlign.Center);
					break;
				case JRStationNameType.LeftLargeAndRightSmall:
					ctx.font = resizedFont(11.0, 'DotFont');
					for (let i = 0; i < stationName1.length; i++) {
						drawText(ctx, stationName1.substring(i, i + 1), offsetScaleX(horizPositionX[i]), offsetScaleY(Y), resizedScaleX(75));
					}
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName2, offsetScaleX(horizPositionX[stationName1.length]), offsetScaleY(Y), resizedScaleX(585 - horizPositionX[stationName1.length - 1] + x));
					break;
				case JRStationNameType.LeftSmallAndRightLarge:
					//progress
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					width = stationName1.length * 80;
					drawText(ctx, stationName1, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(585 - horizPositionX[stationName1.length - 1] + x));
					ctx.font = resizedFont(11.0, 'DotFont');
					for (let i = 0; i < stationName2.length; i++) {
						drawText(ctx, stationName2.substring(i, i + 1), offsetScaleX(width + horizPositionX[i]), offsetScaleY(Y), resizedScaleX(75));
					}
					break;
				case JRStationNameType.LeftVerticalAndRightLarge:
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					for (let i = 0; i < stationName1.length; i++) {
						drawText(
							ctx,
							stationName1.substring(i, i + 1),
							offsetScaleX(x + 10),
							offsetScaleY(Y - (140 / stationName1.length) * (stationName1.length - i - 1)),
							resizedScaleX(585),
							TextAlign.Left,
							DrawTextMethod.fillText,
							0,
							0,
							1,
							2 / stationName1.length > 1 ? 1 : 2 / stationName1.length
						);
					}
					ctx.font = resizedFont(11.0, 'DotFont');
					for (let i = 0; i < stationName2.length; i++) {
						drawText(ctx, stationName2.substring(i, i + 1), offsetScaleX(horizPositionX[i + 1]), offsetScaleY(Y), resizedScaleX(75));
					}

					break;
				case JRStationNameType.LeftLargeAndRightVertical:
					ctx.font = resizedFont(11.0, 'DotFont');
					for (let i = 0; i < stationName1.length; i++) {
						drawText(ctx, stationName1.substring(i, i + 1), offsetScaleX(horizPositionX[i]), offsetScaleY(Y), resizedScaleX(75));
					}
					ctx.font = `${resizedFont(7, 'DotFont')}`;

					for (let i = 0; i < stationName2.length; i++) {
						drawText(
							ctx,
							stationName2.substring(i, i + 1),
							offsetScaleX(horizPositionX[stationName1.length]),
							offsetScaleY(Y - (140 / stationName2.length) * (stationName2.length - i - 1)),
							resizedScaleX(585 - horizPositionX[stationName1.length - 1] + x),
							TextAlign.Left,
							DrawTextMethod.fillText,
							0,
							0,
							1,
							2 / stationName2.length > 1 ? 1 : 2 / stationName2.length
						);
					}
					break;

				case JRStationNameType.LeftLargeRightUpAndDown:
					ctx.font = resizedFont(11.0, 'DotFont');
					for (let i = 0; i < stationName1.length; i++) {
						drawText(ctx, stationName1.substring(i, i + 1), offsetScaleX(horizPositionX[i]), offsetScaleY(Y), resizedScaleX(75));
					}

					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName2, offsetScaleX(horizPositionX[stationName1.length]), offsetScaleY(Y - 70 + 10), resizedScaleX(585));
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName3, offsetScaleX(horizPositionX[stationName1.length]), offsetScaleY(Y + 10), resizedScaleX(585));

					break;
				case JRStationNameType.LeftUpAndDownRightLarge:
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName1, offsetScaleX(x), offsetScaleY(Y - 70 + 10), resizedScaleX(585));
					ctx.font = `${resizedFont(7, 'DotFont')}`;
					drawText(ctx, stationName2, offsetScaleX(x), offsetScaleY(Y + 10), resizedScaleX(585));

					width = Math.max(stationName1.length, stationName2.length) * 80;

					ctx.font = resizedFont(11.0, 'DotFont');
					for (let i = 0; i < stationName3.length; i++) {
						drawText(ctx, stationName3.substring(i, i + 1), offsetScaleX(width + horizPositionX[i]), offsetScaleY(Y), resizedScaleX(75));
					}

					break;
				default:
					break;
			}
		};

		drawJRStation(false, drawParameters.station1, drawParameters.station1AreaChar, drawParameters.station1Type, 116 + (is120mm ? 261 : 0));
		drawJRStation(true, drawParameters.station2, drawParameters.station2AreaChar, drawParameters.station2Type, 838 + (is120mm ? 261 : 0));

		// 英文站名
		if (drawParameters.doShowEnglish) {
			ctx.font = resizedFont(4.5, 'DotFont');
			drawText(ctx, drawParameters.station1en, offsetScaleX(183), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
			drawText(ctx, drawParameters.station2en, offsetScaleX(1072), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
		}

		// 箭头
		JR120TicketOffsetX = is120mm ? 293 : 0;
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleY(16);
		ctx.moveTo(offsetScaleX(712 + JR120TicketOffsetX), offsetScaleY(337));
		ctx.lineTo(offsetScaleX(751 + JR120TicketOffsetX), offsetScaleY(337));
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.lineWidth = resizedScaleY(1);
		ctx.moveTo(offsetScaleX(743 + JR120TicketOffsetX), offsetScaleY(360));
		ctx.lineTo(offsetScaleX(766 + JR120TicketOffsetX), offsetScaleY(337));
		ctx.lineTo(offsetScaleX(743 + JR120TicketOffsetX), offsetScaleY(317));
		ctx.fill();
		ctx.closePath();

		if (drawParameters.isKaisukenArrow) {
			ctx.beginPath();
			ctx.lineWidth = resizedScaleY(1);
			ctx.moveTo(offsetScaleX(725 + JR120TicketOffsetX), offsetScaleY(360));
			ctx.lineTo(offsetScaleX(725 - 23 + JR120TicketOffsetX), offsetScaleY(337));
			ctx.lineTo(offsetScaleX(725 + JR120TicketOffsetX), offsetScaleY(317));
			ctx.fill();
			ctx.closePath();
		}

		// 経由
		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(ctx, '経由:' + drawParameters.railways.join('･'), offsetScaleX(113), offsetScaleY(458), resizedScaleX(1244 + JR120TicketOffsetX), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

		// 日期时间
		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(ctx, `月  日${'当日限り有効'}`, offsetScaleX(212), offsetScaleY(534), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

		ctx.font = resizedFont(7, 'DotFont');
		drawText(
			ctx,
			`${(new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, ' ')} ${new Date(drawParameters.date).getDate().toString().padStart(2, ' ')}`,
			offsetScaleX(100),
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
		ctx.fillText(`￥`, offsetScaleX(1080 + JR120TicketOffsetX), offsetScaleY(534), resizedScaleX(100));
		ctx.font = resizedFont(7, 'DotFont');
		drawText(ctx, `${drawParameters.price}`, offsetScaleX(1133 + JR120TicketOffsetX), offsetScaleY(534), resizedScaleX(300), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.25);

		// 信息1
		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(ctx, `${drawParameters.info1}`, offsetScaleX(155), offsetScaleY(606), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

		onDone?.();
	};

	const drawFlip = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);

		// bg
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, w, h);

		const drawJRBackText = (x: number) => {
			ctx.fillStyle = '#999999';
			ctx.font = `${resizedFont(4.2, 'sans-serif')}`;
			drawText(ctx, JRTicketFlipSideText, offsetScaleX(x + 127, false), offsetScaleY(175, false), resizedScaleX(1568 - 127), TextAlign.Left, DrawTextMethod.fillText, 0, 1.25);
		};

		const startOffset = Math.random() * 700;
		for (let i = -1; i < 4; i++) {
			drawJRBackText(i * 750 + startOffset);
		}
		ctx.fillStyle = '#555555';
		ctx.fillRect(offsetScaleX(0, false), offsetScaleY(920, false), resizedScaleX(1700), resizedScaleY(30));

		onDone?.();
	};

	if (isFlip) {
		onBgImageLoadStart?.();
		drawFlip();
		onBgImageLoaded?.();
	} else {
		onBgImageLoadStart?.();
		switch (drawParameters.background) {
			case JRTicketBackGround.JR_H:
			case JRTicketBackGround.JR_E:
			case JRTicketBackGround.JR_C:
			case JRTicketBackGround.JR_W:
			case JRTicketBackGround.JR_S:
			case JRTicketBackGround.JR_K:
				// 有背景的
				bg.onload = () => {
					onBgImageLoaded?.();
					draw();
				};
				break;
			case JRTicketBackGround.JR_Empty:
				onBgImageLoaded?.();
				draw();
				break;
		}
	}
};
