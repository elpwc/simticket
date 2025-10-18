'use client';

import { useEffect, useRef, useState } from 'react';
import cr_red from '../../assets/tickets/cr_red.png';
import cr_blue from '../../assets/tickets/cr_blue.png';
import cr_mag_blue from '../../assets/tickets/cr_mag_blue.png';
import './index.css';
import TicketEditorTemplate from '../TicketEditorTemplate';
import { drawQRCode } from '@/utils/utils';
import Toggle from '../Toggle';
import TabBox from '../TabBox';
import InputRadioGroup from '../InputRadioGroup';
import { Divider } from '../Divider';
import localFonts from 'next/font/local';
import { CRWideTicketBgSelector, CRTicketBackGround } from './CRWideTicketBgSelector';

export const HuawenXinwei = localFonts({
	src: '../../assets/fonts/STXINWEI.woff2',
});
export const SongTi = localFonts({
	src: '../../assets/fonts/simsun.woff2',
});
export const HeiTi = localFonts({
	src: '../../assets/fonts/simhei.woff2',
});

export default function TrainTicket() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontSizeRef = useRef<(size: number, isSerif?: boolean) => string>(null);
	const wordWidthRef = useRef<number>(null);

	const [background, setBackground] = useState<CRTicketBackGround>(CRTicketBackGround.SoftRed);
	const [ticketNo, setTicketNo] = useState('A000001');
	const [showZhan, setShowZhan] = useState(true);
	const [station1, setStation1] = useState('东京都区内');
	const [station2, setStation2] = useState('北京朝阳');
	const [station1en, setStation1en] = useState('Tokyo Ward Area');
	const [station2en, setStation2en] = useState('Beijingchaoyang');
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
	const [soldplace, setSoldPlace] = useState('稚内');
	const [serialCode, setSerialCode] = useState('1145141919810A000001 JM');
	const [qrCodeText, setQrCodeText] = useState('1145141919810');
	const [purchaseMethod, setPurchaseMethod] = useState(['学', '网']);
	const [doPurchaseMethodHaveCircle, setDoPurchaseMethodHaveCircle] = useState(true);
	const [noSeat, setNoSeat] = useState(false);
	const [noCarriage, setNoCarriage] = useState(false);
	const [info1, setInfo1] = useState('');
	const [info2, setInfo2] = useState('限乘当日当次列车');
	const [info3, setInfo3] = useState('中途下车失效');
	const [message, setMessage] = useState(`买票请到12306 发货请到95306
		中国铁路祝您旅途愉快`);
	const [info1TrainType, setinfo1TrainType] = useState('');
	const [info1from, setinfo1From] = useState('');
	const [info1to, setinfo1To] = useState('');

	const purchaseMethodList = ['孩', '学', '工', '军', '残', '网', '折', '惠', '支', '微', '赠', '招', '中', '团', '纪念票', '挂失补'];
	const info1List = ['限乘当日当次车'];
	const info2List = ['中途下车失效', '在2日内有效', '在3日内有效', '随原票使用', '随原票使用有效'];
	const info3List = ['仅供报销使用', '变更到站', '退票费', '中转签证', '乘车证签证', '始发改签'];

	const canvasWidth = 322;
	const canvasHeight = (canvasWidth / 800) * 548;

	useEffect(() => {
		const loadFonts = async () => {
			const fonts = [
				new FontFace('HuawenXinwei', 'url(../../assets/fonts/STXINWEI.woff2)'),
				new FontFace('SongTi', 'url(../../assets/fonts/simsun.woff2)'),
				new FontFace('HeiTi', 'url(../../assets/fonts/simhei.woff2)'),
			];
			await Promise.all(fonts.map((f) => f.load()));
			fonts.forEach((f) => document.fonts.add(f));

			const ctx = canvasRef.current?.getContext('2d');
			if (ctx) {
				ctx.fillStyle = 'black';
				ctx.font = '32px HuawenXinwei';
				ctx.fillText('中文书法字体', 20, 50);

				ctx.font = '28px SourceHanSerifSC';
				ctx.fillText('明朝体字体', 20, 100);

				ctx.font = '28px Roboto';
				ctx.fillText('English Roboto', 20, 150);
			}
		};
		loadFonts();
	}, []);

	const drawTicket = () => {
		handleDraw(canvasRef.current, ctxRef.current, scaleXRef.current, scaleYRef.current, fontSizeRef.current, wordWidthRef.current ?? 0);
	};

	const handleDraw = (
		canvas: HTMLCanvasElement | null,
		ctx: CanvasRenderingContext2D | null,
		scaleX: ((x: number) => number) | null,
		scaleY: ((y: number) => number) | null,
		fontSize: ((size: number, isSerif?: boolean) => string) | null,
		wordWidth: number
	) => {
		if (!ctx || !canvas || !scaleX || !scaleY || !fontSize) {
			return;
		}

		const w = canvas.width;
		const h = canvas.height;
		const backgroundEdgeHori = 0.04;
		const backgroundEdgeVert = 0.07;

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
			ctx.font = `${fontSize(8)}`;
			ctx.fillText(ticketNo, scaleX(118), scaleY(224));

			// 票样
			// ctx.beginPath();
			// ctx.strokeStyle = '#ffbbbb';
			// ctx.lineWidth = 1;
			// ctx.font = `bold ${fontSize(26)}`;
			// ctx.strokeText('票     样', scaleX(380), scaleY(670));
			// ctx.closePath();

			// 售票点
			ctx.fillStyle = 'black';
			ctx.font = `${fontSize(6, true)}`;
			ctx.fillText(soldplace, scaleX(1315), scaleY(210));

			ctx.beginPath();
			ctx.arc(scaleX(1500), scaleY(185), scaleY(40), 0, 2 * Math.PI);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = scaleX(5);
			ctx.stroke();
			ctx.closePath();

			ctx.font = `${fontSize(6, true)}`;
			ctx.fillStyle = 'black';
			ctx.fillText('售', scaleX(1468), scaleY(210));

			// 中文站名
			ctx.font = `${fontSize(5.5, true)}`;
			ctx.fillText('站', scaleX(538), scaleY(321));
			ctx.fillText('站', scaleX(1407), scaleY(321));

			ctx.font = `${fontSize(8.5)}`;
			ctx.fillText(station1, scaleX(197), scaleY(335), scaleX(322));
			ctx.fillText(station2, scaleX(1054), scaleY(335), scaleX(322));

			// 英文站名
			ctx.font = fontSize(4.5, true);
			ctx.fillText(station1en, scaleX(183), scaleY(397), scaleX(772));
			ctx.fillText(station2en, scaleX(1072), scaleY(397), scaleX(772));

			// 车次
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = scaleY(6);
			ctx.moveTo(scaleX(716), scaleY(350));
			ctx.lineTo(scaleX(1006), scaleY(350));
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = scaleY(1);
			ctx.moveTo(scaleX(1006), scaleY(350));
			ctx.lineTo(scaleX(983), scaleY(350));
			ctx.lineTo(scaleX(964), scaleY(337));
			ctx.lineTo(scaleX(961), scaleY(333));
			ctx.lineTo(scaleX(979), scaleY(337));
			ctx.fill();
			ctx.closePath();

			ctx.font = `${fontSize(8, true)}`;
			ctx.fillText(routeIdentifier, scaleX(720), scaleY(332), scaleX(281));

			// 日期时间
			ctx.font = fontSize(4, true);
			ctx.fillText(`年          月         日                  开`, scaleX(310), scaleY(474));
			ctx.font = fontSize(6);
			ctx.fillText(`${date.getFullYear()}     ${(date.getMonth() + 1).toString().padStart(2, '0')}     ${date.getDate().toString().padStart(2, '0')}      ${time}`, scaleX(148), scaleY(482));
			if (!noCarriage) {
				ctx.font = fontSize(4, true);
				ctx.fillText(`车`, scaleX(1171), scaleY(484));
				ctx.font = fontSize(6);
				ctx.fillText(`${carriage}`, scaleX(1096), scaleY(489));
			}
			if (noSeat) {
				ctx.font = fontSize(6, true);
				ctx.fillText(`无座`, scaleX(1250), scaleY(484));
			} else {
				ctx.font = fontSize(4, true);

				ctx.fillText(`号`, scaleX(1345), scaleY(484));
				ctx.font = fontSize(6);
				ctx.fillText(`${seat1}`, scaleX(1231), scaleY(489));
				ctx.font = fontSize(6, true);
				ctx.fillText(`${seat3}`, scaleX(1397), scaleY(489));
				ctx.font = fontSize(5, true);
				ctx.fillText(`${seat2}`, scaleX(1308), scaleY(481));
			}

			// 价格
			ctx.font = fontSize(4, true);
			ctx.fillText(`元`, scaleX(380), scaleY(561));
			ctx.font = fontSize(6);
			ctx.fillText(`￥${price}`, scaleX(163), scaleY(568), scaleX(216));

			// 购票方式
			purchaseMethod.forEach((purchaseMethodItem, index) => {
				if (purchaseMethodItem.length === 1) {
					if (doPurchaseMethodHaveCircle) {
						ctx.beginPath();
						ctx.arc(scaleX(700 + index * wordWidth * 35), scaleY(550), scaleY(36), 0, 2 * Math.PI);
						ctx.strokeStyle = 'black';
						ctx.lineWidth = scaleX(3);
						ctx.stroke();
						ctx.closePath();

						ctx.font = `${fontSize(5.6, true)}`;
						ctx.fillStyle = 'black';
						ctx.fillText(purchaseMethodItem, scaleX(667 + index * wordWidth * 35), scaleY(574));
					} else {
						ctx.font = `${fontSize(6, true)}`;
						ctx.fillStyle = 'black';
						ctx.fillText(purchaseMethodItem, scaleX(667 + index * wordWidth * 25), scaleY(581));
					}
				} else {
					ctx.font = `${fontSize(6, true)}`;
					ctx.fillStyle = 'black';
					ctx.fillText(purchaseMethodItem, scaleX(667 + index * wordWidth * 35), scaleY(581));
				}
			});

			// 车厢
			ctx.font = fontSize(6, true);
			ctx.fillText(`${seatClass}`, scaleX(1223), scaleY(579), scaleX(318));

			// 经由
			ctx.font = fontSize(6, true);
			ctx.fillText(`限乘当日当次车`, scaleX(140), scaleY(730));

			// 身份证+姓名
			ctx.font = fontSize(6);
			ctx.fillText(idNumber, scaleX(133), scaleY(824));
			ctx.font = fontSize(6, true);
			ctx.fillText(passenger, scaleX(839), scaleY(824));

			// 说明
			ctx.strokeStyle = 'black';
			ctx.lineWidth = scaleX(4);
			ctx.setLineDash([scaleX(23), scaleX(10)]);
			ctx.strokeRect(scaleX(208), scaleY(850), scaleX(959), scaleY(150));
			ctx.setLineDash([]);

			ctx.font = fontSize(4.5, true);
			ctx.fillText('      买票请到12306 发货请到95306', scaleX(265), scaleY(908));
			ctx.fillText('            中国铁路祝您旅途愉快', scaleX(265), scaleY(979));

			//QR
			setQrCodeText(`${station1}-${station2} No.${ticketNo} ${date.toISOString().slice(0, 10)} ${time} ${seatClass}车 ${carriage}${seat1}${seat2}号${seat3} ￥${price}元`);
			drawQRCode(ctx, scaleX(1223), scaleY(730), scaleX(380), qrCodeText);

			// code
			ctx.font = fontSize(5.5, true);
			ctx.fillText(serialCode, scaleX(133), scaleY(1080));
		};
	};

	useEffect(() => {
		drawTicket();
	}, [
		background,
		ticketNo,
		station1,
		station2,
		station1en,
		station2en,
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
				fontSize: (size: number, isSerif?: boolean) => string,
				wordWidth: number
			): void {
				canvasRef.current = canvas;
				ctxRef.current = ctx;
				scaleXRef.current = scaleX;
				scaleYRef.current = scaleY;
				fontSizeRef.current = fontSize;
				wordWidthRef.current = wordWidth;
				drawTicket();
			}}
			canvasWidth={canvasWidth}
			canvasHeight={canvasHeight}
			canvasBorderRadius={background === CRTicketBackGround.MagBlue || background === CRTicketBackGround.MagRed ? 16 : 0}
			canvasShowShandow={background === CRTicketBackGround.SoftRed || background === CRTicketBackGround.SoftBlue}
			scaleXWidth={1698}
			scaleYWidth={1162}
			saveFilename={`ticket_${station1}-${station2}`}
			form={
				<div className="flex flex-col gap-4 m-4">
					<TabBox title="票面" className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							车票用纸
							<CRWideTicketBgSelector value={background} onChange={setBackground} />
						</label>
					</TabBox>
					<TabBox title="车站信息" className="flex flex-wrap gap-1">
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								出发
								<input value={station1} onChange={(e) => setStation1(e.target.value)} />
							</label>
							<label className="ticket-form-label">
								出发英文
								<input value={station1en} onChange={(e) => setStation1en(e.target.value)} />
							</label>
						</div>
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								到达
								<input value={station2} onChange={(e) => setStation2(e.target.value)} />
							</label>
							<label className="ticket-form-label">
								到达英文
								<input value={station2en} onChange={(e) => setStation2en(e.target.value)} />
							</label>
						</div>
						<div className="flex flex-wrap">
							<label>
								<Toggle
									value={showZhan}
									onChange={(value) => {
										setShowZhan(value);
									}}
								/>
								<span>显示「站」</span>
							</label>
							<label>
								<Toggle
									value={showZhan}
									onChange={(value) => {
										setShowZhan(value);
									}}
								/>
								<span>显示英文</span>
							</label>
							<label>
								<Toggle
									value={false}
									onChange={(value) => {
										setShowZhan(value);
									}}
								/>
								<span>
									使用<span className={HuawenXinwei.className}>华文新魏</span>
								</span>
							</label>
						</div>
					</TabBox>

					<TabBox title="运行信息" className="flex flex-wrap">
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
							<input value={seat2} onChange={(e) => setSeat2(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							铺位
							<div className="flex gap-3 flex-wrap">
								<InputRadioGroup
									name="seat3"
									list={['上铺', '中铺', '下铺']}
									value={seat3}
									onChange={(value: string) => {
										setSeat3(value);
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							座席
							<input value={seatClass} onChange={(e) => setSeatClass(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							价格
							<input value={price} onChange={(e) => setPrice(e.target.value)} />
						</label>
					</TabBox>

					<TabBox title="右上角" className="flex flex-wrap"></TabBox>

					<TabBox title="购票信息" className="flex flex-wrap">
						<label className="ticket-form-label">
							购票处
							<input className="" value={soldplace} onChange={(e) => setSoldPlace(e.target.value)} />
						</label>

						<label className="ticket-form-label">
							乘车人证件号
							<input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							乘车人
							<input value={passenger} onChange={(e) => setPassenger(e.target.value)} />
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
								<label className="flex items-center flex-wrap">
									<input type="radio" name="info1" onChange={() => {}} />
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
								</label>
								<InputRadioGroup
									name="info1"
									list={info1List}
									value={info1}
									onChange={(value: string) => {
										setInfo1(value);
									}}
								/>
							</div>
						</label>
						<Divider />
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
						<Divider />
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
							虚线内消息提示
							<textarea value={message} onChange={(e) => setMessage(e.target.value)} />
						</label>
					</TabBox>
				</div>
			}
		/>
	);
}
