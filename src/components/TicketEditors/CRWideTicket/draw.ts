import { drawQRCode, drawText, DrawTextMethod, TextAlign } from '@/utils/utils';
import { CRTicketBackGround, CRWideTicketDrawParameters, RightUpContentType } from './type';
import { CRTicketFlipSideText, CRWideTicketDrawParametersInitialValues, MAG_TICKET_CANVAS_SIZE, MAG_TICKET_SIZE, PAPER_TICKET_CANVAS_SIZE, PAPER_TICKET_SIZE } from './value';
import cr_red from '../../../assets/tickets/cr_red.png';
import cr_blue from '../../../assets/tickets/cr_blue.png';
import cr_mag_blue from '../../../assets/tickets/cr_mag_blue.png';
import cr_mag_red from '../../../assets/tickets/cr_mag_red.png';
import { getInitialMethods } from '@/components/TicketEditorCompo/TicketEditorTemplate';

export const drawCRWideTicket = (
	canvas: HTMLCanvasElement | null,
	width: number,
	height: number,
	ctx: CanvasRenderingContext2D | null,
	partialDrawParameters: Partial<CRWideTicketDrawParameters>,
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
	if (!ctx || !canvas) return;

	const drawParameters: CRWideTicketDrawParameters = {
		...CRWideTicketDrawParametersInitialValues,
		...partialDrawParameters,
	};

	const isMag = [CRTicketBackGround.MagRed, CRTicketBackGround.MagBlue, CRTicketBackGround.MagNoneBackground].includes(drawParameters.background || CRTicketBackGround.SoftRed);

	const w = canvas.width > width ? canvas.width : width;
	const h = canvas.height > height ? canvas.height : height;
	const backgroundEdgeHori = 0.04;
	const backgroundEdgeVert = 0.07;

	if (initialMethods === undefined) {
		if (isMag) {
			initialMethods = getInitialMethods(w || MAG_TICKET_CANVAS_SIZE[0], h || MAG_TICKET_CANVAS_SIZE[1], PAPER_TICKET_SIZE[0], PAPER_TICKET_SIZE[1], 1);
		} else {
			initialMethods = getInitialMethods(w || PAPER_TICKET_CANVAS_SIZE[0], h || PAPER_TICKET_CANVAS_SIZE[1], PAPER_TICKET_SIZE[0], PAPER_TICKET_SIZE[1], 1);
		}
	}

	const bg = new Image();
	switch (drawParameters.background) {
		case CRTicketBackGround.SoftRed:
			bg.src = cr_red.src;
			break;
		case CRTicketBackGround.SoftBlue:
			bg.src = cr_blue.src;
			break;
		case CRTicketBackGround.MagRed:
			bg.src = cr_mag_red.src;
			break;
		case CRTicketBackGround.MagBlue:
			bg.src = cr_mag_blue.src;
			break;
		case CRTicketBackGround.MagNoneBackground:
		case CRTicketBackGround.SoftNoneBackground:
			break;
	}

	const resizedScaleX = (value: number) => {
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
			case CRTicketBackGround.MagNoneBackground:
				return initialMethods.scaleX((value / MAG_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[0]);
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.SoftNoneBackground:
			default:
				return initialMethods.scaleX(value);
		}
	};
	const resizedScaleY = (value: number) => {
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
			case CRTicketBackGround.MagNoneBackground:
				return initialMethods.scaleY((value / MAG_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[1]);
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.SoftNoneBackground:
			default:
				return initialMethods.scaleY(value);
		}
	};
	const offsetScaleX = (value: number, addOffsetValue: boolean = true) => {
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
			case CRTicketBackGround.MagNoneBackground:
				return initialMethods.scaleX(((value - PAPER_TICKET_SIZE[1] * backgroundEdgeHori) / MAG_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[0] + (addOffsetValue ? drawParameters.offsetX : 0));
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.SoftNoneBackground:
			default:
				return initialMethods.scaleX(value + (addOffsetValue ? drawParameters.offsetX : 0));
		}
	};
	const offsetScaleY = (value: number, addOffsetValue: boolean = true) => {
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
			case CRTicketBackGround.MagNoneBackground:
				return initialMethods.scaleY(((value - PAPER_TICKET_SIZE[1] * backgroundEdgeVert) / MAG_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[1] + (addOffsetValue ? drawParameters.offsetY : 0));
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.SoftNoneBackground:
			default:
				return initialMethods.scaleY(value + (addOffsetValue ? drawParameters.offsetY : 0));
		}
	};
	const resizedFont = (size: number, fontName: string, isBold?: boolean) => {
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
			case CRTicketBackGround.MagNoneBackground:
				return initialMethods.font((size / MAG_TICKET_CANVAS_SIZE[1]) * PAPER_TICKET_CANVAS_SIZE[1], fontName, isBold);
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.SoftNoneBackground:
			default:
				return initialMethods.font(size, fontName, isBold);
		}
	};

	// eslint-disable-next-line complexity
	const draw = () => {
		// 清空
		ctx.clearRect(0, 0, w, h);
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
		ctx.fillStyle = '#f89c9c';
		ctx.font = `${resizedFont(8, 'cr_ticketNo')}`;
		drawText(ctx, drawParameters.ticketNo, offsetScaleX(118, false), offsetScaleY(224, false), resizedScaleX(650), TextAlign.Left, DrawTextMethod.fillText, 1);

		// 水印
		if (drawParameters.showWatermark) {
			ctx.beginPath();
			ctx.strokeStyle = '#ffbbbb';
			ctx.lineWidth = 1;
			ctx.font = `bold ${resizedFont(26, 'HeiTi')}`;
			drawText(ctx, drawParameters.watermark, offsetScaleX(350, false), offsetScaleY(670, false), resizedScaleX(1000), TextAlign.JustifyAround, DrawTextMethod.strokeText);
			ctx.closePath();
		}

		// 右上角
		switch (drawParameters.rightUpContentType) {
			case RightUpContentType.SoldPlace:
				// 售票点
				ctx.fillStyle = 'black';
				ctx.strokeStyle = 'black';
				ctx.font = `${resizedFont(6, 'SongTi')}`;
				ctx.fillText(drawParameters.soldplace, offsetScaleX(1315), offsetScaleY(210));

				ctx.beginPath();
				ctx.arc(offsetScaleX(1500), offsetScaleY(185), resizedScaleY(40), 0, 2 * Math.PI);
				ctx.lineWidth = resizedScaleX(5);
				ctx.stroke();
				ctx.closePath();

				ctx.font = `${resizedFont(6, 'SongTi')}`;
				ctx.fillText('售', offsetScaleX(1468), offsetScaleY(210));

				break;
			case RightUpContentType.Turnstile:
				// 检票口
				ctx.fillStyle = 'black';
				ctx.font = `${resizedFont(6, 'SongTi')}`;
				drawText(ctx, (drawParameters.isHKWestKowloonStyle ? '檢票口/Gate  ' : '检票:') + drawParameters.turnstile, offsetScaleX(701), offsetScaleY(210), resizedScaleX(900), TextAlign.Right);
				break;
			case RightUpContentType.International:
				// 国际联运
				ctx.fillStyle = 'black';
				ctx.font = `${resizedFont(6, 'SongTi')}`;
				ctx.fillText('国际联运', offsetScaleX(1240), offsetScaleY(210));
				break;
			case RightUpContentType.None:
				// 不显示
				break;
			default:
				// 自定义
				ctx.fillStyle = 'black';
				ctx.font = `${resizedFont(6, 'SongTi')}`;
				ctx.fillText(drawParameters.rightUpContentType, offsetScaleX(1315), offsetScaleY(210));
				break;
		}

		// 站
		if (drawParameters.doShowZhan) {
			ctx.fillStyle = 'black';
			ctx.font = `${resizedFont(5.5, 'SongTi', true)}`;
			ctx.fillText('站', offsetScaleX(drawParameters.station1.length > 4 ? 628 : 538), offsetScaleY(drawParameters.doShowEnglish ? 321 : 351));
			ctx.fillText('站', offsetScaleX(drawParameters.station2.length > 4 ? 1510 : 1438), offsetScaleY(drawParameters.doShowEnglish ? 321 : 351));
		}

		// 中文站名
		ctx.fillStyle = 'black';
		ctx.font = `${drawParameters.doUseHuaWenXinWei1 ? resizedFont(9, 'HuawenXinwei') : resizedFont(8.5, 'HeiTi')}`;
		drawText(
			ctx,
			drawParameters.station1.length === 2 ? drawParameters.station1.substring(0, 1) + '　' + drawParameters.station1.substring(1, 2) : drawParameters.station1,
			offsetScaleX(167),
			offsetScaleY(drawParameters.doShowEnglish ? 335 : 365),
			resizedScaleX(drawParameters.doShowZhan ? (drawParameters.station1.length > 4 ? 452 : 365) : 500),
			TextAlign.JustifyEvenly
		);
		ctx.font = `${drawParameters.doUseHuaWenXinWei2 ? resizedFont(9, 'HuawenXinwei') : resizedFont(8.5, 'HeiTi')}`;
		drawText(
			ctx,
			drawParameters.station2.length === 2 ? drawParameters.station2.substring(0, 1) + '　' + drawParameters.station2.substring(1, 2) : drawParameters.station2,
			offsetScaleX(1074),
			offsetScaleY(drawParameters.doShowEnglish ? 335 : 365),
			resizedScaleX(drawParameters.doShowZhan ? (drawParameters.station2.length > 4 ? 435 : 365) : 500),
			TextAlign.JustifyEvenly
		);

		// 英文站名
		if (drawParameters.doShowEnglish) {
			ctx.font = resizedFont(5, 'SongTiEn');
			drawText(ctx, drawParameters.station1en, offsetScaleX(183), offsetScaleY(397), resizedScaleX(452), TextAlign.Center, DrawTextMethod.fillText, 0.7, 1, 0.92, 1.1);
			drawText(ctx, drawParameters.station2en, offsetScaleX(1072), offsetScaleY(397), resizedScaleX(452), TextAlign.Center, DrawTextMethod.fillText, 0.7, 1, 0.92, 1.1);
		}

		// 车次
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = resizedScaleY(6);
		ctx.moveTo(offsetScaleX(716), offsetScaleY(350));
		ctx.lineTo(offsetScaleX(1006), offsetScaleY(350));
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.lineWidth = resizedScaleY(1);
		ctx.moveTo(offsetScaleX(1006), offsetScaleY(350));
		ctx.lineTo(offsetScaleX(983), offsetScaleY(350));
		ctx.lineTo(offsetScaleX(964), offsetScaleY(337));
		ctx.lineTo(offsetScaleX(961), offsetScaleY(333));
		ctx.lineTo(offsetScaleX(979), offsetScaleY(337));
		ctx.fill();
		ctx.closePath();

		const routeIdentifierFirstChar = drawParameters.routeIdentifier.substring(0, 1);
		const routeIdentifierNumbersChar = drawParameters.routeIdentifier.substring(1, drawParameters.routeIdentifier.length);
		if (/^[A-Z]$/.test(routeIdentifierFirstChar)) {
			ctx.font = `${resizedFont(7.1, 'TrainCodeFont')}`;
			ctx.fillText(routeIdentifierFirstChar, offsetScaleX(720), offsetScaleY(324), resizedScaleX(64));
			ctx.font = `${resizedFont(8, 'TrainCodeFont')}`;
			drawText(ctx, routeIdentifierNumbersChar, offsetScaleX(783), offsetScaleY(332), resizedScaleX(271), TextAlign.Left, DrawTextMethod.fillText, 2.2);
		} else {
			ctx.font = `${resizedFont(8, 'TrainCodeFont')}`;
			drawText(ctx, drawParameters.routeIdentifier, offsetScaleX(720), offsetScaleY(332), resizedScaleX(284), TextAlign.Center, DrawTextMethod.fillText, 1.5);
		}

		// 日期时间
		if (drawParameters.isHKWestKowloonStyle) {
			ctx.font = resizedFont(4, 'SongTi', true);
			ctx.fillText(`年`, offsetScaleX(310), offsetScaleY(454));
			ctx.fillText(`月`, offsetScaleX(460), offsetScaleY(454));
			ctx.fillText(`日`, offsetScaleX(619), offsetScaleY(454));
			ctx.fillText(`開`, offsetScaleX(877), offsetScaleY(454));
			ctx.font = resizedFont(3.5, 'SongTi', true);
			ctx.fillText(`Ｙ`, offsetScaleX(310), offsetScaleY(494));
			ctx.fillText(`Ｍ`, offsetScaleX(460), offsetScaleY(494));
			ctx.fillText(`Ｄ`, offsetScaleX(619), offsetScaleY(494));
			ctx.fillText(`DEP`, offsetScaleX(877), offsetScaleY(494));
		} else {
			ctx.font = resizedFont(4, 'SongTi', true);
			ctx.fillText(`年`, offsetScaleX(310), offsetScaleY(474));
			ctx.fillText(`月`, offsetScaleX(460), offsetScaleY(474));
			ctx.fillText(`日`, offsetScaleX(619), offsetScaleY(474));
			ctx.fillText(`开`, offsetScaleX(877), offsetScaleY(474));
		}
		ctx.font = resizedFont(6.5, 'HeiTi');
		ctx.fillText(new Date(drawParameters.date).getFullYear().toString(), offsetScaleX(148), offsetScaleY(482));
		ctx.fillText((new Date(drawParameters.date).getMonth() + 1).toString().padStart(2, '0'), offsetScaleX(378), offsetScaleY(482));
		ctx.fillText(new Date(drawParameters.date).getDate().toString().padStart(2, '0'), offsetScaleX(529), offsetScaleY(482));
		ctx.fillText(drawParameters.time, offsetScaleX(680), offsetScaleY(482));

		// 车厢座位
		if (drawParameters.isHKWestKowloonStyle) {
			// 香港樣式
			if (!drawParameters.noCarriage) {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`車廂`, offsetScaleX(1180), offsetScaleY(454));
				ctx.font = resizedFont(3.5, 'SongTi', true);
				ctx.fillText(`Car`, offsetScaleX(1190), offsetScaleY(494));

				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${drawParameters.carriage}`, offsetScaleX(1096), offsetScaleY(489));
			}

			if (drawParameters.noSeat) {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`無座`, offsetScaleX(1330), offsetScaleY(454));
				ctx.font = resizedFont(3.5, 'SongTi', true);
				ctx.fillText(`No Seat`, offsetScaleX(1300), offsetScaleY(494));
			} else {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`座`, offsetScaleX(1410), offsetScaleY(454));
				ctx.font = resizedFont(3.5, 'SongTi', true);
				ctx.fillText(`Seat`, offsetScaleX(1395), offsetScaleY(494));
				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${drawParameters.seat1}`, offsetScaleX(1281), offsetScaleY(489));
				ctx.font = resizedFont(5, 'SongTi');
				ctx.fillText(`${drawParameters.seat2}`, offsetScaleX(1358), offsetScaleY(481));
			}
		} else {
			// 非香港样式
			if (!drawParameters.noCarriage) {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`车`, offsetScaleX(1171), offsetScaleY(474));

				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${drawParameters.carriage}`, offsetScaleX(1096), offsetScaleY(489));
			}

			if (drawParameters.noSeat) {
				ctx.font = resizedFont(6, 'SongTi');
				ctx.fillText(`无座`, offsetScaleX(drawParameters.noCarriage ? 1180 : 1250), offsetScaleY(484));
			} else {
				if (drawParameters.seatStatus === '') {
					ctx.font = resizedFont(4, 'SongTi', true);

					ctx.fillText(`号`, offsetScaleX(1345), offsetScaleY(484));
					ctx.font = resizedFont(6.5, 'HeiTi');
					drawText(ctx, drawParameters.seat1, offsetScaleX(1231), offsetScaleY(489), resizedScaleX(drawParameters.seat2.length === 0 ? 100 : 79), TextAlign.Right);
					ctx.font = resizedFont(5.5, 'SongTi');
					ctx.fillText(`${drawParameters.seat3}`, offsetScaleX(1397), offsetScaleY(489));
					ctx.font = resizedFont(5, 'SongTi');
					ctx.fillText(`${drawParameters.seat2}`, offsetScaleX(1308), offsetScaleY(481));
				} else {
					ctx.font = resizedFont(6, 'SongTi');
					ctx.fillText(drawParameters.seatStatus, offsetScaleX(drawParameters.noCarriage ? 1180 : 1250), offsetScaleY(484));
				}
			}
		}

		// 价格
		if (!drawParameters.isHKWestKowloonStyle) {
			ctx.font = resizedFont(4, 'SongTi', true);
			ctx.fillText(`元`, offsetScaleX(220 + (`￥${drawParameters.price}`.length > 9 ? 9 : `￥${drawParameters.price}`.length) * 30), offsetScaleY(561));

			ctx.font = resizedFont(5.5, 'SongTi');
			drawText(ctx, `￥`, offsetScaleX(145), offsetScaleY(566), resizedScaleX(100), TextAlign.Left, DrawTextMethod.fillText, 0, 1, 1, 1);
			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(`${drawParameters.price}`, offsetScaleX(203), offsetScaleY(568), resizedScaleX(300));
		} else {
			ctx.font = resizedFont(5.5, 'SongTi', true);
			ctx.fillText(`HK$`, offsetScaleX(148), offsetScaleY(568), resizedScaleX(100));
			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(`${drawParameters.price}`, offsetScaleX(253), offsetScaleY(568), resizedScaleX(300));
		}

		// 购票方式
		const wordWidth = 3; // ctx.measureText('永').width;
		drawParameters.purchaseMethod.forEach((purchaseMethodItem, index) => {
			if (purchaseMethodItem.length === 1) {
				if (drawParameters.doPurchaseMethodHaveCircle) {
					ctx.beginPath();
					ctx.arc(offsetScaleX(700 + index * wordWidth * 35), offsetScaleY(550), resizedScaleY(36), 0, 2 * Math.PI);
					ctx.strokeStyle = 'black';
					ctx.lineWidth = resizedScaleX(3);
					ctx.stroke();
					ctx.closePath();

					ctx.font = `${resizedFont(5.6, 'SongTi')}`;
					ctx.fillStyle = 'black';
					ctx.fillText(purchaseMethodItem, offsetScaleX(667 + index * wordWidth * 35), offsetScaleY(574));
				} else {
					ctx.font = `${resizedFont(6, 'SongTi')}`;
					ctx.fillStyle = 'black';
					ctx.fillText(purchaseMethodItem, offsetScaleX(667 + index * wordWidth * 25), offsetScaleY(581));
				}
			} else {
				ctx.font = `${resizedFont(6, 'SongTi')}`;
				ctx.fillStyle = 'black';
				ctx.fillText(purchaseMethodItem, offsetScaleX(667 + index * wordWidth * 35), offsetScaleY(581));
			}
		});

		// 车厢
		if (drawParameters.seatClass.includes('/')) {
			const chinese = drawParameters.seatClass.split('/')[0];
			const english = drawParameters.seatClass.split('/')[1];

			ctx.font = resizedFont(5.8, 'Heiti');
			ctx.fillText(`${chinese}`, offsetScaleX(1070), offsetScaleY(579), resizedScaleX(398));
			ctx.font = resizedFont(5.5, 'SongTi');
			ctx.fillText(`${english}`, offsetScaleX(1200), offsetScaleY(579), resizedScaleX(398));
		} else {
			ctx.font = resizedFont(5.5, 'SongTi');
			ctx.fillText(`${drawParameters.seatClass}`, offsetScaleX(1223), offsetScaleY(579), resizedScaleX(398));
		}

		// 信息1 2
		ctx.font = resizedFont(5.5, 'SongTi');
		drawText(ctx, `${drawParameters.info1}${drawParameters.info1.length > 0 ? '  ' : ''}${drawParameters.info2}`, offsetScaleX(140), offsetScaleY(650));
		// 信息3
		ctx.font = resizedFont(5.5, 'SongTi');
		drawText(ctx, `${drawParameters.info3}`, offsetScaleX(140), offsetScaleY(734));

		// 身份证+姓名
		if (drawParameters.doShowPassenger) {
			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(drawParameters.idNumber, offsetScaleX(133), offsetScaleY(824));
			ctx.font = resizedFont(6, 'SongTi');
			ctx.fillText(drawParameters.passenger, offsetScaleX(839), offsetScaleY(824));
		}

		// 说明
		if (drawParameters.doShowMessage) {
			ctx.font = resizedFont(4.5, 'SongTi');
			if (drawParameters.showMessageBorder) {
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(4);
				ctx.setLineDash([resizedScaleX(23), resizedScaleX(10)]);
				ctx.strokeRect(offsetScaleX(208), offsetScaleY(850), resizedScaleX(959), resizedScaleY(150));
				ctx.setLineDash([]);
				drawText(ctx, drawParameters.message, offsetScaleX(216), offsetScaleY(908), resizedScaleX(942), drawParameters.messageAlign, DrawTextMethod.fillText, 0);
			} else {
				drawText(ctx, drawParameters.message, offsetScaleX(133), offsetScaleY(890), resizedScaleX(1034), drawParameters.messageAlign, DrawTextMethod.fillText, 0);
			}
		}

		//QR
		if (drawParameters.doShowQRCode) {
			drawQRCode(ctx, offsetScaleX(1223), offsetScaleY(730), resizedScaleX(380), drawParameters.qrCodeText);
		}

		// code 下方购票处
		ctx.font = resizedFont(5.5, 'SongTi');
		ctx.fillText(drawParameters.serialCode + (drawParameters.showSoldPlaceDown ? `  ${drawParameters.soldplace}售` : ''), offsetScaleX(133), offsetScaleY(1080), resizedScaleX(1090));

		onDone?.();
	};

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

		ctx.font = `${resizedFont(6.1, 'HeiTi', true)}`;
		drawText(ctx, '乘车须知：', offsetScaleX(242, false), offsetScaleY(178 + (isMag ? mag_Y_offset : 0), false), resizedScaleX(552), TextAlign.Left, DrawTextMethod.fillText, 0);
		ctx.font = `${resizedFont(4.2, 'SongTi')}`;
		drawText(
			ctx,
			CRTicketFlipSideText,
			offsetScaleX(127, false),
			offsetScaleY(175 + (isMag ? mag_Y_offset : 0), false),
			resizedScaleX(1568 - 127),
			TextAlign.Left,
			DrawTextMethod.fillText,
			0,
			1.25
		);

		if (!isMag) {
			ctx.strokeStyle = 'black';
			ctx.fillRect(offsetScaleX(0, false), offsetScaleY(1016, false), resizedScaleX(1700), resizedScaleY(1098 - 1016));
		}

		onDone?.();
	};

	if (isFlip) {
		onBgImageLoadStart?.();
		drawFlip();
		onBgImageLoaded?.();
	} else {
		onBgImageLoadStart?.();
		switch (drawParameters.background) {
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
				// 有背景的
				bg.onload = () => {
					onBgImageLoaded?.();
					draw();
				};
				break;
			case CRTicketBackGround.MagNoneBackground:
			case CRTicketBackGround.SoftNoneBackground:
				onBgImageLoaded?.();
				draw();
				break;
		}
	}
};
