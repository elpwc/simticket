'use client';

import { useEffect, useRef, useState } from 'react';
import cr_red from '../../../assets/tickets/cr_red.png';
import cr_blue from '../../../assets/tickets/cr_blue.png';
import cr_mag_blue from '../../../assets/tickets/cr_mag_blue.png';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { CR_TRAIN_TYPE_ARRAY, CR_TRAIN_TYPES, drawQRCode, drawText, DrawTextMethod, TextAlign } from '@/utils/utils';
import Toggle from '../../InfrastructureCompo/Toggle';
import TabBox from '../../InfrastructureCompo/TabBox';
import InputRadioGroup from '../../InfrastructureCompo/InputRadioGroup';
import { Divider } from '../../InfrastructureCompo/Divider';
import localFonts from 'next/font/local';
import { CRWideTicketBgSelector, CRTicketBackGround } from './CRWideTicketBgSelector';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { pinyin } from 'pinyin-pro';

export const HuawenXinwei = localFonts({
	src: '../../../assets/fonts/STXINWEI.woff2',
});
export const SongTi = localFonts({
	//src: '../../assets/fonts/simsun.woff2',
	src: '../../../assets/fonts/NotoSerifSC-VF.woff2',
});
export const HeiTi = localFonts({
	src: '../../../assets/fonts/simhei.woff2',
});

const PAPER_TICKET_SIZE = [1698, 1162];
const MAG_TICKET_SIZE = [1689, 1042];
const PAPER_TICKET_CANVAS_SIZE = [322, 220];
const MAG_TICKET_CANVAS_SIZE = [320, 197];

const enum RightUpContentType {
	None = 'none',
	SoldPlace = 'soldplace',
	Turnstile = 'turnstile',
}

export default function TrainTicket() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontRef = useRef<(size: number, fontName: string) => string>(null);

	const [size, setSize] = useState(PAPER_TICKET_SIZE);
	const [canvasSize, setCanvasSize] = useState(PAPER_TICKET_CANVAS_SIZE);

	const [background, setBackground] = useState<CRTicketBackGround>(CRTicketBackGround.SoftRed);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [watermark, setWatermark] = useState('票样');
	const [ticketNo, setTicketNo] = useState('A000001');
	const [station1, setStation1] = useState('东京都区内');
	const [station2, setStation2] = useState('北京朝阳');
	const [station1en, setStation1en] = useState('Tokyo Ward Area');
	const [station2en, setStation2en] = useState('Beijingchaoyang');
	const [doShowZhan, setDoShowZhan] = useState(true);
	const [doShowEnglish, setDoShowEnglish] = useState(true);
	const [doUseHuaWenXinWei1, setDoUseHuaWenXinWei1] = useState(false);
	const [doUseHuaWenXinWei2, setDoUseHuaWenXinWei2] = useState(false);
	const [routeIdentifier, setRouteIdentifier] = useState('Z1140');
	const [date, setDate] = useState(new Date());
	const [time, setTime] = useState('11:55');
	const [carriage, setCarriage] = useState('04');
	const [seat1, setSeat1] = useState('12');
	const [seat2, setSeat2] = useState('F');
	const [seat3, setSeat3] = useState('上铺');
	const [seatClass, setSeatClass] = useState('新空调硬卧');
	const [price, setPrice] = useState('1540.0');
	const [idNumber, setIdNumber] = useState('1145141980****1919');
	const [passenger, setPassenger] = useState('田所浩二');
	const [doShowPassenger, setDoShowPassenger] = useState(true);
	const [soldplace, setSoldPlace] = useState('稚内');
	const [turnstile, setTurnstile] = useState('A13');
	const [showSoldPlaceDown, setShowSoldPlaceDown] = useState(true);
	const [rightUpContentType, setRightUpContentType] = useState(RightUpContentType.Turnstile);
	const [serialCode, setSerialCode] = useState('1145141919810A000001 JM');
	const [qrCodeText, setQrCodeText] = useState('1145141919810');
	const [purchaseMethod, setPurchaseMethod] = useState(['学', '网']);
	const [doPurchaseMethodHaveCircle, setDoPurchaseMethodHaveCircle] = useState(true);
	const [noSeat, setNoSeat] = useState(false);
	const [noCarriage, setNoCarriage] = useState(false);
	const [info1, setInfo1] = useState('限乘当日当次车');
	const [info2, setInfo2] = useState('中途下车失效');
	const [info3, setInfo3] = useState('');
	const [message, setMessage] = useState(`买票请到12306 发货请到95306
中国铁路祝您旅途愉快`);
	const [messageAlign, setMessageAlign] = useState(TextAlign.Center);
	const [doShowMessage, setDoShowMessage] = useState(true);
	const [info1TrainType, setinfo1TrainType] = useState('');
	const [info1from, setinfo1From] = useState('');
	const [info1to, setinfo1To] = useState('');

	const purchaseMethodList = ['孩', '学', '工', '军', '残', '网', '折', '惠', '支', '微', '赠', '招', '中', '团', '纪念票', '挂失补'];
	const info1List = ['限乘当日当次车'];
	const info2List = ['中途下车失效', '在2日内有效', '在3日内有效', '随原票使用', '随原票使用有效'];
	const info3List = ['仅供报销使用', '变更到站', '退票费', '中转签证', '乘车证签证', '始发改签'];

	const seatType = ['商务座', '一等座', '二等座', '动卧', '新空调高级软卧', '新空调软卧', '新空调硬卧', '新空调软座', '新空调硬座', '软座', '硬座', '软卧代软座'];
	const sleepingCarSeatType = ['动卧', '新空调高级软卧', '新空调软卧', '新空调硬卧'];

	const messageList = [
		`买票请到12306 发货请到95306
中国铁路祝您旅途愉快`,
		`报销凭证 遗失不补
退票改签时须交回车站`,
		`欢度国庆，祝福祖国
中国铁路祝您旅途愉快`,
	];
	useEffect(() => {
		const loadFonts = async () => {
			const fonts = [
				new FontFace('HuawenXinwei', 'url(../../../assets/fonts/STXINWEI.woff2)'),
				new FontFace('SongTi', 'url(../../../assets/fonts/simsun.woff2)'),
				new FontFace('HeiTi', 'url(../../../assets/fonts/simhei.woff2)'),
			];
			await Promise.all(fonts.map((f) => f.load()));
			fonts.forEach((f) => document.fonts.add(f));
		};
		loadFonts();
	}, []);

	const drawTicket = () => {
		handleDraw(canvasRef.current, ctxRef.current, scaleXRef.current, scaleYRef.current, fontRef.current);
	};

	const handleDraw = (
		canvas: HTMLCanvasElement | null,
		ctx: CanvasRenderingContext2D | null,
		scaleX: ((x: number) => number) | null,
		scaleY: ((y: number) => number) | null,
		font: ((size: number, fontName: string, isBold?: boolean) => string) | null
	) => {
		if (!ctx || !canvas || !scaleX || !scaleY || !font) {
			return;
		}
		const w = canvas.width;
		const h = canvas.height;
		const backgroundEdgeHori = 0.04;
		const backgroundEdgeVert = 0.07;

		const resizedScaleX = (value: number) => {
			switch (background) {
				case CRTicketBackGround.MagRed:
				case CRTicketBackGround.MagBlue:
					return scaleX((value / MAG_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[0]);
				case CRTicketBackGround.SoftRed:
				case CRTicketBackGround.SoftBlue:
				default:
					return scaleX(value);
			}
		};
		const resizedScaleY = (value: number) => {
			switch (background) {
				case CRTicketBackGround.MagRed:
				case CRTicketBackGround.MagBlue:
					return scaleY((value / MAG_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[1]);
				case CRTicketBackGround.SoftRed:
				case CRTicketBackGround.SoftBlue:
				default:
					return scaleY(value);
			}
		};
		const offsetScaleX = (value: number) => {
			switch (background) {
				case CRTicketBackGround.MagRed:
				case CRTicketBackGround.MagBlue:
					return scaleX(((value - PAPER_TICKET_SIZE[1] * backgroundEdgeHori) / MAG_TICKET_SIZE[0]) * PAPER_TICKET_SIZE[0]) + offsetX;
				case CRTicketBackGround.SoftRed:
				case CRTicketBackGround.SoftBlue:
				default:
					return scaleX(value) + offsetX;
			}
		};
		const offsetScaleY = (value: number) => {
			switch (background) {
				case CRTicketBackGround.MagRed:
				case CRTicketBackGround.MagBlue:
					return scaleY(((value - PAPER_TICKET_SIZE[1] * backgroundEdgeVert) / MAG_TICKET_SIZE[1]) * PAPER_TICKET_SIZE[1]) + offsetY;
				case CRTicketBackGround.SoftRed:
				case CRTicketBackGround.SoftBlue:
				default:
					return scaleY(value) + offsetY;
			}
		};
		const resizedFont = (size: number, fontName: string, isBold?: boolean) => {
			switch (background) {
				case CRTicketBackGround.MagRed:
				case CRTicketBackGround.MagBlue:
					return font((size / MAG_TICKET_CANVAS_SIZE[1]) * PAPER_TICKET_CANVAS_SIZE[1], fontName, isBold);
				case CRTicketBackGround.SoftRed:
				case CRTicketBackGround.SoftBlue:
				default:
					return font(size, fontName, isBold);
			}
		};

		const bg = new Image();
		switch (background) {
			case CRTicketBackGround.SoftRed:
				bg.src = cr_red.src;
				break;
			case CRTicketBackGround.SoftBlue:
				bg.src = cr_blue.src;
				break;
			case CRTicketBackGround.MagRed:
				bg.src = cr_red.src;
				break;
			case CRTicketBackGround.MagBlue:
				bg.src = cr_mag_blue.src;
				break;
		}
		bg.onload = () => {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, w, h);
			// 底图
			if (background === CRTicketBackGround.SoftRed || background === CRTicketBackGround.SoftBlue) {
				ctx.drawImage(bg, w * backgroundEdgeHori, h * backgroundEdgeVert, w * (1 - 2 * backgroundEdgeHori), h * (1 - 2 * backgroundEdgeVert));
			} else {
				ctx.drawImage(bg, 0, 0, w, h);
			}

			// 票号
			ctx.fillStyle = '#f89c9c';
			ctx.font = `${resizedFont(8, 'HeiTi')}`;
			drawText(ctx, ticketNo, offsetScaleX(118), offsetScaleY(224), resizedScaleX(443), TextAlign.Left, DrawTextMethod.fillText, 1);

			// 票样
			ctx.beginPath();
			ctx.strokeStyle = '#ffbbbb';
			ctx.lineWidth = 1;
			ctx.font = `bold ${resizedFont(26, 'HeiTi')}`;
			drawText(ctx, watermark, offsetScaleX(350), offsetScaleY(670), resizedScaleX(1000), TextAlign.JustifyAround, DrawTextMethod.strokeText);
			ctx.closePath();

			// 右上角
			switch (rightUpContentType) {
				case RightUpContentType.SoldPlace:
					// 售票点
					ctx.fillStyle = 'black';
					ctx.strokeStyle = 'black';
					ctx.font = `${resizedFont(6, 'SongTi')}`;
					ctx.fillText(soldplace, offsetScaleX(1315), offsetScaleY(210));

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
					ctx.fillText('检票:' + turnstile, offsetScaleX(1315), offsetScaleY(210));
					break;
				case RightUpContentType.None:
					// 不显示
					break;
				default:
					// 自定义
					ctx.fillStyle = 'black';
					ctx.font = `${resizedFont(6, 'SongTi')}`;
					ctx.fillText(rightUpContentType, offsetScaleX(1315), offsetScaleY(210));
					break;
			}

			// 中文站名
			if (doShowZhan) {
				ctx.fillStyle = 'black';
				ctx.font = `${resizedFont(5.5, 'SongTi', true)}`;
				ctx.fillText('站', offsetScaleX(538), offsetScaleY(doShowEnglish ? 321 : 351));
				ctx.fillText('站', offsetScaleX(1407), offsetScaleY(doShowEnglish ? 321 : 351));
			}

			ctx.fillStyle = 'black';
			ctx.font = `${doUseHuaWenXinWei1 ? resizedFont(9, 'HuawenXinwei') : resizedFont(8.5, 'HeiTi')}`;
			drawText(ctx, station1, offsetScaleX(197), offsetScaleY(doShowEnglish ? 335 : 365), resizedScaleX(doShowZhan ? 322 : 438), TextAlign.JustifyEvenly);
			ctx.font = `${doUseHuaWenXinWei2 ? resizedFont(9, 'HuawenXinwei') : resizedFont(8.5, 'HeiTi')}`;
			drawText(ctx, station2, offsetScaleX(1054), offsetScaleY(doShowEnglish ? 335 : 365), resizedScaleX(doShowZhan ? 322 : 438), TextAlign.JustifyEvenly);

			// 英文站名
			if (doShowEnglish) {
				ctx.font = resizedFont(4.5, 'SongTi');
				drawText(ctx, station1en, offsetScaleX(183), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
				drawText(ctx, station2en, offsetScaleX(1072), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
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

			const routeIdentifierFirstChar = routeIdentifier.substring(0, 1);
			const routeIdentifierNumbersChar = routeIdentifier.substring(1, routeIdentifier.length);
			if (/^[A-Z]$/.test(routeIdentifierFirstChar)) {
				ctx.font = `${resizedFont(7, 'SongTi')}`;
				ctx.fillText(routeIdentifierFirstChar, offsetScaleX(720), offsetScaleY(326), resizedScaleX(64));
				ctx.font = `${resizedFont(8, 'SongTi')}`;
				ctx.fillText(routeIdentifierNumbersChar, offsetScaleX(787), offsetScaleY(332), resizedScaleX(271));
			} else {
				ctx.font = `${resizedFont(8, 'SongTi')}`;
				drawText(ctx, routeIdentifier, offsetScaleX(720), offsetScaleY(332), resizedScaleX(284), TextAlign.Center);
			}

			// 日期时间
			ctx.font = resizedFont(4, 'SongTi', true);
			ctx.fillText(`年          月         日                  开`, offsetScaleX(310), offsetScaleY(474));
			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(`${date.getFullYear()}  ${(date.getMonth() + 1).toString().padStart(2, '0')}  ${date.getDate().toString().padStart(2, '0')}  ${time}`, offsetScaleX(148), offsetScaleY(482));
			if (!noCarriage) {
				ctx.font = resizedFont(4, 'SongTi', true);
				ctx.fillText(`车`, offsetScaleX(1171), offsetScaleY(484));
				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${carriage}`, offsetScaleX(1096), offsetScaleY(489));
			}
			if (noSeat) {
				ctx.font = resizedFont(6, 'SongTi');
				ctx.fillText(`无座`, offsetScaleX(1250), offsetScaleY(484));
			} else {
				ctx.font = resizedFont(4, 'SongTi', true);

				ctx.fillText(`号`, offsetScaleX(1345), offsetScaleY(484));
				ctx.font = resizedFont(6.5, 'HeiTi');
				ctx.fillText(`${seat1}`, offsetScaleX(1231), offsetScaleY(489));
				ctx.font = resizedFont(5.5, 'SongTi');
				ctx.fillText(`${seat3}`, offsetScaleX(1397), offsetScaleY(489));
				ctx.font = resizedFont(5, 'SongTi');
				ctx.fillText(`${seat2}`, offsetScaleX(1308), offsetScaleY(481));
			}

			// 价格
			ctx.font = resizedFont(4, 'SongTi');
			ctx.fillText(`元`, offsetScaleX(220 + `￥${price}`.length * 35), offsetScaleY(561));
			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(`￥${price}`, offsetScaleX(163), offsetScaleY(568), resizedScaleX(300));

			// 购票方式
			const wordWidth = 3; // ctx.measureText('永').width;
			purchaseMethod.forEach((purchaseMethodItem, index) => {
				if (purchaseMethodItem.length === 1) {
					if (doPurchaseMethodHaveCircle) {
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
			ctx.font = resizedFont(5.5, 'SongTi');
			ctx.fillText(`${seatClass}`, offsetScaleX(1223), offsetScaleY(579), resizedScaleX(398));

			// 信息1 2
			ctx.font = resizedFont(5.5, 'SongTi');
			drawText(ctx, `${info1}${info1.length > 0 ? '  ' : ''}${info2}`, offsetScaleX(140), offsetScaleY(650));
			// 信息3
			ctx.font = resizedFont(5.5, 'SongTi');
			drawText(ctx, `${info3}`, offsetScaleX(140), offsetScaleY(734));

			// 身份证+姓名
			ctx.font = resizedFont(6.5, 'HeiTi');
			ctx.fillText(idNumber, offsetScaleX(133), offsetScaleY(824));
			ctx.font = resizedFont(6, 'SongTi');
			ctx.fillText(passenger, offsetScaleX(839), offsetScaleY(824));

			// 说明
			if (doShowMessage) {
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(4);
				ctx.setLineDash([resizedScaleX(23), resizedScaleX(10)]);
				ctx.strokeRect(offsetScaleX(208), offsetScaleY(850), resizedScaleX(959), resizedScaleY(150));
				ctx.setLineDash([]);

				ctx.font = resizedFont(4.5, 'SongTi');

				drawText(ctx, message, offsetScaleX(216), offsetScaleY(908), resizedScaleX(942), messageAlign, DrawTextMethod.fillText, 0);
			}

			//QR
			drawQRCode(ctx, offsetScaleX(1223), offsetScaleY(730), resizedScaleX(380), qrCodeText);
			// code 下方购票处
			ctx.font = resizedFont(5.5, 'SongTi');
			ctx.fillText(serialCode + (showSoldPlaceDown ? `  ${soldplace}售` : ''), offsetScaleX(133), offsetScaleY(1080), resizedScaleX(1090));
		};
	};

	useEffect(() => {
		switch (background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
				setCanvasSize(MAG_TICKET_CANVAS_SIZE);
				break;
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
				setCanvasSize(PAPER_TICKET_CANVAS_SIZE);
				break;
		}
	}, [background]);

	useEffect(() => {
		drawTicket();
	}, [
		drawTicket,
		size,
		canvasSize,
		background,
		offsetX,
		offsetY,
		ticketNo,
		station1,
		station2,
		station1en,
		station2en,
		doShowZhan,
		doShowEnglish,
		doUseHuaWenXinWei1,
		doUseHuaWenXinWei2,
		routeIdentifier,
		date,
		time,
		carriage,
		seat1,
		seat2,
		seat3,
		seatClass,
		price,
		idNumber,
		passenger,
		qrCodeText,
		soldplace,
		serialCode,
		noSeat,
		noCarriage,
		purchaseMethod,
		doPurchaseMethodHaveCircle,
		info1,
		info2,
		info3,
		message,
	]);
	useEffect(() => {
		setQrCodeText(`${station1}-${station2} No.${ticketNo} ${date.toISOString().slice(0, 10)} ${time} ${seatClass}车 ${carriage}${seat1}${seat2}号${seat3} ￥${price}元`);
	}, [ticketNo, station1, station2, date, time, carriage, seat1, seat2, seat3, seatClass, price]);

	return (
		<TicketEditorTemplate
			onCanvasLoad={function (
				canvas: HTMLCanvasElement,
				ctx: CanvasRenderingContext2D | null,
				scaleX: (x: number) => number,
				scaleY: (y: number) => number,
				font: (size: number, fontName: string, isBold?: boolean) => string
			): void {
				canvasRef.current = canvas;
				ctxRef.current = ctx;
				scaleXRef.current = scaleX;
				scaleYRef.current = scaleY;
				fontRef.current = font;
				drawTicket();
			}}
			canvasWidth={canvasSize[0]}
			canvasHeight={canvasSize[1]}
			canvasBorderRadius={background === CRTicketBackGround.MagBlue || background === CRTicketBackGround.MagRed ? 16 : 0}
			canvasShowShandow={background === CRTicketBackGround.SoftRed || background === CRTicketBackGround.SoftBlue}
			scaleXWidth={size[0]}
			scaleYWidth={size[1]}
			saveFilename={`ticket_${station1}-${station2}`}
			form={
				<div className="flex flex-col gap-4 m-4">
					<TabBox title="票面" className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							车票用纸
							<CRWideTicketBgSelector value={background} onChange={setBackground} />
						</label>
						<label className="ticket-form-label">
							印刷偏移
							<div className="flex grid-cols-3 gap-2">
								<label className="flex gap-1 items-center">
									X<input className="max-w-[50px]" type="number" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
								</label>
								<label className="flex gap-1 items-center">
									Y<input className="max-w-[50px]" type="number" value={0 - offsetY} onChange={(e) => setOffsetY(0 - Number(e.target.value))} />
								</label>
								<button
									className="w-[max-content] text-[12px]"
									onClick={() => {
										setOffsetX(0);
										setOffsetY(0);
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
										<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
									</svg>
								</button>
							</div>
						</label>
						<label className="ticket-form-label">
							水印
							<input className="text-red-400" value={watermark} onChange={(e) => setWatermark(e.target.value)} />
						</label>
					</TabBox>
					<TabBox title="车站信息" className="flex flex-wrap gap-1">
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								出发
								<input
									value={station1}
									onChange={(e) => {
										let stationEnglish = pinyin(e.target.value, { toneType: 'none', type: 'array' }).join('');
										stationEnglish = stationEnglish.substring(0, 1).toUpperCase() + stationEnglish.substring(1, stationEnglish.length);
										setStation1en(stationEnglish);

										setStation1(e.target.value);
									}}
								/>
							</label>
							<label className="ticket-form-label">
								出发英文
								<input value={station1en} onChange={(e) => setStation1en(e.target.value)} />
							</label>
							<label>
								<Toggle
									value={doUseHuaWenXinWei1}
									onChange={(value) => {
										setDoUseHuaWenXinWei1(value);
									}}
								/>
								<span>
									使用<span className={HuawenXinwei.className}>魏碑体</span>
								</span>
							</label>
						</div>
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								到达
								<input
									value={station2}
									onChange={(e) => {
										let stationEnglish = pinyin(e.target.value, { toneType: 'none', type: 'array' }).join('');
										stationEnglish = stationEnglish.substring(0, 1).toUpperCase() + stationEnglish.substring(1, stationEnglish.length);
										setStation2en(stationEnglish);
										setStation2(e.target.value);
									}}
								/>
							</label>
							<label className="ticket-form-label">
								到达英文
								<input value={station2en} onChange={(e) => setStation2en(e.target.value)} />
							</label>
							<label>
								<Toggle
									value={doUseHuaWenXinWei2}
									onChange={(value) => {
										setDoUseHuaWenXinWei2(value);
									}}
								/>
								<span>
									使用<span className={HuawenXinwei.className}>魏碑体</span>
								</span>
							</label>
						</div>
						<div className="flex flex-wrap gap-2">
							<label>
								<Toggle
									value={doShowZhan}
									onChange={(value) => {
										setDoShowZhan(value);
									}}
								/>
								<span>显示「站」</span>
							</label>
							<label>
								<Toggle
									value={doShowEnglish}
									onChange={(value) => {
										setDoShowEnglish(value);
									}}
								/>
								<span>显示英文</span>
							</label>
						</div>
					</TabBox>

					<TabBox title="运行信息" className="flex flex-wrap gap-2">
						<label className="ticket-form-label">
							车次
							<div className="flex gap-4 items-center flex-wrap">
								<input value={routeIdentifier} onChange={(e) => setRouteIdentifier(e.target.value)} />
								<label className="">
									<Toggle
										value={routeIdentifier.substring(0, 1) === '0' ? true : false}
										onChange={(value) => {
											if (value) {
												if (routeIdentifier.substring(0, 1) !== '0') {
													setRouteIdentifier((prev) => '0' + prev);
												}
											} else {
												if (routeIdentifier.substring(0, 1) === '0') {
													setRouteIdentifier((prev) => prev.substring(1, prev.length));
												}
											}
										}}
									/>
									<span>回送车次</span>
								</label>
							</div>
						</label>
						<PrettyInputRadioGroup
							list={CR_TRAIN_TYPES.map((type) => {
								return {
									value: type.value,
									title: (
										<span>
											{type.value}
											<span className="text-[10px]">{type.desc}</span>
										</span>
									),
								};
							})}
							value={
								CR_TRAIN_TYPE_ARRAY.includes(routeIdentifier.substring(routeIdentifier.substring(0, 1) === '0' ? 1 : 0, routeIdentifier.substring(0, 1) === '0' ? 2 : 1))
									? routeIdentifier.substring(routeIdentifier.substring(0, 1) === '0' ? 1 : 0, routeIdentifier.substring(0, 1) === '0' ? 2 : 1)
									: ''
							}
							onChange={(value: string) => {
								const routeIdentifierFirstChar = routeIdentifier.substring(routeIdentifier.substring(0, 1) === '0' ? 1 : 0, routeIdentifier.substring(0, 1) === '0' ? 2 : 1);
								if (CR_TRAIN_TYPE_ARRAY.includes(routeIdentifierFirstChar)) {
									const routeIdentifierNumbersChar = routeIdentifier.substring(routeIdentifier.substring(0, 1) === '0' ? 2 : 1, routeIdentifier.length);
									setRouteIdentifier((prev) => (prev.substring(0, 1) === '0' ? '0' : '') + value + routeIdentifierNumbersChar);
								} else {
									setRouteIdentifier(value + routeIdentifier);
								}

								setSeat3(value);
							}}
							placeholder="普客普快(自定义)"
						/>

						<label className="ticket-form-label">
							發车日期
							<input type="date" value={date.toISOString().slice(0, 10)} onChange={(e) => setDate(new Date(e.target.value))} />
						</label>
						<label className="ticket-form-label">
							發车时间
							<input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							&nbsp;
							<div className="flex flex-wrap gap-2">
								<label>
									<input
										type="checkbox"
										checked={noSeat}
										onChange={(e) => {
											setNoSeat(e.target.checked);
										}}
									/>
									<span>无座</span>
								</label>
								<label>
									<input
										type="checkbox"
										checked={noCarriage}
										onChange={(e) => {
											setNoCarriage(e.target.checked);
										}}
									/>
									<span>无指定车厢</span>
								</label>
							</div>
						</label>
						<label className="ticket-form-label">
							车厢
							<input value={carriage} onChange={(e) => setCarriage(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							座位1
							<input value={seat1} onChange={(e) => setSeat1(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							座位2
							<PrettyInputRadioGroup
								list={[
									{ value: 'A', title: 'A' },
									{ value: 'B', title: 'B' },
									{ value: 'C', title: 'C' },
									{ value: 'D', title: 'D' },
									{ value: 'E', title: 'E' },
									{ value: 'F', title: 'F' },
								]}
								value={seat2}
								onChange={(value: string) => {
									setSeat2(value);
								}}
							/>
						</label>
						<label className="ticket-form-label">
							铺位
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: 'up', title: '上铺' },
										{ value: 'center', title: '中铺' },
										{ value: 'down', title: '下铺' },
									]}
									value={seat3}
									onChange={(value: string) => {
										setSeat3(value);
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							座席
							<PrettyInputRadioGroup
								list={seatType.map((seatTypeItem) => {
									return { value: seatTypeItem, title: seatTypeItem };
								})}
								value={seatClass}
								onChange={(value: string) => {
									if (sleepingCarSeatType.includes(value)) {
										setSeat3('下铺');
									} else {
										setSeat3('');
									}

									setSeatClass(value);
								}}
							/>
						</label>
						<label className="ticket-form-label">
							价格
							<input value={price} onChange={(e) => setPrice(e.target.value)} />
						</label>
					</TabBox>

					<TabBox title="购票信息" className="flex flex-wrap">
						<label className="ticket-form-label">
							购票处
							<input className="" value={soldplace} onChange={(e) => setSoldPlace(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							检票
							<input className="" value={turnstile} onChange={(e) => setTurnstile(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							右上角显示
							<div className="flex items-center flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: RightUpContentType.None, title: '不显示' },
										{ value: RightUpContentType.SoldPlace, title: '售票站' },
										{ value: RightUpContentType.Turnstile, title: '检票口' },
									]}
									value={rightUpContentType}
									onChange={(value: string) => {
										setRightUpContentType(value as RightUpContentType);
									}}
									placeholder="自定义"
								/>

								<label>
									<Toggle
										value={showSoldPlaceDown}
										onChange={(value) => {
											setShowSoldPlaceDown(value);
										}}
									/>
									<span>下方显示购票处</span>
								</label>
							</div>
						</label>

						<label className="ticket-form-label">
							乘车人证件号
							<input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							乘车人
							<div>
								<input value={passenger} onChange={(e) => setPassenger(e.target.value)} />
								<label>
									<Toggle
										value={doShowPassenger}
										onChange={(value) => {
											setDoShowPassenger(value);
										}}
									/>
									<span>显示乘车人信息</span>
								</label>
							</div>
						</label>
						<label className="ticket-form-label">
							购票方式
							<div className="flex flex-row gap-1 flex-wrap">
								{purchaseMethodList.map((purchaseMethodItem) => {
									return (
										<label key={purchaseMethodItem}>
											<input
												type="checkbox"
												checked={purchaseMethod.includes(purchaseMethodItem)}
												onChange={(e) => {
													if (purchaseMethod.includes(purchaseMethodItem)) {
														setPurchaseMethod(
															purchaseMethod.filter((j) => {
																return j !== purchaseMethodItem;
															})
														);
													} else {
														setPurchaseMethod([...purchaseMethod, purchaseMethodItem]);
													}
												}}
											/>
											<span className={doPurchaseMethodHaveCircle ? (purchaseMethodItem.length === 1 ? 'border-black border rounded-[20px] text-[14px]' : '') : ''}>
												{purchaseMethodItem}
											</span>
										</label>
									);
								})}
								<label>
									<Toggle
										value={doPurchaseMethodHaveCircle}
										onChange={(value) => {
											setDoPurchaseMethodHaveCircle(value);
										}}
									/>
									<span>购票方式添加圆环</span>
								</label>
							</div>
						</label>
						<Divider />
						<label className="ticket-form-label border-t-[solid_1px_#ccc]">
							信息1
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{
											value: `${info1TrainType}经由${info1from}至${info1to}`,
											title: (
												<div>
													<input
														type="text"
														value={info1TrainType}
														placeholder="自定义"
														onChange={(e) => {
															const val = e.target.value;
															setinfo1TrainType(val);
														}}
														className="border w-16"
													/>
													经由
													<input
														type="text"
														value={info1from}
														placeholder="自定义"
														onChange={(e) => {
															const val = e.target.value;
															setinfo1From(val);
														}}
														className="border w-16"
													/>
													至
													<input
														type="text"
														value={info1to}
														placeholder="自定义"
														onChange={(e) => {
															const val = e.target.value;
															setinfo1To(val);
														}}
														className="border w-16"
													/>
												</div>
											),
										},
										...info1List.map((info1Title) => {
											return {
												value: info1Title,
												title: info1Title,
											};
										}),
									]}
									value={info1}
									onChange={(value: string) => {
										setInfo1(value);
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label border-t-[#ccc_!important]">
							信息2
							<div className="flex gap-3 flex-wrap">
								<InputRadioGroup
									name="info2"
									list={info2List}
									value={info2}
									onChange={(value: string) => {
										setInfo2(value);
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label border-t-[solid_1px_#ccc]">
							信息3
							<div className="flex gap-3 flex-wrap">
								<InputRadioGroup
									name="info3"
									list={info3List}
									value={info3}
									onChange={(value: string) => {
										setInfo3(value);
									}}
								/>
							</div>
						</label>
					</TabBox>
					<TabBox title="票号数据" className="flex flex-wrap">
						<label className="ticket-form-label">
							票号
							<input className="text-red-500" value={ticketNo} onChange={(e) => setTicketNo(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							车票标识码
							<input value={serialCode} onChange={(e) => setSerialCode(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							二维码数据
							<textarea value={qrCodeText} onChange={(e) => setQrCodeText(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							<div>
								<label>
									<Toggle
										value={doShowMessage}
										onChange={(value) => {
											setDoShowMessage(value);
										}}
									/>
									<span>虚线框内文字</span>
								</label>
							</div>
							<div>
								<textarea className="w-full" value={message} onChange={(e) => setMessage(e.target.value)} />
								<PrettyInputRadioGroup
									list={[
										{ value: TextAlign.Left.toString(), title: '左对齐' },
										{ value: TextAlign.Center.toString(), title: '居中' },
										{ value: TextAlign.Right.toString(), title: '右对齐' },
										{ value: TextAlign.JustifyBetween.toString(), title: '靠边铺开' },
										{ value: TextAlign.JustifyEvenly.toString(), title: '等距铺开' },
										{ value: TextAlign.JustifyAround.toString(), title: '最优铺开' },
									]}
									value={messageAlign.toString()}
									onChange={(value: string) => {
										setMessageAlign(Number(value) as TextAlign);
									}}
									placeholder="自定义"
									showInputBox={false}
								/>
								<p>预设文字：</p>
								<PrettyInputRadioGroup
									list={messageList.map((messageListItem) => {
										return { value: messageListItem, title: messageListItem };
									})}
									value={message}
									onChange={(value: string) => {
										setMessage(value);
									}}
									placeholder="自定义"
									showInputBox={false}
								/>
							</div>
						</label>
					</TabBox>
				</div>
			}
		/>
	);
}
