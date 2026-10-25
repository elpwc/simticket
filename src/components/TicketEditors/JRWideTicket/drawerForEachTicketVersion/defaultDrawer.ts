import { JRTicketBackGround } from '../JRWideTicketBgSelector';
import { JRTicketTypesettingtype, JRTitleUnderlineStyle } from '../type';
import { JRTicketFlipSideText } from '../value';
import { getJRPrintingTicketTitleUnchinkasanAsteriskNum, getJRTicketTypeInfoByTicketType } from '../utils';
import {
	JRDrawerContext,
	drawEnglishJRStation,
	drawExpressDateTime,
	drawExpressTrainNameSeatInfo,
	drawFareTicketAvailableDate,
	drawFareTicketBelow,
	drawInfo,
	drawJRArrow,
	drawJRBackText,
	drawJRCannotPassAutoPasiAreaMark,
	drawJRChildMark,
	drawJRDiscount,
	drawJRJouhenMark,
	drawJRPaymentMethod,
	drawJRSerialCode,
	drawJRShinkansenMark,
	drawJRStation,
	drawJRTicketTitle,
	drawJRTicketTitleEn,
	drawJRTitleStraightUnderline,
	drawJRWatermark,
	drawNonReservedInfo,
	drawPrice,
	drawRailways,
	drawShinkansenRangeBlocks,
} from './drawerUtils';

export const drawDefaultJRWideTicketFace = (d: JRDrawerContext) => {
	const { ctx, drawParameters, w, h, is120mm, bg, onDone } = d;

	const draw = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);

		const lineHeight = 70;
		const lineLeft = 113;
		/** 空一格 */
		const lineLeft2 = 155;
		const lineHeights = [0, 1, 2, 3, 4, 5, 6, 7].map((value) => value * lineHeight + 458);

		const printTypeInfo = getJRTicketTypeInfoByTicketType(drawParameters.ticketType);
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
			drawJRWatermark(d, 116, 921);
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// payment method
		if (printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120) {
			drawJRPaymentMethod(d, printTypeInfo, 123, 219);
		} else {
			drawJRPaymentMethod(d, printTypeInfo, 142, 157);
		}

		// ticket type
		let JR120TicketOffsetX = is120mm ? 443 : 0;
		const ticketTitleText = printTypeInfo.printingName + '　' + '*'.repeat(getJRPrintingTicketTitleUnchinkasanAsteriskNum(drawParameters.ticketType));
		const ticketTitleTextEn = printTypeInfo.nameen;
		const ticketTitleLeft = printTypeInfo.typeset === JRTicketTypesettingtype.Fare ? 460 + JR120TicketOffsetX : 347 + JR120TicketOffsetX + 300 - ticketTitleText.length * 10;
		drawJRTicketTitle(d, ticketTitleLeft, 166, ticketTitleText);
		if (drawParameters.doShowEnglish) {
			drawJRTicketTitleEn(d, ticketTitleLeft, 166 + lineHeight, ticketTitleTextEn);
		}

		// shinkansen
		if (drawParameters.hasSinkansen) {
			drawJRShinkansenMark(d, 861 + JR120TicketOffsetX, 166);
		}

		// underline
		switch (drawParameters.titleUnderlineStyle) {
			case JRTitleUnderlineStyle.StraightLine:
				if (!drawParameters.doShowEnglish) {
					drawJRTitleStraightUnderline(d, ticketTitleLeft, 190, ticketTitleText.length * 38);
				}
				break;
			case JRTitleUnderlineStyle.Shinkansen4Blocks:
				drawShinkansenRangeBlocks(d, drawParameters.sinkansenRange1, drawParameters.sinkansenRange2, drawParameters.sinkansenRange3, 4, 310);
				break;
			case JRTitleUnderlineStyle.Shinkansen2Blocks:
				drawShinkansenRangeBlocks(d, drawParameters.sinkansenRange1, drawParameters.sinkansenRange2, drawParameters.sinkansenRange3, 2, 310);
				break;
			case JRTitleUnderlineStyle.Shinkansen1Blocks:
				drawShinkansenRangeBlocks(d, drawParameters.sinkansenRange1, drawParameters.sinkansenRange2, drawParameters.sinkansenRange3, 1, 310);
				break;
			case JRTitleUnderlineStyle.None:
			default:
				break;
		}

		// 小
		if (drawParameters.isChild) {
			drawJRChildMark(d, 1036, 106);
		}

		// 自動改札通過不可マーク
		if (drawParameters.hasCannotPassAutoPasiAreaMark) {
			drawJRCannotPassAutoPasiAreaMark(d, 1090, lineHeights[6]);
		}

		//乘变
		if (drawParameters.hasJouhenMark) {
			if (printTypeInfo.typeset === JRTicketTypesettingtype.Fare || printTypeInfo.typeset === JRTicketTypesettingtype.Fare120) {
				drawJRJouhenMark(d, printTypeInfo, 1200, 220);
			} else {
				drawJRJouhenMark(d, printTypeInfo, 1230, 157);
			}
		}

		//////////////////////////////////////////////////// STATION ////////////////////////////////////////////////////////////////////

		// station
		if (drawParameters.doShowEnglish) {
			drawEnglishJRStation(d, drawParameters.station1, drawParameters.station1en, drawParameters.station1Type, 116 + (is120mm ? 261 : 0));
			drawEnglishJRStation(d, drawParameters.station2, drawParameters.station2en, drawParameters.station2Type, 838 + (is120mm ? 261 : 0));
		} else {
			drawJRStation(d, false, drawParameters.station1, drawParameters.station1AreaChar, drawParameters.station1Type, 116 + (is120mm ? 261 : 0));
			drawJRStation(d, true, drawParameters.station2, drawParameters.station2AreaChar, drawParameters.station2Type, 838 + (is120mm ? 261 : 0));
		}

		// 箭头
		JR120TicketOffsetX = is120mm ? 293 : 0;
		drawJRArrow(d, 712 + JR120TicketOffsetX, 337, drawParameters.isKaisukenArrow);

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// discount
		drawJRDiscount(d, 1047, 690);

		switch (printTypeInfo.typeset) {
			case JRTicketTypesettingtype.Fare:
				drawRailways(d, 113, lineHeights[0], 1244 + JR120TicketOffsetX);
				drawPrice(d, printTypeInfo, JR120TicketOffsetX, 1, 1030, true, lineHeights);
				drawInfo(d, 2, lineLeft2, lineHeights);
				drawFareTicketAvailableDate(d, 1, lineLeft2, lineHeights);

				drawFareTicketBelow(d, lineLeft, lineHeights);
				break;
			case JRTicketTypesettingtype.Express:
				drawPrice(d, printTypeInfo, JR120TicketOffsetX, 2, lineLeft, false, lineHeights);
				drawInfo(d, 3, lineLeft2, lineHeights);
				drawExpressDateTime(d, 0, lineLeft2, lineHeights);
				drawExpressTrainNameSeatInfo(d, 1, lineLeft, lineHeights);

				drawFareTicketBelow(d, lineLeft, lineHeights);

				break;
			case JRTicketTypesettingtype.NonReserved:
				drawPrice(d, printTypeInfo, JR120TicketOffsetX, 2, lineLeft, false, lineHeights);
				drawFareTicketAvailableDate(d, 1, lineLeft2, lineHeights);
				drawNonReservedInfo(d, 850, lineHeights[1]);

				drawFareTicketBelow(d, lineLeft, lineHeights);
				break;

			default:
				drawRailways(d, 113, lineHeights[0], 1244 + JR120TicketOffsetX);
				drawPrice(d, printTypeInfo, JR120TicketOffsetX, 1, 1080, false, lineHeights);
				drawInfo(d, 2, lineLeft2, lineHeights);
				drawFareTicketAvailableDate(d, 1, lineLeft2, lineHeights);
				drawFareTicketBelow(d, lineLeft, lineHeights);
				break;
		}

		// serialCode
		if (drawParameters.doShowSerialCode) {
			drawJRSerialCode(d, 700, 500);
		}

		onDone?.();
	};

	draw();
};

export const drawDefaultJRWideTicketFlip = (d: JRDrawerContext) => {
	const { ctx, resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY, w, h, onDone } = d;

	const drawFlip = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);

		// bg
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, w, h);

		const startOffset = Math.random() * 700;
		for (let i = -1; i < 4; i++) {
			drawJRBackText(d, i * 750 + startOffset, JRTicketFlipSideText);
		}
		ctx.fillStyle = '#555555';
		ctx.fillRect(offsetScaleX(0, false), offsetScaleY(920, false), resizedScaleX(2200), resizedScaleY(30));

		onDone?.();
	};

	drawFlip();
};
