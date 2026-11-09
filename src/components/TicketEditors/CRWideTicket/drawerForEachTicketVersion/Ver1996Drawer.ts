import { CRTicketBackGround, RightUpContentType, TongPiaoStyle } from '../type';
import { CRTicketFlipSideText } from '../value';
import {
	BackgroundImageType,
	CRDrawerContext,
	draw1996CRStationName,
	draw1996RuanpiaofeiInfo,
	draw1996ShenfenzhengInfo,
	drawCRBarcode,
	drawCRCarriageSeat,
	drawCRCi,
	drawCRDateTime,
	drawCRFlipBody,
	drawCRFlipNotice,
	drawCRInfo12,
	drawCRInfo3,
	drawCRMessage,
	drawCRNewArrow,
	drawCRNewTongpiaoInfo,
	drawCROldArrow,
	drawCROldArrow1996,
	drawCROldTongpiaoTransfer,
	drawCROldTongpiaoVia,
	drawCRPassenger,
	drawCRPrice,
	drawCRPrice1996,
	drawCRPurchaseCert,
	drawCRPurchaseMethod,
	drawCRQRCode,
	drawCRRightUpCustom,
	drawCRRightUpFixedText,
	drawCRRightUpSoldPlace,
	drawCRRightUpTurnstile,
	drawCRRouteIdentifier,
	drawCRSeatClass,
	drawCRSeatClass1996,
	drawCRSerialCode,
	drawCRSoldPlaceDown,
	drawCRStationName,
	drawCRStationNameEn,
	drawCRTicketNo,
	drawCRWatermark,
	drawCRZhan,
} from './drawerUtils';

export const draw1996CRWideTicketFace = (d: CRDrawerContext) => {
	const { ctx, drawParameters, resizedScaleX, w, h, isBackgroundImageType, backgroundEdgeHori, backgroundEdgeVert, bg, onDone } = d;

	// eslint-disable-next-line complexity
	const draw = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);

		const lineHeight = 115;
		const lineLeft = 140;
		const lineHeights = [0, 1, 2, 3, 4, 5, 6, 7].map((value) => value * lineHeight + 482);

		// 底图
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
				ctx.drawImage(bg, 0, 0, w, h);
				break;
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, w, h);
				ctx.drawImage(bg, w * backgroundEdgeHori, h * backgroundEdgeVert, w * (1 - 2 * backgroundEdgeHori), h * (1 - 2 * backgroundEdgeVert));
				break;
			case CRTicketBackGround.MagNoneBackground:
			case CRTicketBackGround.SoftNoneBackground:
				break;
		}

		// border
		if (
			drawParameters.showBorder &&
			[CRTicketBackGround.SoftBlue, CRTicketBackGround.SoftRed, CRTicketBackGround.SoftNoneBackground, CRTicketBackGround.MagNoneBackground].includes(drawParameters.background)
		) {
			ctx.strokeStyle = 'gray';
			ctx.lineWidth = resizedScaleX(2);
			ctx.strokeRect(0, 0, w || 0, h || 0);
		}

		// 票号
		drawCRTicketNo(d, 118, 224);

		// 水印
		if (drawParameters.showWatermark) {
			drawCRWatermark(d, 350, 670);
		}

		// 右上角
		// 售票点
		drawCRRightUpSoldPlace(d, 555, 210);

		// 中文站名
		draw1996CRStationName(d, 130, drawParameters.doShowEnglish ? 335 : 365, drawParameters.station1, drawParameters.doUseHuaWenXinWei1, true);
		const rightStationText = drawParameters.tongpiaoStyle === TongPiaoStyle.Old ? drawParameters.tongpiaoStation : drawParameters.station2;
		draw1996CRStationName(d, 800, drawParameters.doShowEnglish ? 335 : 365, rightStationText, drawParameters.doUseHuaWenXinWei2, false);

		// 车次
		let routeIdentifierX = 760;
		let routeIdentifierY = 364;
		// 旧箭头
		drawCROldArrow1996(d, 558, 300);

		// 旧车次位置
		routeIdentifierX = 1250;
		routeIdentifierY = 330;
		// “次”
		if (drawParameters.routeIdentifier.length > 0) {
			drawCRCi(d, routeIdentifierX + (drawParameters.routeIdentifier.length > 6 ? 6 : drawParameters.routeIdentifier.length) * 23 + 160, routeIdentifierY + 8);
		}

		drawCRRouteIdentifier(d, routeIdentifierX, routeIdentifierY, true);

		let lineOffsetPx = 0;
		if (drawParameters.tongpiaoStyle !== TongPiaoStyle.None) {
			// 旧通票 经由
			drawCROldTongpiaoVia(d, 167, lineHeights[0] - lineHeight / 2);
			// 旧通票 中转车种
			drawCROldTongpiaoTransfer(d, 1074, lineHeights[0] - lineHeight / 2);

			lineOffsetPx = lineHeight / 3;
		}

		// 日期时间
		const ymdk_zh_y = lineHeights[0] + lineOffsetPx - 28;
		const ymdk_en_y = lineHeights[0] + lineOffsetPx + 12;
		const ymdk_y = lineHeights[0] + lineOffsetPx - 8;
		drawCRDateTime(d, 148, lineHeights[0] + lineOffsetPx, ymdk_zh_y, ymdk_en_y, ymdk_y, false);

		// 车厢座位
		drawCRCarriageSeat(d, 0, lineHeights[0] + lineOffsetPx, ymdk_zh_y, ymdk_en_y, ymdk_y, false);

		// 价格
		drawCRPrice1996(d, 145, lineHeights[1] + lineOffsetPx);

		// 购票方式
		drawCRPurchaseMethod(d, 667, lineHeights[1] + lineOffsetPx);

		// 座位类型
		drawCRSeatClass1996(d, 1100, lineHeights[1] + lineOffsetPx, true);

		// 信息1 2
		if (drawParameters.tongpiaoStyle === TongPiaoStyle.New) {
			drawCRNewTongpiaoInfo(d, lineLeft, lineHeights[2] + lineOffsetPx);
		} else {
			drawCRInfo12(d, lineLeft, lineHeights[2] + lineOffsetPx);
		}
		// 信息3
		drawCRInfo3(d, lineLeft, lineHeights[3] + lineOffsetPx);

		// 含软票费 1.00元 1996特有
		draw1996RuanpiaofeiInfo(d, lineLeft, lineHeights[4] + lineOffsetPx);

		// 身份证 1996特有
		draw1996ShenfenzhengInfo(d, lineLeft, lineHeights[5] + lineOffsetPx);

		//barcode
		drawCRBarcode(d, 709, 910, 860, 120, drawParameters.serialCode);

		// code 下方购票处(固定y坐标，不使用lineHeights)
		drawCRSerialCode(d, 709, 1080);

		onDone?.();
	};

	draw();
};

export const drawDefaultCRWideTicketFlip = (d: CRDrawerContext) => {
	const { ctx, drawParameters, resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY, w, h, isMag, onDone } = d;

	const drawFlip = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);

		// bg
		if (isMag) {
			ctx.fillStyle = '#000000';
		} else {
			ctx.fillStyle = '#ffffff';
		}
		ctx.fillRect(0, 0, w, h);

		if (isMag) {
			ctx.fillStyle = '#999999';
		} else {
			ctx.fillStyle = '#000000';
		}

		// border
		if (
			drawParameters.showBorder &&
			[CRTicketBackGround.SoftBlue, CRTicketBackGround.SoftRed, CRTicketBackGround.SoftNoneBackground, CRTicketBackGround.MagNoneBackground].includes(drawParameters.background)
		) {
			ctx.strokeStyle = 'gray';
			ctx.lineWidth = resizedScaleX(2);
			ctx.strokeRect(0, 0, w || 0, h || 0);
		}

		const mag_Y_offset = 50;

		drawCRFlipNotice(d, 242, 178 + (isMag ? mag_Y_offset : 0));
		drawCRFlipBody(d, 127, 175 + (isMag ? mag_Y_offset : 0), CRTicketFlipSideText);

		if (!isMag) {
			ctx.strokeStyle = 'black';
			ctx.fillRect(offsetScaleX(0, false), offsetScaleY(1016, false), resizedScaleX(1700), resizedScaleY(1098 - 1016));
		}

		onDone?.();
	};

	drawFlip();
};
