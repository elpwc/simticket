import { daysDiff, drawText, DrawTextMethod, TextAlign } from '@/utils/utils';
import { JRStationNameType, JRTicketTypesettingtype, JRWideTicketDrawParameters, ShinkansenRange } from '../type';
import { JRPAYMENT_METHOD_LIST, JRPaymentMethod } from '../value';
import { getJRTicketTypeInfoByTicketType } from '../utils';

export type JRPrintTypeInfo = ReturnType<typeof getJRTicketTypeInfoByTicketType>;

export type JRDrawerTools = {
	ctx: CanvasRenderingContext2D;
	resizedScaleX: (value: number) => number;
	resizedScaleY: (value: number) => number;
	offsetScaleX: (value: number, addOffsetValue?: boolean) => number;
	offsetScaleY: (value: number, addOffsetValue?: boolean) => number;
	resizedFont: (size: number, fontName: string, isBold?: boolean) => string;
	drawParameters: JRWideTicketDrawParameters;
};

export type JRDrawerContext = JRDrawerTools & {
	w: number;
	h: number;
	is120mm: boolean;
	bg: HTMLImageElement;
	onDone?: () => void;
};

export const createJRScaleFns = (
	initialMethods: {
		scaleX: (x: number) => number;
		scaleY: (y: number) => number;
		font: (size: number, fontName: string, isBold?: boolean) => string;
	},
	drawParameters: JRWideTicketDrawParameters,
) => {
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

	return { resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY, resizedFont };
};

/** 水印。文字基准 (116, 921) */
export const drawJRWatermark = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
	ctx.fillStyle = '#AF0508';
	ctx.font = `${resizedFont(10, 'DotFont')}`;
	drawText(ctx, drawParameters.watermark, offsetScaleX(x, false), offsetScaleY(y, false), resizedScaleX(300), TextAlign.JustifyAround);

	ctx.strokeStyle = '#AF0508';
	ctx.lineWidth = resizedScaleX(8);
	ctx.strokeRect(offsetScaleX(x + (107 - 116), false), offsetScaleY(y + (813 - 921), false), resizedScaleX(323), resizedScaleY(125));
	ctx.setLineDash([]);
};

/** payment method。大字基准 (123, 219)，小字基准 (142, 157) */
export const drawJRPaymentMethod = (d: JRDrawerTools, printTypeInfo: JRPrintTypeInfo, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120 ? 9 : 6, 'DotFont')}`;
	if (drawParameters.paymentMethod === JRPaymentMethod.Cash) {
		return;
	}
	let paymentText = '';
	const index = JRPAYMENT_METHOD_LIST.findIndex((JRPAYMENT_METHOD) => {
		return JRPAYMENT_METHOD.value === drawParameters.paymentMethod;
	});
	if (index !== -1) {
		paymentText = JRPAYMENT_METHOD_LIST[index].text;
	}

	if (printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120) {
		// large
		drawText(ctx, paymentText, offsetScaleX(x), offsetScaleY(y), resizedScaleX(175), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.95);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleX(5);
		ctx.strokeRect(offsetScaleX(x + (120 - 123)), offsetScaleY(y + (139 - 219)), resizedScaleX(183), resizedScaleY(91));
		ctx.setLineDash([]);
	} else {
		//tiny
		drawText(ctx, paymentText, offsetScaleX(x), offsetScaleY(y), resizedScaleX(100), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9, false);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleX(5);
		ctx.strokeRect(offsetScaleX(x + (135 - 142)), offsetScaleY(y + (105 - 157)), resizedScaleX(120), resizedScaleY(62));
		ctx.setLineDash([]);
	}
};

/** ticket type。基准为标题左端 */
export const drawJRTicketTitle = (d: JRDrawerTools, x: number, y: number, ticketTitleText: string) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(7.4, 'DotFont')}`;
	drawText(ctx, ticketTitleText, offsetScaleX(x), offsetScaleY(y), resizedScaleX(900), TextAlign.Left, DrawTextMethod.fillText, 1.6, 0, 0.5);
};

/** 英文券种名。基准与标题相同 x，y 为英文行 */
export const drawJRTicketTitleEn = (d: JRDrawerTools, x: number, y: number, ticketTitleTextEn: string) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(5, 'DotFont', true)}`;
	drawText(ctx, ticketTitleTextEn, offsetScaleX(x), offsetScaleY(y), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 0.2, 0, 0.85, 1, false);
};

/** shinkansen (幹)。基准 (861 + offset, 166) */
export const drawJRShinkansenMark = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(7.4, 'DotFont')}`;
	drawText(ctx, '(幹)', offsetScaleX(x), offsetScaleY(y), resizedScaleX(300), TextAlign.Left, DrawTextMethod.fillText, 1.6, 0, 0.5);
};

export const drawOneShinkansenRangeBlock = (d: JRDrawerTools, type: ShinkansenRange, x: number, y: number) => {
	const { ctx, resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY } = d;
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

export const drawShinkansenRangeBlocks = (
	d: JRDrawerTools,
	range1: ShinkansenRange,
	range2: ShinkansenRange,
	range3: ShinkansenRange,
	count: number,
	x: number,
	y: number = 190,
) => {
	const ranges = [range1, range2, range3];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < count; j++) {
			drawOneShinkansenRangeBlock(d, ranges[i], x + (i * count + j) * 47, y);
		}
	}
};

/** underline 直线。基准为左端 (ticketTitleLeft, 190) */
export const drawJRTitleStraightUnderline = (d: JRDrawerTools, x: number, y: number, length: number) => {
	const { ctx, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = resizedScaleY(6);
	ctx.moveTo(offsetScaleX(x), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + length), offsetScaleY(y));
	ctx.stroke();
	ctx.closePath();
};

/** 小。基准为贴图位置 (1036, 106) */
export const drawJRChildMark = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	const tmpCanvas = document.createElement('canvas');
	const tmpCtx = tmpCanvas.getContext('2d');
	if (tmpCtx) {
		tmpCtx.fillStyle = 'black';
		tmpCtx.fillRect(0, 0, resizedScaleX(130), resizedScaleY(140));
		tmpCtx.globalCompositeOperation = 'destination-out';
		//ctx.fillStyle = 'white';
		tmpCtx.font = resizedFont(12, 'DotFont', true);
		drawText(tmpCtx, '小', resizedScaleX(3), resizedScaleY(120), resizedScaleX(130));
		tmpCtx.globalCompositeOperation = 'source-over';
	}
	ctx.drawImage(tmpCanvas, offsetScaleX(x), offsetScaleY(y));
};

/** 自動改札通過不可マーク。基准为图形中心附近 (1090, lineHeights[6]) */
export const drawJRCannotPassAutoPasiAreaMark = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = resizedScaleY(3);
	// o
	ctx.moveTo(offsetScaleX(x), offsetScaleY(y - 50));
	ctx.lineTo(offsetScaleX(x + 10), offsetScaleY(y - 46));
	ctx.lineTo(offsetScaleX(x + 15), offsetScaleY(y - 40));
	ctx.lineTo(offsetScaleX(x + 15), offsetScaleY(y - 5));
	ctx.lineTo(offsetScaleX(x + 10), offsetScaleY(y + 1));
	ctx.lineTo(offsetScaleX(x), offsetScaleY(y + 5));
	ctx.lineTo(offsetScaleX(x - 10), offsetScaleY(y + 1));
	ctx.lineTo(offsetScaleX(x - 15), offsetScaleY(y - 5));
	ctx.lineTo(offsetScaleX(x - 15), offsetScaleY(y - 40));
	ctx.lineTo(offsetScaleX(x - 10), offsetScaleY(y - 46));
	ctx.lineTo(offsetScaleX(x), offsetScaleY(y - 50));
	// x
	ctx.moveTo(offsetScaleX(x - 10), offsetScaleY(y - 40));
	ctx.lineTo(offsetScaleX(x + 10), offsetScaleY(y - 3));
	ctx.moveTo(offsetScaleX(x + 10), offsetScaleY(y - 40));
	ctx.lineTo(offsetScaleX(x - 10), offsetScaleY(y - 3));

	ctx.stroke();
};

/** 乘变。大字基准 (1200, 220)，小字基准 (1230, 157) */
export const drawJRJouhenMark = (d: JRDrawerTools, printTypeInfo: JRPrintTypeInfo, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120 ? 9 : 6, 'DotFont')}`;
	if (printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120) {
		// large
		drawText(ctx, '乗変', offsetScaleX(x), offsetScaleY(y), resizedScaleX(183), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 1);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleX(5);
		ctx.strokeRect(offsetScaleX(x), offsetScaleY(y + (139 - 220)), resizedScaleX(183), resizedScaleY(91));
		ctx.setLineDash([]);
	} else {
		//tiny
		drawText(ctx, '乗変', offsetScaleX(x), offsetScaleY(y), resizedScaleX(110), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9, false);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleX(5);
		ctx.strokeRect(offsetScaleX(x), offsetScaleY(y + (105 - 157)), resizedScaleX(120), resizedScaleY(62));
		ctx.setLineDash([]);
	}
};

export const drawJRStation = (d: JRDrawerTools, isRight: boolean, stationName: string, stationAreaChar: string, stationType: JRStationNameType, x: number, y: number = 370) => {
	const { ctx, resizedFont, resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.fillStyle = 'black';
	const horizPositionX = [x, x + 95, x + 193, x + 289, x + 385, x + 479];
	const horizPositions = isRight
		? // right
		  [[2], [1, 4], [1, 3, 5], [1, 2, 3, 4], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]]
		: // left
		  [[3], [1, 4], [0, 2, 4], [1, 2, 3, 4], [1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5]];
	const Y = y;

	// 特定区间
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
					2 / stationName1.length > 1 ? 1 : 2 / stationName1.length,
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
					2 / stationName2.length > 1 ? 1 : 2 / stationName2.length,
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

export const drawEnglishJRStation = (d: JRDrawerTools, stationName: string, stationEnName: string, stationType: JRStationNameType, x: number, y: number = 370) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.fillStyle = 'black';
	const horizPositionX = [x, x + 70, x + 140, x + 210, x + 280, x + 350, x + 420];
	const horizPositions = [[3], [2, 5], [0, 3, 6], [0, 2, 4, 6], [1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6]];
	const Y = y;

	ctx.fillStyle = 'black';

	const smallStationName = stationName.replaceAll('/', '');

	if (smallStationName.length > 7) {
		ctx.font = `${resizedFont(7, 'DotFont')}`;
		drawText(ctx, smallStationName, offsetScaleX(x), offsetScaleY(Y - 70), resizedScaleX(540), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.85);
	} else {
		ctx.font = `${resizedFont(7, 'DotFont')}`;
		for (let i = 0; i < smallStationName.length; i++) {
			const char = smallStationName.substring(i, i + 1);
			const X = horizPositionX[horizPositions[smallStationName.length - 1][i]];
			drawText(ctx, char, offsetScaleX(X), offsetScaleY(Y - 70), resizedScaleX(75), TextAlign.Center);
		}
	}
	if (stationEnName.length > 12) {
		ctx.font = `${resizedFont(5, 'DotFont', true)}`;
		drawText(ctx, stationEnName, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(540), TextAlign.Center, DrawTextMethod.fillText, 0.2, 0, 0.85, 1, false);
	} else {
		ctx.font = `${resizedFont(5, 'DotFont')}`;
		drawText(ctx, stationEnName, offsetScaleX(x), offsetScaleY(Y), resizedScaleX(540), TextAlign.Center, DrawTextMethod.fillText, 3, 0, 1.2, 1, false);
	}
};

/** 箭头。基准为箭杆起点 (712 + offset, 337) */
export const drawJRArrow = (d: JRDrawerTools, x: number, y: number, isKaisukenArrow: boolean) => {
	const { ctx, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = resizedScaleY(16);
	ctx.moveTo(offsetScaleX(x), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + (751 - 712)), offsetScaleY(y));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = resizedScaleY(1);
	ctx.moveTo(offsetScaleX(x + (743 - 712)), offsetScaleY(y + (360 - 337)));
	ctx.lineTo(offsetScaleX(x + (766 - 712)), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + (743 - 712)), offsetScaleY(y + (317 - 337)));
	ctx.fill();
	ctx.closePath();

	if (isKaisukenArrow) {
		ctx.beginPath();
		ctx.lineWidth = resizedScaleY(1);
		ctx.moveTo(offsetScaleX(x + (725 - 712)), offsetScaleY(y + (360 - 337)));
		ctx.lineTo(offsetScaleX(x + (725 - 23 - 712)), offsetScaleY(y));
		ctx.lineTo(offsetScaleX(x + (725 - 712)), offsetScaleY(y + (317 - 337)));
		ctx.fill();
		ctx.closePath();
	}
};

// 経由
export const drawRailways = (d: JRDrawerTools, x: number, y: number, maxWidth: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'DotFont');
	drawText(ctx, '経由:' + drawParameters.railways.join('･'), offsetScaleX(x), offsetScaleY(y), resizedScaleX(maxWidth), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
};

// 日期时间
export const drawFareTicketAvailableDate = (d: JRDrawerTools, line: number, left: number, lineHeights: number[]) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	if (drawParameters.doShowEnglish) {
		const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
		ctx.font = resizedFont(7, 'DotFont');
		drawText(
			ctx,
			`${monthNames[new Date(drawParameters.date).getMonth()].toString().padStart(2, ' ')}.${new Date(drawParameters.date).getDate().toString().padStart(2, ' ')}`,
			offsetScaleX(left - 40),
			offsetScaleY(lineHeights[line]),
			resizedScaleX(300),
			TextAlign.Left,
			DrawTextMethod.fillText,
			0,
			0,
			1.25,
			1,
			false,
		);

		const days = 1 + daysDiff(new Date(drawParameters.date), new Date(drawParameters.fareTicketExpireDate));

		ctx.font = `${resizedFont(5, 'DotFont', true)}`;
		drawText(
			ctx,
			`(VALID ${days.toString().padStart(2, ' ')} DAY${days > 1 ? 'S' : ''})`,
			offsetScaleX(left + 250),
			offsetScaleY(lineHeights[line]),
			resizedScaleX(400),
			TextAlign.Left,
			DrawTextMethod.fillText,
			0.2,
			0,
			0.85,
			1,
			false,
		);
	} else {
		if (
			new Date(drawParameters.date).getMonth() === new Date(drawParameters.fareTicketExpireDate).getMonth() &&
			new Date(drawParameters.date).getDate() === new Date(drawParameters.fareTicketExpireDate).getDate()
		) {
			// 当日のみ
			ctx.font = resizedFont(5.5, 'DotFont');
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
				false,
			);
		} else {
			// 複数日有効
			drawText(ctx, `月　　日から`, offsetScaleX(left + 50), offsetScaleY(lineHeights[line]), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
			ctx.font = resizedFont(7, 'DotFont');
			drawText(
				ctx,
				`${(new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, ' ')} ${new Date(drawParameters.date).getDate().toString().padStart(2, ' ')}`,
				offsetScaleX(left - 40),
				offsetScaleY(lineHeights[line] + 3),
				resizedScaleX(1000),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				1.25,
				1,
				false,
			);
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, `月　　日まで有効`, offsetScaleX(left + 390), offsetScaleY(lineHeights[line]), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
			ctx.font = resizedFont(7, 'DotFont');
			drawText(
				ctx,
				`${(new Date(drawParameters.fareTicketExpireDate).getMonth() + 1).toString().padStart(2, ' ')} ${new Date(drawParameters.fareTicketExpireDate)
					.getDate()
					.toString()
					.padStart(2, ' ')}`,
				offsetScaleX(left + 300),
				offsetScaleY(lineHeights[line] + 3),
				resizedScaleX(1000),
				TextAlign.Left,
				DrawTextMethod.fillText,
				0,
				0,
				1.25,
				1,
				false,
			);
		}
	}
};

// 价格
export const drawPrice = (
	d: JRDrawerTools,
	printTypeInfo: JRPrintTypeInfo,
	JR120TicketOffsetX: number,
	line: number,
	left: number,
	alignRight: boolean = false,
	lineHeights: number[],
) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'DotFont');
	ctx.fillText(
		`￥`,
		offsetScaleX(left + JR120TicketOffsetX + (alignRight ? (6 - (drawParameters.price.length >= 6 ? 6 : drawParameters.price.length)) * 45 + 30 : 0)),
		offsetScaleY(lineHeights[line]),
		resizedScaleX(100),
	);
	ctx.font = resizedFont(7, 'DotFont');
	drawText(
		ctx,
		`${drawParameters.price}`,
		offsetScaleX(left + 63 + JR120TicketOffsetX + (alignRight ? 30 : 0)),
		offsetScaleY(lineHeights[line]),
		resizedScaleX(300 + (alignRight ? -30 : 0)),
		alignRight ? TextAlign.Right : TextAlign.Left,
		DrawTextMethod.fillText,
		0,
		0,
		1.25,
		1,
		false,
	);

	if (printTypeInfo.typeset === JRTicketTypesettingtype.Express) {
		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(
			ctx,
			`内訳：乗${drawParameters.price1}・特${drawParameters.price2}`,
			offsetScaleX(left + 360 + JR120TicketOffsetX),
			offsetScaleY(lineHeights[line]),
			resizedScaleX(700),
			TextAlign.Left,
			DrawTextMethod.fillText,
			2,
			0,
			0.7,
		);
	}
};

// 信息1
export const drawInfo = (d: JRDrawerTools, line: number, left: number, lineHeights: number[]) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'DotFont');
	drawText(
		ctx,
		`${drawParameters.info1}`,
		offsetScaleX(left + (drawParameters.doShowEnglish ? -39 : 0)),
		offsetScaleY(lineHeights[line]),
		resizedScaleX(1200),
		TextAlign.Left,
		DrawTextMethod.fillText,
		2,
		0,
		0.7,
	);
};

/** discount。框基准 (1047, 690) */
export const drawJRDiscount = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
	if (drawParameters.discount === '') {
		return;
	}
	if (drawParameters.discount.includes('/')) {
		const discountTexts = drawParameters.discount.split('/');
		if (discountTexts.length === 2) {
			// 2
			ctx.font = `${resizedFont(6, 'DotFont')}`;
			drawText(ctx, discountTexts[0], offsetScaleX(x + (1050 - 1047)), offsetScaleY(y + (744 - 690)), resizedScaleX(275), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9);

			ctx.font = `${resizedFont(6, 'DotFont')}`;
			drawText(ctx, discountTexts[1], offsetScaleX(x + (1050 - 1047)), offsetScaleY(y + (797 - 690)), resizedScaleX(275), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.9);

			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleX(6);
			ctx.strokeRect(offsetScaleX(x), offsetScaleY(y), resizedScaleX(280), resizedScaleY(120));
		} else {
			// 3
			ctx.fillStyle = 'black';
			ctx.font = `${resizedFont(7, 'DotFont')}`;
			drawText(ctx, discountTexts[0], offsetScaleX(x + (1050 - 1047)), offsetScaleY(y + (735 - 690)), resizedScaleX(150), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);

			ctx.font = `${resizedFont(7, 'DotFont')}`;
			drawText(ctx, discountTexts[1], offsetScaleX(x + (1050 - 1047)), offsetScaleY(y + (805 - 690)), resizedScaleX(310), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);

			ctx.font = `${resizedFont(5, 'DotFont')}`;
			drawText(ctx, discountTexts[2], offsetScaleX(x + (1220 - 1047)), offsetScaleY(y + (730 - 690)), resizedScaleX(121), TextAlign.Center, DrawTextMethod.fillText, 0, 0, 1.1);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleX(4);
			ctx.strokeRect(offsetScaleX(x + (1220 - 1047)), offsetScaleY(y + (680 - 690)), resizedScaleX(125), resizedScaleY(60));
		}
	} else {
		// 1
		ctx.fillStyle = 'black';
		ctx.font = `${resizedFont(12, 'DotFont')}`;
		drawText(ctx, drawParameters.discount, offsetScaleX(x + (1050 - 1047)), offsetScaleY(y + (790 - 690)), resizedScaleX(275), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1, 0.85);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleX(6);
		ctx.strokeRect(offsetScaleX(x), offsetScaleY(y), resizedScaleX(280), resizedScaleY(120));
	}
};

// 最下部
export const drawFareTicketBelow = (d: JRDrawerTools, lineLeft: number, lineHeights: number[]) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'DotFont', true);
	drawText(
		ctx,
		`${new Date(drawParameters.paymentDate).getFullYear().toString()}.${(new Date(drawParameters.paymentDate).getMonth() + 1).toString().padStart(2, '-')}.${new Date(
			drawParameters.paymentDate,
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
		false,
	);
	ctx.font = resizedFont(5.5, 'DotFont');
	drawText(ctx, drawParameters.paymentPlace + '発行', offsetScaleX(525), offsetScaleY(lineHeights[5]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
	drawText(ctx, drawParameters.paymentNo, offsetScaleX(lineLeft), offsetScaleY(lineHeights[6]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 1.4, 0, 1.4, 1, false);
	drawText(
		ctx,
		`(${drawParameters.issuingAreaNo}-${drawParameters.hasOtherCompanyLines ? 'ﾀ' : ' '})${drawParameters.RCode.length === 0 ? '    ' : 'R' + drawParameters.RCode}C${
			drawParameters.CCode
		}`,
		offsetScaleX(525),
		offsetScaleY(lineHeights[6]),
		resizedScaleX(1000),
		TextAlign.Left,
		DrawTextMethod.fillText,
		1.4,
		0,
		1.4,
		1,
		false,
	);
	if (!drawParameters.isPaymentIssuingTheSamePlace) {
		if (drawParameters.paymentPlace.includes('えきねっと')) {
			drawText(ctx, `えきねっと発券`, offsetScaleX(lineLeft), offsetScaleY(lineHeights[7]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
		}
		ctx.font = resizedFont(5.5, 'DotFont', true);
		drawText(
			ctx,
			`${new Date(drawParameters.issuingDate).getFullYear().toString()}.${(new Date(drawParameters.issuingDate).getMonth() + 1).toString().padStart(2, '-')}.${new Date(
				drawParameters.issuingDate,
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
			false,
		);

		ctx.font = resizedFont(5.5, 'DotFont');
		drawText(ctx, `${drawParameters.issuingPlace}`, offsetScaleX(720), offsetScaleY(lineHeights[7]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

		ctx.font = resizedFont(5.5, 'DotFont', true);
		drawText(ctx, drawParameters.issuingNo, offsetScaleX(1130), offsetScaleY(lineHeights[7]), resizedScaleX(1000), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 0.8, 1, false);
	}
};

export const drawExpressDateTime = (d: JRDrawerTools, line: number, left: number, lineHeights: number[]) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
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
		false,
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
		1.25,
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
		0.7,
	);

	// C code
	ctx.font = resizedFont(6.2, 'DotFont');
	drawText(ctx, `C${drawParameters.CCode}`, offsetScaleX(left + 1100), offsetScaleY(lineHeights[line] + 3), resizedScaleX(225), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.25);
};

export const drawNonReservedInfo = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.font = resizedFont(5.5, 'DotFont');
	drawText(ctx, `途中出場できません。`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(600), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);
};

export const drawExpressTrainNameSeatInfo = (d: JRDrawerTools, line: number, left: number, lineHeights: number[]) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
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
		0.7,
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
		0.7,
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

/** serialCode。旋转原点 (700, 500) */
export const drawJRSerialCode = (d: JRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.translate(offsetScaleX(x), offsetScaleY(y));
	ctx.rotate((Math.PI / 2) * 3);
	ctx.fillStyle = '#A942C3';
	ctx.font = resizedFont(9, 'DotFont');
	drawText(ctx, drawParameters.serialCode, offsetScaleX(-220), offsetScaleY(720), resizedScaleX(700), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 1, 0.9);

	ctx.translate(offsetScaleX(x), offsetScaleY(y));
	ctx.rotate(-Math.PI / 2);

	ctx.translate(offsetScaleX(0), offsetScaleY(0));
	ctx.fillStyle = 'black';
};

export const drawJRBackText = (d: JRDrawerTools, x: number, text: string) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.fillStyle = '#999999';
	ctx.font = `${resizedFont(4.2, 'sans-serif')}`;
	drawText(ctx, text, offsetScaleX(x + 127, false), offsetScaleY(175, false), resizedScaleX(1568 - 127), TextAlign.Left, DrawTextMethod.fillText, 0, 1.25);
};
