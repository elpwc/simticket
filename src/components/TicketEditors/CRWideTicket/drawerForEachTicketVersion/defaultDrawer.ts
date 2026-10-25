import { CRTicketBackGround, RightUpContentType, TongPiaoStyle } from '../type';
import { CRTicketFlipSideText } from '../value';
import {
	BackgroundImageType,
	CRDrawerContext,
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
	drawCROldTongpiaoTransfer,
	drawCROldTongpiaoVia,
	drawCRPassenger,
	drawCRPrice,
	drawCRPurchaseCert,
	drawCRPurchaseMethod,
	drawCRQRCode,
	drawCRRightUpCustom,
	drawCRRightUpFixedText,
	drawCRRightUpSoldPlace,
	drawCRRightUpTurnstile,
	drawCRRouteIdentifier,
	drawCRSeatClass,
	drawCRSerialCode,
	drawCRSoldPlaceDown,
	drawCRStationName,
	drawCRStationNameEn,
	drawCRTicketNo,
	drawCRWatermark,
	drawCRZhan,
} from './drawerUtils';

export const drawDefaultCRWideTicketFace = (d: CRDrawerContext) => {
	const { ctx, drawParameters, resizedScaleX, w, h, isBackgroundImageType, backgroundEdgeHori, backgroundEdgeVert, bg, onDone } = d;

	// eslint-disable-next-line complexity
	const draw = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);

		const lineHeight = 84;
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
		switch (drawParameters.rightUpContentType) {
			case RightUpContentType.SoldPlace:
				// 售票点
				drawCRRightUpSoldPlace(d, 555, 210);
				break;
			case RightUpContentType.Turnstile:
				// 检票口
				drawCRRightUpTurnstile(d, 701, 210);
				break;
			case RightUpContentType.International:
				// 国际联运
				drawCRRightUpFixedText(d, 1240, 210, '国际联运');
				break;
			case RightUpContentType.Chebu:
				// 列车补票
				drawCRRightUpFixedText(d, 1240, 210, '列车补票');
				break;
			case RightUpContentType.Zhanbu:
				// 到站补票
				drawCRRightUpFixedText(d, 1240, 210, '到站补票');
				break;
			case RightUpContentType.None:
				// 不显示
				break;
			default:
				// 自定义
				drawCRRightUpCustom(d, 701, 210);
				break;
		}

		// 站
		if (drawParameters.doShowZhan) {
			drawCRZhan(d, drawParameters.station1.length > 4 ? 628 : 538, drawParameters.doShowEnglish ? 321 : 351);
			drawCRZhan(d, drawParameters.station2.length > 4 ? 1510 : 1438, drawParameters.doShowEnglish ? 321 : 351);
		}

		// 中文站名
		drawCRStationName(d, 167, drawParameters.doShowEnglish ? 335 : 365, drawParameters.station1, drawParameters.doUseHuaWenXinWei1, 452);
		const rightStationText = drawParameters.tongpiaoStyle === TongPiaoStyle.Old ? drawParameters.tongpiaoStation : drawParameters.station2;
		drawCRStationName(d, 1074, drawParameters.doShowEnglish ? 335 : 365, rightStationText, drawParameters.doUseHuaWenXinWei2, 435);

		// 英文站名
		if (drawParameters.doShowEnglish) {
			const rightEnStationText = drawParameters.tongpiaoStyle === TongPiaoStyle.Old ? drawParameters.tongpiaoStationEn : drawParameters.station2en;
			drawCRStationNameEn(d, 183, 397, drawParameters.station1en);
			drawCRStationNameEn(d, 1072, 397, rightEnStationText);
		}

		// 车次
		let routeIdentifierX = 720;
		let routeIdentifierY = 324;
		// 箭头
		if (drawParameters.isRouteIdentifierOldStyle) {
			// 旧箭头
			drawCROldArrow(d, 716, 350);

			// 旧车次位置
			routeIdentifierX = 690;
			routeIdentifierY = 300;
			// “次”字
			if (drawParameters.routeIdentifier.length > 0) {
				drawCRCi(d, routeIdentifierX + (drawParameters.routeIdentifier.length > 6 ? 6 : drawParameters.routeIdentifier.length) * 23 + 160, routeIdentifierY + 8);
			}
		} else {
			// 新箭头
			drawCRNewArrow(d, 716, 350);

			// 新车次位置
			routeIdentifierX = 720;
			routeIdentifierY = 324;
		}

		drawCRRouteIdentifier(d, routeIdentifierX, routeIdentifierY);

		let lineOffset = 0;
		if (drawParameters.tongpiaoStyle === TongPiaoStyle.Old) {
			// 旧通票 经由
			drawCROldTongpiaoVia(d, 167, lineHeights[0]);
			// 旧通票 中转车种
			drawCROldTongpiaoTransfer(d, 1074, lineHeights[0]);

			lineOffset = 1;
		}

		// 日期时间
		const ymdk_zh_y = lineHeights[0 + lineOffset] - 28;
		const ymdk_en_y = lineHeights[0 + lineOffset] + 12;
		const ymdk_y = lineHeights[0 + lineOffset] - 8;
		drawCRDateTime(d, 148, lineHeights[0 + lineOffset], ymdk_zh_y, ymdk_en_y, ymdk_y);

		// 车厢座位
		drawCRCarriageSeat(d, 0, lineHeights[0 + lineOffset], ymdk_zh_y, ymdk_en_y, ymdk_y);

		// 价格
		drawCRPrice(d, 145, lineHeights[1 + lineOffset]);

		// 购票方式
		drawCRPurchaseMethod(d, 667, lineHeights[1 + lineOffset]);

		// 车厢
		drawCRSeatClass(d, 1223, lineHeights[1 + lineOffset]);

		// 信息1 2
		if (drawParameters.tongpiaoStyle === TongPiaoStyle.New) {
			drawCRNewTongpiaoInfo(d, lineLeft, lineHeights[2 + lineOffset]);
		} else {
			drawCRInfo12(d, lineLeft, lineHeights[2 + lineOffset]);
		}
		// 信息3
		drawCRInfo3(d, lineLeft, lineHeights[3 + lineOffset]);

		// 身份证+姓名
		if (drawParameters.doShowPassenger) {
			drawCRPassenger(d, 133, lineHeights[4 + lineOffset]);
		}

		// 说明
		if (drawParameters.doShowMessage) {
			drawCRMessage(d, drawParameters.showMessageBorder ? 208 : 133, drawParameters.showMessageBorder ? 850 : 890);
		}

		//QR
		if (drawParameters.doShowQRCode) {
			switch (isBackgroundImageType) {
				case BackgroundImageType.Mag:
					drawCRQRCode(d, 1310, 730, 280);
					break;
				case BackgroundImageType.Soft:
					drawCRQRCode(d, 1223, 730, 380);
					break;
			}
		}

		// code 下方购票处(固定y坐标，不使用lineHeights)
		drawCRSerialCode(d, lineLeft - 7, 1080);
		if (drawParameters.showSoldPlaceDown) {
			drawCRSoldPlaceDown(d, 930, 1080);
		} else {
			drawCRPurchaseCert(d, 930, 1080);
		}
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
