import { drawBarcode, drawMixedDigitFontText, drawQRCode, drawText, DrawTextMethod, TextAlign } from '@/utils/utils';
import { CROldPriceType, CRTicketBackGround, CRWideTicketDrawParameters } from '../type';
import { MAG_TICKET_CANVAS_SIZE, MAG_TICKET_SIZE, PAPER_TICKET_CANVAS_SIZE, PAPER_TICKET_SIZE, sleepingCarSeatType } from '../value';
import { getTrainTypeFromRouteIdentifier } from '../value';

export enum BackgroundImageType {
	Soft,
	Mag,
}

export type CRDrawerTools = {
	ctx: CanvasRenderingContext2D;
	resizedScaleX: (value: number) => number;
	resizedScaleY: (value: number) => number;
	offsetScaleX: (value: number, addOffsetValue?: boolean) => number;
	offsetScaleY: (value: number, addOffsetValue?: boolean) => number;
	resizedFont: (size: number, fontName: string, isBold?: boolean) => string;
	drawParameters: CRWideTicketDrawParameters;
};

export type CRDrawerContext = CRDrawerTools & {
	w: number;
	h: number;
	isMag: boolean;
	isBackgroundImageType: BackgroundImageType;
	backgroundEdgeHori: number;
	backgroundEdgeVert: number;
	bg: HTMLImageElement;
	onDone?: () => void;
};

export const createCRScaleFns = (
	initialMethods: {
		scaleX: (x: number) => number;
		scaleY: (y: number) => number;
		font: (size: number, fontName: string, isBold?: boolean) => string;
	},
	isBackgroundImageType: BackgroundImageType,
	drawParameters: CRWideTicketDrawParameters,
	backgroundEdgeHori: number,
	backgroundEdgeVert: number,
) => {
	const resizedScaleX = (value: number) => {
		switch (isBackgroundImageType) {
			case BackgroundImageType.Mag:
				return initialMethods.scaleX((value / MAG_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[0]);
			case BackgroundImageType.Soft:
				return initialMethods.scaleX(value);
			default:
				return initialMethods.scaleX(value);
		}
	};
	const resizedScaleY = (value: number) => {
		switch (isBackgroundImageType) {
			case BackgroundImageType.Mag:
				return initialMethods.scaleY((value / MAG_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[1]);
			case BackgroundImageType.Soft:
				return initialMethods.scaleY(value);
			default:
				return initialMethods.scaleY(value);
		}
	};
	const offsetScaleX = (value: number, addOffsetValue: boolean = true) => {
		switch (isBackgroundImageType) {
			case BackgroundImageType.Mag:
				return initialMethods.scaleX(((value - PAPER_TICKET_SIZE[1] * backgroundEdgeHori) / MAG_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[0] + (addOffsetValue ? drawParameters.offsetX : 0));
			case BackgroundImageType.Soft:
				return initialMethods.scaleX(value + (addOffsetValue ? drawParameters.offsetX : 0));
			default:
				return initialMethods.scaleX(value + (addOffsetValue ? drawParameters.offsetX : 0));
		}
	};
	const offsetScaleY = (value: number, addOffsetValue: boolean = true) => {
		switch (isBackgroundImageType) {
			case BackgroundImageType.Mag:
				return initialMethods.scaleY(((value - PAPER_TICKET_SIZE[1] * backgroundEdgeVert) / MAG_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[1] + (addOffsetValue ? drawParameters.offsetY : 0));
			case BackgroundImageType.Soft:
				return initialMethods.scaleY(value + (addOffsetValue ? drawParameters.offsetY : 0));
			default:
				return initialMethods.scaleY(value + (addOffsetValue ? drawParameters.offsetY : 0));
		}
	};
	const resizedFont = (size: number, fontName: string, isBold?: boolean) => {
		switch (isBackgroundImageType) {
			case BackgroundImageType.Mag:
				return initialMethods.font((size / MAG_TICKET_CANVAS_SIZE[1]) * PAPER_TICKET_CANVAS_SIZE[1], fontName, isBold);
			case BackgroundImageType.Soft:
				return initialMethods.font(size, fontName, isBold);
			default:
				return initialMethods.font(size, fontName, isBold);
		}
	};

	return { resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY, resizedFont };
};

/** 票号。基准 (118, 224) */
export const drawCRTicketNo = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.fillStyle = '#f89c9c';
	ctx.font = `${resizedFont(8, 'cr_ticketNo')}`;
	drawText(ctx, drawParameters.ticketNo, offsetScaleX(x, false), offsetScaleY(y, false), resizedScaleX(650), TextAlign.Left, DrawTextMethod.fillText, 1);
};

/** 水印。基准 (350, 670) */
export const drawCRWatermark = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.beginPath();
	if ([CRTicketBackGround.SoftBlue, CRTicketBackGround.MagBlue].includes(drawParameters.background)) {
		ctx.strokeStyle = '#9bcfdf';
	} else {
		ctx.strokeStyle = '#ffbbbb';
	}
	ctx.lineWidth = 1;
	ctx.font = `bold ${resizedFont(26, 'HeiTi')}`;
	drawText(ctx, drawParameters.watermark, offsetScaleX(x, false), offsetScaleY(y, false), resizedScaleX(1000), TextAlign.JustifyAround, DrawTextMethod.strokeText);
	ctx.closePath();
};

/** 售票点。基准为售票站文字 (555, 210) */
export const drawCRRightUpSoldPlace = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'black';
	ctx.font = `${resizedFont(6, 'SongTi')}`;
	drawText(ctx, drawParameters.soldplace, offsetScaleX(x), offsetScaleY(y), resizedScaleX(900), TextAlign.Right);

	ctx.beginPath();
	ctx.arc(offsetScaleX(x + (1500 - 555)), offsetScaleY(y + (185 - 210)), resizedScaleY(40), 0, 2 * Math.PI);
	ctx.lineWidth = resizedScaleX(5);
	ctx.stroke();
	ctx.closePath();

	ctx.font = `${resizedFont(6, 'SongTi')}`;
	ctx.fillText('售', offsetScaleX(x + (1468 - 555)), offsetScaleY(y + (210 - 210)));
};

/** 检票口。基准 (701, 210) */
export const drawCRRightUpTurnstile = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(6, 'SongTi')}`;
	drawText(ctx, (drawParameters.isHKWestKowloonStyle ? '檢票口/Gate  ' : '检票:') + drawParameters.turnstile, offsetScaleX(x), offsetScaleY(y), resizedScaleX(900), TextAlign.Right);
};

/** 国际联运 / 列车补票 / 到站补票。基准 (1240, 210) */
export const drawCRRightUpFixedText = (d: CRDrawerTools, x: number, y: number, text: string) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(6, 'SongTi')}`;
	ctx.fillText(text, offsetScaleX(x), offsetScaleY(y));
};

/** 自定义右上角。基准 (701, 210) */
export const drawCRRightUpCustom = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(6, 'SongTi')}`;
	drawText(ctx, drawParameters.rightUpContentType, offsetScaleX(x), offsetScaleY(y), resizedScaleX(900), TextAlign.Right);
};

/** 站。基准为「站」字位置 */
export const drawCRZhan = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(5.5, 'SongTi', true)}`;
	ctx.fillText('站', offsetScaleX(x), offsetScaleY(y));
};

/** 中文站名。左基准 (167, 335/365)，右基准 (1074, 335/365) */
export const drawCRStationName = (d: CRDrawerTools, x: number, y: number, stationText: string, doUseHuaWenXinWei: boolean, longNameWidth: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${doUseHuaWenXinWei ? resizedFont(9, 'HuawenXinwei') : resizedFont(8.5, 'HeiTi')}`;
	drawText(
		ctx,
		stationText.length === 2 ? stationText.substring(0, 1) + '　' + stationText.substring(1, 2) : stationText,
		offsetScaleX(x),
		offsetScaleY(y),
		resizedScaleX(drawParameters.doShowZhan ? (stationText.length > 4 ? longNameWidth : 365) : 500),
		TextAlign.JustifyEvenly,
	);
};

/** 中文站名。左基准 (167, 335/365)，右基准 (1074, 335/365) */
export const draw1996CRStationName = (d: CRDrawerTools, x: number, y: number, stationText: string, doUseHuaWenXinWei: boolean, isLeft: boolean) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.fillStyle = 'black';
	ctx.font = `${resizedFont(8.5, 'HeiTi', true)}`;
	drawText(
		ctx,
		stationText.length === 2 ? stationText.substring(0, 1) + '' + stationText.substring(1, 2) : stationText,
		offsetScaleX(x),
		offsetScaleY(y),
		resizedScaleX(400),
		isLeft ? TextAlign.Right : TextAlign.Left,
		DrawTextMethod.fillText,
	);
};

/** 英文站名。左基准 (183, 397)，右基准 (1072, 397) */
export const drawCRStationNameEn = (d: CRDrawerTools, x: number, y: number, text: string) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.font = resizedFont(5, 'SongTiEn');
	drawText(ctx, text, offsetScaleX(x), offsetScaleY(y), resizedScaleX(452), TextAlign.Center, DrawTextMethod.fillText, 1.9, 1, 0.75, 1.1, false);
};

/** 旧箭头。基准为箭杆起点 (716, 350) */
export const drawCROldArrow = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = resizedScaleY(9);
	ctx.moveTo(offsetScaleX(x), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + (946 - 716)), offsetScaleY(y));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = resizedScaleY(1);
	ctx.moveTo(offsetScaleX(x + (1006 - 716)), offsetScaleY(y + (355 - 350)));
	ctx.lineTo(offsetScaleX(x + (900 - 716)), offsetScaleY(y + (355 - 350)));
	ctx.lineTo(offsetScaleX(x + (825 - 716)), offsetScaleY(y + (325 - 350)));
	ctx.lineTo(offsetScaleX(x + (828 - 716)), offsetScaleY(y + (322 - 350)));
	ctx.lineTo(offsetScaleX(x + (930 - 716)), offsetScaleY(y + (339 - 350)));
	ctx.fill();
	ctx.closePath();
};

/** 旧箭头。基准为箭杆起点 (716, 350) */
export const drawCROldArrow1996 = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = resizedScaleY(9);
	ctx.moveTo(offsetScaleX(x), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + 180), offsetScaleY(y));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = resizedScaleY(1);
	ctx.moveTo(offsetScaleX(x + 239), offsetScaleY(y + (355 - 350)));
	ctx.lineTo(offsetScaleX(x + (880 - 716)), offsetScaleY(y + (355 - 350)));
	ctx.lineTo(offsetScaleX(x + (825 - 716)), offsetScaleY(y + (325 - 350)));
	ctx.lineTo(offsetScaleX(x + (828 - 716)), offsetScaleY(y + (322 - 350)));
	ctx.lineTo(offsetScaleX(x + (900 - 716)), offsetScaleY(y + (339 - 350)));
	ctx.fill();
	ctx.closePath();
};

/** 新箭头。基准为箭杆起点 (716, 350) */
export const drawCRNewArrow = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedScaleY, offsetScaleX, offsetScaleY } = d;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = resizedScaleY(6);
	ctx.moveTo(offsetScaleX(x), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + (1006 - 716)), offsetScaleY(y));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = resizedScaleY(1);
	ctx.moveTo(offsetScaleX(x + (1006 - 716)), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + (983 - 716)), offsetScaleY(y));
	ctx.lineTo(offsetScaleX(x + (964 - 716)), offsetScaleY(y + (337 - 350)));
	ctx.lineTo(offsetScaleX(x + (961 - 716)), offsetScaleY(y + (333 - 350)));
	ctx.lineTo(offsetScaleX(x + (979 - 716)), offsetScaleY(y + (337 - 350)));
	ctx.fill();
	ctx.closePath();
};

/** “次”字。基准为「次」字位置 */
export const drawCRCi = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY } = d;
	ctx.font = resizedFont(6.5, 'SongTi', true);
	ctx.fillText(`次`, offsetScaleX(x), offsetScaleY(y));
};

/** 车次（带字母 / 不带字母）。基准为 routeIdentifierX/Y */
export const drawCRRouteIdentifier = (d: CRDrawerTools, x: number, y: number, is1996: boolean = false) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	const routeIdentifierFirstChar = drawParameters.routeIdentifier.substring(0, 1);
	const routeIdentifierNumbersChar = drawParameters.routeIdentifier.substring(1, drawParameters.routeIdentifier.length);
	if (/^[A-Z]$/.test(routeIdentifierFirstChar)) {
		// 非普客普快（带字母）
		/** 右侧纯数字的最大宽度 */
		const routeIdentifierNumbersCharWidth = 230;
		/** 字母和数字的总体居中偏移量 */
		let alignCenterOffset = (routeIdentifierNumbersCharWidth - 40 - 50 * routeIdentifierNumbersChar.length) / 2;
		if (alignCenterOffset < 0) {
			alignCenterOffset = 0;
		}
		if (is1996) {
			ctx.font = `${resizedFont(7.1, 'HeiTi', true)}`;
		} else {
			ctx.font = `${resizedFont(7.1, 'TrainCodeFont')}`;
		}
		ctx.fillText(routeIdentifierFirstChar, offsetScaleX(x + alignCenterOffset), offsetScaleY(y), resizedScaleX(64));
		if (is1996) {
			ctx.font = `${resizedFont(8, 'HeiTi', true)}`;
		} else {
			ctx.font = `${resizedFont(8, 'TrainCodeFont')}`;
		}
		drawText(
			ctx,
			routeIdentifierNumbersChar,
			offsetScaleX(x + 63 + alignCenterOffset),
			offsetScaleY(y + 8),
			resizedScaleX(routeIdentifierNumbersCharWidth),
			TextAlign.Left,
			DrawTextMethod.fillText,
			2.2,
		);
	} else {
		// 普客普快（不带字母）
		if (is1996) {
			ctx.font = `${resizedFont(8, 'HeiTi', true)}`;
		} else {
			ctx.font = `${resizedFont(8, 'TrainCodeFont')}`;
		}
		drawText(ctx, drawParameters.routeIdentifier, offsetScaleX(x), offsetScaleY(y + 8), resizedScaleX(284), TextAlign.Center, DrawTextMethod.fillText, 1.5);
	}
};

/** 旧通票 经由。基准 (167, lineHeights[0]) */
export const drawCROldTongpiaoVia = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = `${resizedFont(5.5, 'Heiti')}`;
	drawText(ctx, '(经由' + drawParameters.tongpiaoRoute + ')', offsetScaleX(x), offsetScaleY(y), resizedScaleX(500), TextAlign.Center);
};

/** 旧通票 中转车种。基准 (1074, lineHeights[0]) */
export const drawCROldTongpiaoTransfer = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	drawText(ctx, '(' + drawParameters.tongpiaoTrainClass + '至' + drawParameters.tongpiaoStation + ')', offsetScaleX(x), offsetScaleY(y), resizedScaleX(500), TextAlign.Center);
};

/** 日期时间。基准为年份数字 (148, lineHeights[0 + lineOffset]) */
export const drawCRDateTime = (d: CRDrawerTools, x: number, y: number, ymdk_zh_y: number, ymdk_en_y: number, ymdk_y: number, isHanziSmallerFont: boolean = true) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, drawParameters } = d;
	const hanziFontSize = isHanziSmallerFont ? 4 : 5.5;
	if (drawParameters.isHKWestKowloonStyle) {
		ctx.font = resizedFont(4, 'SongTi', true);
		ctx.fillText(`年`, offsetScaleX(x + (310 - 148)), offsetScaleY(ymdk_zh_y));
		ctx.fillText(`月`, offsetScaleX(x + (460 - 148)), offsetScaleY(ymdk_zh_y));
		ctx.fillText(`日`, offsetScaleX(x + (619 - 148)), offsetScaleY(ymdk_zh_y));
		ctx.fillText(`開`, offsetScaleX(x + (877 - 148)), offsetScaleY(ymdk_zh_y));
		ctx.font = resizedFont(3.5, 'SongTi', true);
		ctx.fillText(`Ｙ`, offsetScaleX(x + (310 - 148)), offsetScaleY(ymdk_en_y));
		ctx.fillText(`Ｍ`, offsetScaleX(x + (460 - 148)), offsetScaleY(ymdk_en_y));
		ctx.fillText(`Ｄ`, offsetScaleX(x + (619 - 148)), offsetScaleY(ymdk_en_y));
		ctx.fillText(`DEP`, offsetScaleX(x + (877 - 148)), offsetScaleY(ymdk_en_y));
	} else {
		ctx.font = resizedFont(hanziFontSize, 'SongTi', true);
		ctx.fillText(`年`, offsetScaleX(x + (310 - 148)), offsetScaleY(ymdk_y));
		ctx.fillText(`月`, offsetScaleX(x + (460 - 148)), offsetScaleY(ymdk_y));
		ctx.fillText(`日`, offsetScaleX(x + (619 - 148)), offsetScaleY(ymdk_y));
		ctx.fillText(`开`, offsetScaleX(x + (877 - 148)), offsetScaleY(ymdk_y));
	}
	ctx.font = resizedFont(6.5, 'HeiTi');
	ctx.fillText(new Date(drawParameters.date).getFullYear().toString(), offsetScaleX(x), offsetScaleY(y));
	ctx.fillText((new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, '0'), offsetScaleX(x + (378 - 148)), offsetScaleY(y));
	ctx.fillText(new Date(drawParameters.date).getDate().toString().padStart(2, '0'), offsetScaleX(x + (529 - 148)), offsetScaleY(y));
	ctx.fillText(drawParameters.time, offsetScaleX(x + (680 - 148)), offsetScaleY(y));
};

/** 车厢座位。基准为日期行 y = lineHeights[0 + lineOffset]，x 为整块额外水平偏移（原版为 0） */
export const drawCRCarriageSeat = (d: CRDrawerTools, x: number, y: number, ymdk_zh_y: number, ymdk_en_y: number, ymdk_y: number, isHanziSmallerFont: boolean = true) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	const hanziFontSize = isHanziSmallerFont ? 4 : 5.5;
	if (drawParameters.isHKWestKowloonStyle) {
		// 香港樣式
		if (!drawParameters.noCarriage) {
			ctx.font = resizedFont(4, 'SongTi', true);
			ctx.fillText(`車廂`, offsetScaleX(x + 1180), offsetScaleY(ymdk_zh_y));
			ctx.font = resizedFont(3.5, 'SongTi', true);
			ctx.fillText(`Car`, offsetScaleX(x + 1190), offsetScaleY(ymdk_en_y));

			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(`${drawParameters.carriage}`, offsetScaleX(x + 1096), offsetScaleY(y + 7));
		}

		if (drawParameters.seatStatus === '') {
			if (['硬卧代硬座', '软卧代软座'].includes(drawParameters.seatClass)) {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`座`, offsetScaleX(x + 1410), offsetScaleY(ymdk_zh_y));
				ctx.font = resizedFont(3.5, 'SongTi', true);
				ctx.fillText(`Seat`, offsetScaleX(x + 1395), offsetScaleY(ymdk_en_y));
				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${drawParameters.seat1}`, offsetScaleX(x + 1281), offsetScaleY(y + 7));
				ctx.font = resizedFont(5, 'SongTi');
				ctx.fillText(`${drawParameters.seat2}`, offsetScaleX(x + 1488), offsetScaleY(y - 1));
			} else {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`座`, offsetScaleX(x + 1410), offsetScaleY(ymdk_zh_y));
				ctx.font = resizedFont(3.5, 'SongTi', true);
				ctx.fillText(`Seat`, offsetScaleX(x + 1395), offsetScaleY(ymdk_en_y));
				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${drawParameters.seat1}`, offsetScaleX(x + 1281), offsetScaleY(y + 7));
				ctx.font = resizedFont(5, 'SongTi');
				ctx.fillText(`${drawParameters.seat2}`, offsetScaleX(x + 1358), offsetScaleY(y - 1));
			}
			ctx.font = resizedFont(5.5, 'SongTi');
			ctx.fillText(`${drawParameters.seat3}`, offsetScaleX(x + 1397), offsetScaleY(y + 7));
		} else {
			ctx.font = resizedFont(6, 'SongTi');
			ctx.fillText(drawParameters.seatStatus, offsetScaleX(x + (drawParameters.noCarriage ? 1180 : 1280)), offsetScaleY(y + 2));
		}
	} else {
		// 非香港样式
		if (!drawParameters.noCarriage) {
			let carriageFloorX = 1171;
			if (drawParameters.carriageFloor > 0) {
				ctx.font = resizedFont(5.5, 'SongTi');
				ctx.fillText(drawParameters.carriageFloor > 0 ? ' ' + (drawParameters.carriageFloor === 1 ? '上' : '下') : '', offsetScaleX(x + carriageFloorX - 30), offsetScaleY(482));
				carriageFloorX = 1110;
			} else {
				carriageFloorX = 1171;
			}

			ctx.font = resizedFont(hanziFontSize, 'SongTi', true);
			ctx.fillText('车', offsetScaleX(x + carriageFloorX), offsetScaleY(ymdk_y));

			drawMixedDigitFontText(ctx, resizedFont, drawParameters.carriage, offsetScaleX(x + carriageFloorX - 171), offsetScaleY(y), resizedScaleX(165), 6.5, 6);
		}

		if (drawParameters.seatStatus === '') {
			if (['硬卧代硬座', '软卧代软座'].includes(drawParameters.seatClass)) {
				ctx.font = resizedFont(hanziFontSize, 'SongTi', true);

				ctx.fillText(`号`, offsetScaleX(x + 1325), offsetScaleY(ymdk_y));
				ctx.font = resizedFont(6.5, 'HeiTi');
				drawText(ctx, drawParameters.seat1, offsetScaleX(x + 1231), offsetScaleY(y), resizedScaleX(drawParameters.seat2.length === 0 ? 100 : 100), TextAlign.Right);
				ctx.font = resizedFont(5, 'SongTi');
				ctx.fillText(`${drawParameters.seat2}`, offsetScaleX(x + 1368), offsetScaleY(y - 1));
			} else {
				ctx.font = resizedFont(hanziFontSize, 'SongTi', true);

				ctx.fillText(`号`, offsetScaleX(x + 1345), offsetScaleY(ymdk_y));
				ctx.font = resizedFont(6.5, 'HeiTi');
				drawText(ctx, drawParameters.seat1, offsetScaleX(x + 1231), offsetScaleY(y), resizedScaleX(drawParameters.seat2.length === 0 ? 100 : 79), TextAlign.Right);
				ctx.font = resizedFont(5, 'SongTi');
				ctx.fillText(`${drawParameters.seat2}`, offsetScaleX(x + 1308), offsetScaleY(y - 1));
			}
			ctx.font = resizedFont(5.5, 'SongTi');
			ctx.fillText(`${drawParameters.seat3}`, offsetScaleX(x + 1397), offsetScaleY(y));
		} else {
			ctx.font = resizedFont(6, 'SongTi');
			ctx.fillText(drawParameters.seatStatus, offsetScaleX(x + (drawParameters.noCarriage ? 1180 : 1250)), offsetScaleY(y + 2));
		}
	}
};

/** 价格。非港基准 ￥ (145, lineHeights[1 + lineOffset])；港样式基准 HK$ 原 (148, …) 相对 +3 */
export const drawCRPrice = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	if (!drawParameters.isHKWestKowloonStyle) {
		ctx.font = resizedFont(4, 'SongTi', true);
		ctx.fillText(`元`, offsetScaleX(x + (220 - 145) + (`￥${drawParameters.price}`.length > 9 ? 9 : `￥${drawParameters.price}`.length) * 30), offsetScaleY(y));

		ctx.font = resizedFont(5.5, 'SongTi');
		drawText(ctx, `￥`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(100), TextAlign.Left, DrawTextMethod.fillText, 0, 1, 1, 1);
		ctx.font = resizedFont(6.5, 'HeiTi');
		ctx.fillText(`${drawParameters.price}`, offsetScaleX(x + (203 - 145)), offsetScaleY(y + 2), resizedScaleX(300));
	} else {
		ctx.font = resizedFont(5.5, 'SongTi', true);
		ctx.fillText(`HK$`, offsetScaleX(x + (148 - 145)), offsetScaleY(y + 2), resizedScaleX(100));
		ctx.font = resizedFont(6.5, 'HeiTi');
		ctx.fillText(`${drawParameters.price}`, offsetScaleX(x + (253 - 145)), offsetScaleY(y + 2), resizedScaleX(300));
	}
};

export const drawCRPrice1996 = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	ctx.fillText(`元`, offsetScaleX(x + (300 - 145) + (`全价${drawParameters.price}`.length > 9 ? 9 : `全价${drawParameters.price}`.length) * 30), offsetScaleY(y));

	ctx.font = resizedFont(5.5, 'SongTi');
	const priceText = drawParameters.priceType === CROldPriceType.FullPrice ? '全价' : drawParameters.priceType === CROldPriceType.HalfPrice ? '半价' : '补价';
	drawText(ctx, priceText, offsetScaleX(x), offsetScaleY(y), resizedScaleX(200), TextAlign.Left, DrawTextMethod.fillText, 0, 1, 1, 1);
	ctx.font = resizedFont(6.5, 'HeiTi', true);
	ctx.fillText(`${drawParameters.price}`, offsetScaleX(x + (300 - 145)), offsetScaleY(y + 2), resizedScaleX(300));
};

/** 购票方式。基准为第一项文字 (667, lineHeights[1 + lineOffset]) */
export const drawCRPurchaseMethod = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
	const wordWidth = 3; // ctx.measureText('永').width;
	drawParameters.purchaseMethod.forEach((purchaseMethodItem, index) => {
		if (purchaseMethodItem.length === 1) {
			if (drawParameters.doPurchaseMethodHaveCircle) {
				ctx.beginPath();
				ctx.arc(offsetScaleX(x + (700 - 667) + index * wordWidth * 35), offsetScaleY(y - 16), resizedScaleY(36), 0, 2 * Math.PI);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(3);
				ctx.stroke();
				ctx.closePath();

				ctx.font = `${resizedFont(5.6, 'SongTi')}`;
				ctx.fillStyle = 'black';
				ctx.fillText(purchaseMethodItem, offsetScaleX(x + index * wordWidth * 35), offsetScaleY(y + 8));
			} else {
				ctx.font = `${resizedFont(6, 'SongTi')}`;
				ctx.fillStyle = 'black';
				ctx.fillText(purchaseMethodItem, offsetScaleX(x + index * wordWidth * 25), offsetScaleY(y));
			}
		} else {
			ctx.font = `${resizedFont(6, 'SongTi')}`;
			ctx.fillStyle = 'black';
			ctx.fillText(purchaseMethodItem, offsetScaleX(x + index * wordWidth * 35), offsetScaleY(y));
		}
	});
};

/** 席别。基准为单语席别 (1223, lineHeights[1 + lineOffset]) */
export const drawCRSeatClass = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	if (drawParameters.seatClass.includes('/')) {
		const chinese = drawParameters.seatClass.split('/')[0];
		const english = drawParameters.seatClass.split('/')[1];

		ctx.font = resizedFont(5.8, 'Heiti');
		ctx.fillText(`${chinese}`, offsetScaleX(x + (1070 - 1223)), offsetScaleY(y), resizedScaleX(398));
		ctx.font = resizedFont(5.5, 'SongTi');
		ctx.fillText(`${english}`, offsetScaleX(x + (1200 - 1223)), offsetScaleY(y), resizedScaleX(398));
	} else {
		ctx.font = resizedFont(5.5, 'SongTi');
		ctx.fillText(`${drawParameters.seatClass}`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(398));
	}
};

/** 席别。基准为单语席别 (1223, lineHeights[1 + lineOffset]) */
export const drawCRSeatClass1996 = (d: CRDrawerTools, x: number, y: number, is1996: boolean = false) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	let seatText = '';
	const trainType = getTrainTypeFromRouteIdentifier(drawParameters.routeIdentifier, false);
	if (drawParameters.seatClass.includes('卧')) {
		seatText = drawParameters.seatClass.replace('卧', '座') + trainType + '卧';
	} else {
		seatText = drawParameters.seatClass + trainType;
	}

	if (is1996) {
		seatText = '(' + seatText + ')';
	}
	if (drawParameters.seatClass.includes('/')) {
		const chinese = drawParameters.seatClass.split('/')[0];
		const english = drawParameters.seatClass.split('/')[1];

		ctx.font = resizedFont(5.8, 'Heiti');
		ctx.fillText(`${chinese}`, offsetScaleX(x + (1070 - 1223)), offsetScaleY(y), resizedScaleX(398));
		ctx.font = resizedFont(5.5, 'SongTi');
		ctx.fillText(`${english}`, offsetScaleX(x + (1200 - 1223)), offsetScaleY(y), resizedScaleX(398));
	} else {
		ctx.font = resizedFont(5, 'SongTi');
		ctx.fillText(`${seatText}`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(500));
	}
};

/** 新通票 信息1 2。基准 (lineLeft, lineHeights[2 + lineOffset]) */
export const drawCRNewTongpiaoInfo = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `${drawParameters.tongpiaoTrainClass}`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(125));
	ctx.font = resizedFont(4, 'SongTi');
	ctx.fillText(`经由`, offsetScaleX(x + 132), offsetScaleY(y - 3), resizedScaleX(398));
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `${drawParameters.tongpiaoRoute}`, offsetScaleX(x + 230), offsetScaleY(y), resizedScaleX(320));
	ctx.font = resizedFont(4, 'SongTi');
	const tongpiaoRouteWidth = drawParameters.tongpiaoRoute.substring(0, 5).length * 67;
	ctx.fillText(`至`, offsetScaleX(x + 220 + tongpiaoRouteWidth), offsetScaleY(y - 3), resizedScaleX(398));
	ctx.font = resizedFont(6.5, 'Heiti');
	drawText(ctx, `${drawParameters.tongpiaoStation}`, offsetScaleX(x + 270 + tongpiaoRouteWidth), offsetScaleY(y + 6), resizedScaleX(320));
	ctx.font = resizedFont(4, 'SongTi', true);
	const tongpiaoStationWidth = drawParameters.tongpiaoStation.length * 75;
	ctx.fillText(`站`, offsetScaleX(x + 270 + tongpiaoRouteWidth + tongpiaoStationWidth), offsetScaleY(y - 3), resizedScaleX(398));
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `3日内到有效`, offsetScaleX(x + 380 + tongpiaoRouteWidth + tongpiaoStationWidth), offsetScaleY(y), resizedScaleX(600));
};

/** 信息1 2。基准 (lineLeft, lineHeights[2 + lineOffset]) */
export const drawCRInfo12 = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `${drawParameters.info1}${drawParameters.info1.length > 0 ? '  ' : ''}${drawParameters.info2}`, offsetScaleX(x), offsetScaleY(y));
};

/** 信息3。基准 (lineLeft, lineHeights[3 + lineOffset]) */
export const drawCRInfo3 = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `${drawParameters.info3}`, offsetScaleX(x), offsetScaleY(y));
};

export const draw1996RuanpiaofeiInfo = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `含软票费 1.00元`, offsetScaleX(x), offsetScaleY(y));
};

export const draw1996ShenfenzhengInfo = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, `身份证`, offsetScaleX(x), offsetScaleY(y));
};

/** 身份证+姓名。基准为身份证号 (133, lineHeights[4 + lineOffset]) */
export const drawCRPassenger = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, drawParameters } = d;
	ctx.font = resizedFont(6.5, 'HeiTi');
	ctx.fillText(drawParameters.idNumber, offsetScaleX(x), offsetScaleY(y));
	ctx.font = resizedFont(6, 'SongTi');
	ctx.fillText(drawParameters.passenger, offsetScaleX(x + (839 - 133)), offsetScaleY(y));
};

/** 说明。有边框基准 (208, 850)；无边框基准 (133, 890) */
export const drawCRMessage = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY, drawParameters } = d;
	ctx.font = resizedFont(4.5, 'SongTi');
	if (drawParameters.showMessageBorder) {
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleX(4);
		ctx.setLineDash([resizedScaleX(23), resizedScaleX(10)]);
		ctx.strokeRect(offsetScaleX(x), offsetScaleY(y), resizedScaleX(959), resizedScaleY(150));
		ctx.setLineDash([]);
		drawText(ctx, drawParameters.message, offsetScaleX(x + (216 - 208)), offsetScaleY(y + (908 - 850)), resizedScaleX(942), drawParameters.messageAlign, DrawTextMethod.fillText, 0);
	} else {
		drawText(ctx, drawParameters.message, offsetScaleX(x), offsetScaleY(y), resizedScaleX(1034), drawParameters.messageAlign, DrawTextMethod.fillText, 0);
	}
};

/** QR。基准为二维码左上角 */
export const drawCRQRCode = (d: CRDrawerTools, x: number, y: number, size: number) => {
	const { ctx, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	drawQRCode(ctx, offsetScaleX(x), offsetScaleY(y), resizedScaleX(size), drawParameters.qrCodeText);
};

/** 条码。基准 (lineLeft - 7, 1080) */
export const drawCRBarcode = (d: CRDrawerTools, x: number, y: number, width: number, height: number, text: string) => {
	const { ctx, offsetScaleX, offsetScaleY, resizedScaleX, resizedScaleY } = d;
	drawBarcode(ctx, offsetScaleX(x), offsetScaleY(y), resizedScaleX(width), resizedScaleY(height), text);
};

/** 通号。基准 (lineLeft - 7, 1080) */
export const drawCRSerialCode = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	ctx.font = resizedFont(5.5, 'SongTi');
	drawText(ctx, drawParameters.serialCode, offsetScaleX(x), offsetScaleY(y), resizedScaleX(770), TextAlign.Left, DrawTextMethod.fillText, 0, 1, 0.8, 1, false);
};

/** 下方购票处。基准 (930, 1080) */
export const drawCRSoldPlaceDown = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	drawText(ctx, `${drawParameters.soldplace}售`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(300), TextAlign.Center);
};

/** 购票证件。基准 (930, 1080) */
export const drawCRPurchaseCert = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, offsetScaleX, offsetScaleY, resizedScaleX, drawParameters } = d;
	drawText(ctx, `${drawParameters.purchaseCertType} ${drawParameters.purchasePassportCode}`, offsetScaleX(x), offsetScaleY(y), resizedScaleX(270));
};

/** 背面「乘车须知：」。基准 (242, 178) */
export const drawCRFlipNotice = (d: CRDrawerTools, x: number, y: number) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.font = `${resizedFont(6.1, 'HeiTi', true)}`;
	drawText(ctx, '乘车须知：', offsetScaleX(x, false), offsetScaleY(y, false), resizedScaleX(552), TextAlign.Left, DrawTextMethod.fillText, 0);
};

/** 背面须知正文。基准 (127, 175) */
export const drawCRFlipBody = (d: CRDrawerTools, x: number, y: number, text: string) => {
	const { ctx, resizedFont, offsetScaleX, offsetScaleY, resizedScaleX } = d;
	ctx.font = `${resizedFont(4.2, 'SongTi')}`;
	drawText(ctx, text, offsetScaleX(x, false), offsetScaleY(y, false), resizedScaleX(1568 - 127), TextAlign.Left, DrawTextMethod.fillText, 0, 1.25);
};
