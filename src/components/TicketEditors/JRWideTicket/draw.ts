import { getInitialMethods } from '@/components/TicketEditorCompo/TicketEditorTemplate';
import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRStationNameType, JRTicketTypesettingtype, JRTitleUnderlineStyle, JRWideTicketDrawParameters, ShinkansenRange } from './type';
import {
	JRPaymentMethod,
	JRTicketFlipSideText,
	JRWideTicketDrawParametersInitialValues,
	JR_MARS_120_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_120_PAPER_TICKET_SIZE,
	JR_MARS_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_PAPER_TICKET_SIZE,
} from './value';
import { drawText, DrawTextMethod, fontsLoader, TextAlign } from '@/utils/utils';
import { getJRPrintingTicketTitleByTicketType, getJRPrintingTicketTitleUnchinkasanAsteriskNum } from './utils';
import jr_h from '../../../assets/tickets/jr_h.jpg';
import jr_e from '../../../assets/tickets/jr_e.jpg';
import jr_c from '../../../assets/tickets/jr_c.jpg';
import jr_w from '../../../assets/tickets/jr_w.jpg';
import jr_s from '../../../assets/tickets/jr_s.jpg';
import jr_k from '../../../assets/tickets/jr_k.jpg';
import jr_e_120 from '../../../assets/tickets/jr_e_120.jpg';
import localFonts from 'next/font/local';

export const DotFont = localFonts({
	//src: '../../assets/fonts/simsun.woff2',
	src: '../../../assets/fonts/JF-Dot-Izumi16.woff2',
	//src: '../../../assets/fonts/JF-Dot-Ayu20.woff2',
});

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
	onBgImageLoaded?: () => void,
	onFontLoadStart?: () => void,
	onFontLoaded?: () => void
) => {
	if (!ctx || !canvas) {
		return;
	}

	fontsLoader(
		[{ name: 'DotFont', file: '../../../assets/fonts/JF-Dot-Izumi16.woff2' }],
		() => {
			onFontLoadStart?.();
		},
		() => {
			onFontLoaded?.();
		},
		() => {
			onFontLoaded?.();
		}
	);

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
		const printTypeInfo = getJRPrintingTicketTitleByTicketType(drawParameters.ticketType);
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

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// payment method
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120 ? 9 : 6, 'DotFont')}`;
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
			if (printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120) {
				// large
				drawText(ctx, paymentText, offsetScaleX(120), offsetScaleY(220), resizedScaleX(183), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 1);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(5);
				ctx.strokeRect(offsetScaleX(120), offsetScaleY(139), resizedScaleX(183), resizedScaleY(91));
				ctx.setLineDash([]);
			} else {
				//tiny
				drawText(ctx, paymentText, offsetScaleX(150), offsetScaleY(157), resizedScaleX(100), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9, false);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(5);
				ctx.strokeRect(offsetScaleX(135), offsetScaleY(105), resizedScaleX(120), resizedScaleY(62));
				ctx.setLineDash([]);
			}
		}

		// ticket type
		let JR120TicketOffsetX = is120mm ? 443 : 0;
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(7.4, 'DotFont')}`;
		const ticketTitleText = printTypeInfo.printingName + '　' + '*'.repeat(getJRPrintingTicketTitleUnchinkasanAsteriskNum(drawParameters.ticketType));
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

		//////////////////////////////////////////////////// STATION ////////////////////////////////////////////////////////////////////

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

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		const lineHeight = 74;
		const lineLeft = 113;
		/** 空一格 */
		const lineLeft2 = 155;
		const lineHeights = [0, 1, 2, 3, 4, 5, 6, 7].map((value) => value * lineHeight + 458);

		// 経由
		const drawRailways = () => {
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(
				ctx,
				'経由:' + drawParameters.railways.join('･'),
				offsetScaleX(113),
				offsetScaleY(lineHeights[0]),
				resizedScaleX(1244 + JR120TicketOffsetX),
				TextAlign.Left,
				DrawTextMethod.fillText,
				2,
				0,
				0.7
			);
		};

		// 日期时间
		const drawFareTicketAvailableDate = (line: number, left: number = lineLeft2) => {
			ctx.font = resizedFont(5.5, 'DotFont');
			if (
				new Date(drawParameters.date).getMonth() === new Date(drawParameters.fareTicketExpireDate).getMonth() &&
				new Date(drawParameters.date).getDate() === new Date(drawParameters.fareTicketExpireDate).getDate()
			) {
				// 当日
				drawText(ctx, `月   日当日限り有効`, offsetScaleX(left + 50), offsetScaleY(lineHeights[line]), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
				ctx.font = resizedFont(7, 'DotFont');
				drawText(
					ctx,
					`${(new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, ' ')} ${new Date(drawParameters.date).getDate().toString().padStart(2, ' ')}`,
					offsetScaleX(left - 40),
					offsetScaleY(lineHeights[line]),
					resizedScaleX(225),
					TextAlign.Left,
					DrawTextMethod.fillText,
					0,
					0,
					1.25,
					1,
					false
				);
			} else {
				// 後日
				drawText(ctx, `月   日から    月   日まで有効`, offsetScaleX(left + 50), offsetScaleY(lineHeights[line]), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

				ctx.font = resizedFont(7, 'DotFont');
				drawText(
					ctx,
					`${(new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, ' ')} ${new Date(drawParameters.date).getDate().toString().padStart(2, ' ')}    ${(
						new Date(drawParameters.fareTicketExpireDate).getMonth() + 1
					)
						.toString()
						.padStart(2, ' ')} ${new Date(drawParameters.fareTicketExpireDate).getDate().toString().padStart(2, ' ')}`,
					offsetScaleX(left - 40),
					offsetScaleY(lineHeights[line] + 3),
					resizedScaleX(1000),
					TextAlign.Left,
					DrawTextMethod.fillText,
					0,
					0,
					1.25,
					1,
					false
				);
			}
		};

		// 价格
		const drawPrice = (line: number, left: number = lineLeft) => {
			ctx.font = resizedFont(5.5, 'DotFont');
			ctx.fillText(`￥`, offsetScaleX(left + JR120TicketOffsetX), offsetScaleY(lineHeights[line]), resizedScaleX(100));
			ctx.font = resizedFont(7, 'DotFont');
			drawText(
				ctx,
				`${drawParameters.price}`,
				offsetScaleX(left + 63 + JR120TicketOffsetX),
				offsetScaleY(lineHeights[line]),
				resizedScaleX(300),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				1.25
			);
		};
		// 信息1
		const drawInfo = (line: number, left: number = lineLeft2) => {
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, `${drawParameters.info1}`, offsetScaleX(left), offsetScaleY(lineHeights[line]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
		};

		// discount
		if (drawParameters.discount !== '') {
			if (drawParameters.discount.includes('/')) {
				const discountTexts = drawParameters.discount.split('/');
				if (discountTexts.length === 2) {
					// 2
					ctx.font = `${resizedFont(6, 'DotFont')}`;
					drawText(ctx, discountTexts[0], offsetScaleX(1050), offsetScaleY(744), resizedScaleX(275), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9);

					ctx.font = `${resizedFont(6, 'DotFont')}`;
					drawText(ctx, discountTexts[1], offsetScaleX(1050), offsetScaleY(797), resizedScaleX(275), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9);

					ctx.strokeStyle = 'black';
					ctx.lineWidth = resizedScaleX(6);
					ctx.strokeRect(offsetScaleX(1047), offsetScaleY(690), resizedScaleX(280), resizedScaleY(120));
				} else {
					// 3
					ctx.fillStyle = 'black';
					ctx.font = `${resizedFont(6, 'DotFont')}`;
					drawText(ctx, discountTexts[0], offsetScaleX(1050), offsetScaleY(735), resizedScaleX(140), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);

					ctx.font = `${resizedFont(6, 'DotFont')}`;
					drawText(ctx, discountTexts[1], offsetScaleX(1050), offsetScaleY(795), resizedScaleX(280), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);

					ctx.font = `${resizedFont(5, 'DotFont')}`;
					drawText(ctx, discountTexts[2], offsetScaleX(1211), offsetScaleY(731), resizedScaleX(100), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9);
					ctx.strokeStyle = 'black';
					ctx.lineWidth = resizedScaleX(4);
					ctx.strokeRect(offsetScaleX(1210), offsetScaleY(687), resizedScaleX(105), resizedScaleY(52));
				}
			} else {
				// 1
				ctx.fillStyle = 'black';
				ctx.font = `${resizedFont(12, 'DotFont')}`;
				drawText(ctx, drawParameters.discount, offsetScaleX(1050), offsetScaleY(790), resizedScaleX(275), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.85);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(6);
				ctx.strokeRect(offsetScaleX(1047), offsetScaleY(690), resizedScaleX(280), resizedScaleY(120));
			}
		}

		// 最下部
		const drawFareTicketBelow = () => {
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(
				ctx,
				`${new Date(drawParameters.paymentDate).getFullYear().toString()}.${(new Date(drawParameters.paymentDate).getMonth() + 1).toString().padStart(2, '-')}.${new Date(
					drawParameters.paymentDate
				)
					.getDate()
					.toString()
					.padStart(2, '-')}`,
				offsetScaleX(lineLeft),
				offsetScaleY(lineHeights[5]),
				resizedScaleX(1000),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				0.8,
				1,
				false
			);
			drawText(ctx, drawParameters.paymentPlace + '発行', offsetScaleX(525), offsetScaleY(lineHeights[5]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
			drawText(ctx, drawParameters.paymentNo, offsetScaleX(lineLeft), offsetScaleY(lineHeights[6]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 1.4, 0, 1.4, 1, false);
			drawText(
				ctx,
				`(${drawParameters.issuingAreaNo}-${drawParameters.hasOtherCompanyLines ? 'ﾀ' : ' '})R${drawParameters.RCode}C${drawParameters.CCode}`,
				offsetScaleX(525),
				offsetScaleY(lineHeights[6]),
				resizedScaleX(1000),
				TextAlign.Left,
				DrawTextMethod.fillText,
				1.4,
				0,
				1.4,
				1,
				false
			);
			if (!drawParameters.isPaymentIssuingTheSamePlace) {
				if (drawParameters.paymentPlace.includes('えきねっと')) {
					drawText(ctx, `えきねっと発券`, offsetScaleX(lineLeft), offsetScaleY(lineHeights[7]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
				}
				drawText(
					ctx,
					`${new Date(drawParameters.issuingDate).getFullYear().toString()}.${(new Date(drawParameters.issuingDate).getMonth() + 1).toString().padStart(2, '-')}.${new Date(
						drawParameters.issuingDate
					)
						.getDate()
						.toString()
						.padStart(2, '-')}`,
					offsetScaleX(500),
					offsetScaleY(lineHeights[7]),
					resizedScaleX(1000),
					TextAlign.Left,
					DrawTextMethod.fillText,
					0,
					0,
					0.8,
					1,
					false
				);

				drawText(ctx, `${drawParameters.issuingPlace}`, offsetScaleX(720), offsetScaleY(lineHeights[7]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

				drawText(ctx, drawParameters.issuingNo, offsetScaleX(1130), offsetScaleY(lineHeights[7]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 0.8, 1, false);
			}
		};

		const drawExpressDateTime = (line: number, left: number = lineLeft2) => {
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, `月   日`, offsetScaleX(left + 50), offsetScaleY(lineHeights[line]), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
			ctx.font = resizedFont(7, 'DotFont');
			drawText(
				ctx,
				`${(new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, ' ')} ${new Date(drawParameters.date).getDate().toString().padStart(2, ' ')}`,
				offsetScaleX(left - 40),
				offsetScaleY(lineHeights[line]),
				resizedScaleX(225),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				1.25,
				1,
				false
			);
			//time
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, `（   :   発）`, offsetScaleX(left + 260), offsetScaleY(lineHeights[line]), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

			ctx.font = resizedFont(6.2, 'DotFont');
			drawText(
				ctx,
				`${drawParameters.time.split(':')[0].padStart(2, '0')}  ${drawParameters.time.split(':')[1].padStart(2, '0')}`,
				offsetScaleX(left + 345),
				offsetScaleY(lineHeights[line] + 3),
				resizedScaleX(225),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				1.25
			);

			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(
				ctx,
				`(${drawParameters.time2.split(':')[0].padStart(2, '0')}:${drawParameters.time2.split(':')[1].padStart(2, '0')}着)`,
				offsetScaleX(left + 700),
				offsetScaleY(lineHeights[line]),
				resizedScaleX(1244),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				0.7
			);

			// C code
			ctx.font = resizedFont(6.2, 'DotFont');
			drawText(ctx, `C${drawParameters.CCode}`, offsetScaleX(left + 1100), offsetScaleY(lineHeights[line] + 3), resizedScaleX(225), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.25);
		};

		const drawExpressTrainNameSeatInfo = (line: number, left: number = lineLeft) => {
			ctx.font = resizedFont(6.2, 'DotFont');
			drawText(
				ctx,
				`${drawParameters.trainName}` + (drawParameters.trainNo.length === 0 ? '' : `　${drawParameters.trainNo}号`),
				offsetScaleX(left),
				offsetScaleY(lineHeights[line] + 3),
				resizedScaleX(700),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				0.7
			);
			drawText(
				ctx,
				`${drawParameters.carriage}　　 ${drawParameters.seat1}　 ${drawParameters.seat2}`,
				offsetScaleX(left + 740),
				offsetScaleY(lineHeights[line]),
				resizedScaleX(700),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				0.7
			);

			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, `号車　　 番　 席`, offsetScaleX(left + 775), offsetScaleY(lineHeights[line]), resizedScaleX(700), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 0.7);

			// no smoking
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleX(5);
			ctx.ellipse(offsetScaleX(left + 1180), offsetScaleY(lineHeights[line] - 25), resizedScaleX(40), resizedScaleX(30), 0, 0, 2 * Math.PI);

			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleY(6);
			ctx.moveTo(offsetScaleX(left + 1160), offsetScaleY(lineHeights[line] - 50));
			ctx.lineTo(offsetScaleX(left + 1200), offsetScaleY(lineHeights[line] + 0));
			ctx.stroke();

			ctx.lineWidth = resizedScaleY(5);
			ctx.moveTo(offsetScaleX(left + 1150), offsetScaleY(lineHeights[line] - 20));
			ctx.lineTo(offsetScaleX(left + 1200), offsetScaleY(lineHeights[line] - 20));
			ctx.stroke();

			ctx.moveTo(offsetScaleX(left + 1203), offsetScaleY(lineHeights[line] - 20));
			ctx.lineTo(offsetScaleX(left + 1205), offsetScaleY(lineHeights[line] - 20));
			ctx.stroke();

			ctx.moveTo(offsetScaleX(left + 1207), offsetScaleY(lineHeights[line] - 20));
			ctx.lineTo(offsetScaleX(left + 1209), offsetScaleY(lineHeights[line] - 20));
			ctx.stroke();

			ctx.lineWidth = resizedScaleY(2);
			ctx.moveTo(offsetScaleX(left + 1209), offsetScaleY(lineHeights[line] - 25));
			ctx.lineTo(offsetScaleX(left + 1209), offsetScaleY(lineHeights[line] - 30));
			ctx.lineTo(offsetScaleX(left + 1200), offsetScaleY(lineHeights[line] - 35));
			ctx.lineTo(offsetScaleX(left + 1201), offsetScaleY(lineHeights[line] - 42));
			ctx.lineTo(offsetScaleX(left + 1195), offsetScaleY(lineHeights[line] - 45));
			ctx.stroke();

			ctx.moveTo(offsetScaleX(left + 1205), offsetScaleY(lineHeights[line] - 25));
			ctx.lineTo(offsetScaleX(left + 1205), offsetScaleY(lineHeights[line] - 27));
			ctx.lineTo(offsetScaleX(left + 1195), offsetScaleY(lineHeights[line] - 31));
			ctx.lineTo(offsetScaleX(left + 1192), offsetScaleY(lineHeights[line] - 35));
			ctx.lineTo(offsetScaleX(left + 1185), offsetScaleY(lineHeights[line] - 35));
			ctx.lineTo(offsetScaleX(left + 1185), offsetScaleY(lineHeights[line] - 42));
			ctx.stroke();

			ctx.stroke();
		};

		switch (printTypeInfo.typeset) {
			case JRTicketTypesettingtype.Fare:
				drawRailways();
				drawPrice(1, 1080);
				drawInfo(2);
				drawFareTicketAvailableDate(1);
				drawFareTicketBelow();
				break;
			case JRTicketTypesettingtype.Express:
				drawPrice(2);
				drawInfo(3);
				drawExpressDateTime(0);
				drawExpressTrainNameSeatInfo(1);
				drawFareTicketBelow();

				break;

			default:
				drawRailways();
				drawPrice(1, 1080);
				drawInfo(2);
				drawFareTicketAvailableDate(1);
				drawFareTicketBelow();
				break;
		}

		// serialCode
		if (drawParameters.doShowSerialCode) {
			ctx.translate(offsetScaleX(700), offsetScaleY(500));
			ctx.rotate((Math.PI / 2) * 3);
			ctx.fillStyle = '#A942C3';
			ctx.font = resizedFont(9, 'DotFont');
			drawText(ctx, drawParameters.serialCode, offsetScaleX(-220), offsetScaleY(720), resizedScaleX(700), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 1, 0.9);

			ctx.translate(offsetScaleX(700), offsetScaleY(500));
			ctx.rotate(-Math.PI / 2);

			ctx.translate(offsetScaleX(0), offsetScaleY(0));
			ctx.fillStyle = 'black';
		}

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
		ctx.fillRect(offsetScaleX(0, false), offsetScaleY(920, false), resizedScaleX(2200), resizedScaleY(30));

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
