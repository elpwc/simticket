'use client';

import { useEffect, useRef, useState } from 'react';
import jr_h from '../../../assets/tickets/jr_h.jpg';
import jr_e from '../../../assets/tickets/jr_e.jpg';
import jr_c from '../../../assets/tickets/jr_c.jpg';
import jr_w from '../../../assets/tickets/jr_w.jpg';
import jr_s from '../../../assets/tickets/jr_s.jpg';
import jr_k from '../../../assets/tickets/jr_k.jpg';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { drawCarbonText, drawQRCode, drawText, DrawTextMethod, drawTextNew, TextAlign } from '@/utils/utils';
import Toggle from '../../InfrastructureCompo/Toggle';
import TabBox from '../../InfrastructureCompo/TabBox';
import InputRadioGroup from '../../InfrastructureCompo/InputRadioGroup';
import { Divider } from '../../InfrastructureCompo/Divider';
import localFonts from 'next/font/local';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { pinyin } from 'pinyin-pro';
import { DescriptionButton } from '@/components/InfrastructureCompo/DescriptionButton';
import { JRTicketBackGround, JRWideTicketBgSelector } from './JRWideTicketBgSelector';
import { UnderConstruction } from '@/components/TicketEditorCompo/UnderConstruction';

export const DotFont = localFonts({
	//src: '../../assets/fonts/simsun.woff2',
	src: '../../../assets/fonts/JF-Dot-Izumi16.woff2',
	//src: '../../../assets/fonts/JF-Dot-Ayu20.woff2',
});

const PAPER_TICKET_SIZE = [1477, 1000];
const PAPER_TICKET_CANVAS_SIZE = [310, 210];

const JR_TICKET_TYPE = [
	{ name: '乗車券', title: '' },
	{ name: '乗車券（ゆき）', title: '' },
	{ name: '乗車券（かえり）', title: '' },
	{ name: '乗車券（連続１）', title: '' },
	{ name: '乗車券（連続２）', title: '' },
	{ name: 'グリーン券', title: '' },
	{ name: '特急券', title: '' },
	{ name: '指定席券', title: '' },
	{ name: '特急券・グリーン券', title: '' },
	{ name: '乗車券・特急券', title: '' },
	{ name: 'B自由席特急券', title: '' },
	{ name: '指定券', title: '' },
	{ name: '新幹線指定券', title: '' },
	{ name: '新幹線自由席特急券', title: '' },
	{ name: '新幹線自由席特急券／特定特急券', title: '' },
	{ name: '乗車券・新幹線自由席特急券／特定特急券', title: '' },
	{ name: '乗車券・新幹線特急券', title: '' },
	{ name: '乗車券・新幹線特定特急券', title: '' },
];

enum JRPaymentMethod {
	Cash,
	ICCard,
	CreditCard,
}

const JRPAYMENT_METHOD_LIST = [
	{
		value: JRPaymentMethod.Cash,
		title: '現金',
	},
	{
		value: JRPaymentMethod.ICCard,
		title: 'ＩＣカード',
	},
	{
		value: JRPaymentMethod.CreditCard,
		title: 'クレジットカード',
	},
];

export default function JRWideTicket() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontRef = useRef<(size: number, fontName: string) => string>(null);

	const [size, setSize] = useState(PAPER_TICKET_SIZE);
	const [canvasSize, setCanvasSize] = useState(PAPER_TICKET_CANVAS_SIZE);
	const [currentScale, setCurrentScale] = useState(1);

	const [isFontLoading, setIsFontLoading] = useState(false);

	const [background, setBackground] = useState<JRTicketBackGround>(JRTicketBackGround.JR_E);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [showWatermark, setShowWatermark] = useState(true);
	const [watermark, setWatermark] = useState('見本');

	const [ticketType, setTicketType] = useState('乗車券');
	const [ticketNo, setTicketNo] = useState('A000001');
	const [station1, setStation1] = useState('小田原');
	const [station2, setStation2] = useState('沼津');
	const [station1en, setStation1en] = useState('Odawara');
	const [station2en, setStation2en] = useState('Numazu');
	const [doShowEnglish, setDoShowEnglish] = useState(false);
	const [railways, setRailways] = useState(['東海道', '御殿場']);
	const [paymentMethod, setPaymentMethod] = useState(JRPaymentMethod.CreditCard);
	const [date, setDate] = useState(new Date());
	const [time, setTime] = useState('11:55');
	const [carriage, setCarriage] = useState('04');
	const [seat1, setSeat1] = useState('12');
	const [seat2, setSeat2] = useState('F');
	const [seat3, setSeat3] = useState('上段');
	const [seatClass, setSeatClass] = useState('新空调硬卧');
	const [price, setPrice] = useState('1,540');
	const [soldplace, setSoldPlace] = useState('稚内');
	const [serialCode, setSerialCode] = useState('1145141919810A000001 JM');
	const [noSeat, setNoSeat] = useState(false);
	const [noCarriage, setNoCarriage] = useState(false);
	const [info1, setInfo1] = useState('乘车纪念');

	useEffect(() => {
		const loadFonts = async () => {
			const fonts = [new FontFace('DotFont', 'url(../../../assets/fonts/JF-Dot-Izumi16.woff2.woff2)')];
			await Promise.all(fonts.map((f) => f.load()));
			fonts.forEach((f) => document.fonts.add(f));
			setIsFontLoading(true);
			loadFonts().finally(() => setIsFontLoading(false));
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

		const resizedScaleX = (value: number) => {
			return scaleX(value);
		};
		const resizedScaleY = (value: number) => {
			return scaleY(value);
		};
		const offsetScaleX = (value: number, addOffsetValue: boolean = true) => {
			return scaleX(value) + (addOffsetValue ? offsetX : 0);
		};
		const offsetScaleY = (value: number, addOffsetValue: boolean = true) => {
			return scaleY(value) + (addOffsetValue ? offsetY : 0);
		};
		const resizedFont = (size: number, fontName: string, isBold?: boolean) => {
			return font(size, fontName, isBold);
		};

		const bg = new Image();
		switch (background) {
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

		const draw = () => {
			// 清空
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// 底图
			switch (background) {
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
			if (showWatermark) {
				ctx.fillStyle = '#AF0508';
				ctx.font = `${resizedFont(10, 'DotFont')}`;
				drawText(ctx, watermark, offsetScaleX(116, false), offsetScaleY(921, false), resizedScaleX(300), TextAlign.JustifyAround);

				ctx.strokeStyle = '#AF0508';
				ctx.lineWidth = resizedScaleX(8);
				ctx.strokeRect(offsetScaleX(107, false), offsetScaleY(813, false), resizedScaleX(323), resizedScaleY(125));
				ctx.setLineDash([]);
			}

			// payment method
			ctx.fillStyle = 'black';
			ctx.font = `${resizedFont(9, 'DotFont')}`;
			if (paymentMethod !== JRPaymentMethod.Cash) {
				let paymentText = '';
				switch (paymentMethod) {
					case JRPaymentMethod.ICCard:
						paymentText = 'IC';
						break;
					case JRPaymentMethod.CreditCard:
						paymentText = 'C制';
						break;
				}
				drawText(ctx, paymentText, offsetScaleX(120), offsetScaleY(220), resizedScaleX(183), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 1);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = resizedScaleX(5);
				ctx.strokeRect(offsetScaleX(120), offsetScaleY(139), resizedScaleX(183), resizedScaleY(91));
				ctx.setLineDash([]);
			}

			// ticket type
			ctx.fillStyle = 'black';
			ctx.font = `${resizedFont(8, 'DotFont')}`;
			drawText(ctx, ticketType, offsetScaleX(313), offsetScaleY(163), resizedScaleX(400), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 0.6);

			// 站名
			ctx.fillStyle = 'black';
			ctx.font = `${resizedFont(11.5, 'DotFont')}`;
			drawText(ctx, station1, offsetScaleX(113), offsetScaleY(doShowEnglish ? 335 : 387), resizedScaleX(554), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 0.7);
			ctx.font = `${resizedFont(11.5, 'DotFont')}`;
			drawText(ctx, station2, offsetScaleX(838), offsetScaleY(doShowEnglish ? 335 : 387), resizedScaleX(554), TextAlign.JustifyAround, DrawTextMethod.fillText, 0, 0, 0.7);

			// 英文站名
			if (doShowEnglish) {
				ctx.font = resizedFont(4.5, 'DotFont');
				drawText(ctx, station1en, offsetScaleX(183), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
				drawText(ctx, station2en, offsetScaleX(1072), offsetScaleY(397), resizedScaleX(452), TextAlign.Center);
			}

			// 箭头
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = resizedScaleY(16);
			ctx.moveTo(offsetScaleX(712), offsetScaleY(337));
			ctx.lineTo(offsetScaleX(751), offsetScaleY(337));
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = resizedScaleY(1);
			ctx.moveTo(offsetScaleX(743), offsetScaleY(360));
			ctx.lineTo(offsetScaleX(766), offsetScaleY(337));
			ctx.lineTo(offsetScaleX(743), offsetScaleY(317));
			ctx.fill();
			ctx.closePath();

			// 経由
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, '経由:' + railways.join('・'), offsetScaleX(113), offsetScaleY(458), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

			// 日期时间
			ctx.font = resizedFont(5.5, 'DotFont');
			drawText(ctx, `月   日${'当日限り有効'}`, offsetScaleX(212), offsetScaleY(534), resizedScaleX(1244), TextAlign.Left, DrawTextMethod.fillText, 2, 0, 0.7);

			ctx.font = resizedFont(7, 'DotFont');
			drawText(
				ctx,
				`${(date.getMonth() + 1).toString().padStart(2, ' ')} ${date.getDate().toString().padStart(2, ' ')}`,
				offsetScaleX(113),
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
			ctx.fillText(`￥`, offsetScaleX(1093), offsetScaleY(534), resizedScaleX(100));
			ctx.font = resizedFont(7, 'DotFont');
			drawText(ctx, `${price}`, offsetScaleX(1133), offsetScaleY(534), resizedScaleX(300), TextAlign.Left, DrawTextMethod.fillText, 0, 0, 1.25);
		};

		switch (background) {
			case JRTicketBackGround.JR_H:
			case JRTicketBackGround.JR_E:
			case JRTicketBackGround.JR_C:
			case JRTicketBackGround.JR_W:
			case JRTicketBackGround.JR_S:
			case JRTicketBackGround.JR_K:
				// 有背景的
				bg.onload = () => {
					draw();
				};
				break;
			case JRTicketBackGround.JR_Empty:
				draw();
				break;
		}
	};

	useEffect(() => {
		setCanvasSize(PAPER_TICKET_CANVAS_SIZE);
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
		doShowEnglish,
		date,
		time,
		carriage,
		seat1,
		seat2,
		seat3,
		seatClass,
		price,
		soldplace,
		serialCode,
		noSeat,
		noCarriage,
		info1,
	]);

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
			canvasBorderRadius={0}
			canvasShowShandow={true}
			scaleXWidth={size[0]}
			scaleYWidth={size[1]}
			saveFilename={`ticket_${station1}-${station2}`}
			onScaleChange={setCurrentScale}
			isFontLoading={isFontLoading}
			form={
				<div className="flex flex-col gap-4 m-4">
					<UnderConstruction size="small" />
					<TabBox title="券面" className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							券面
							<JRWideTicketBgSelector value={background} onChange={setBackground} />
						</label>
						<label className="ticket-form-label">
							印刷ズレ
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
							<div>
								ウォーターマーク
								<Toggle
									value={showWatermark}
									onChange={(value) => {
										setShowWatermark(value);
									}}
								/>
							</div>
							<input className="" style={{ color: '#AF0508' }} value={watermark} onChange={(e) => setWatermark(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							乗車券種類
							<PrettyInputRadioGroup
								list={JR_TICKET_TYPE.map((jrTicketTypeItem) => {
									return { value: jrTicketTypeItem.name, title: jrTicketTypeItem.name };
								})}
								value={ticketType}
								onChange={(value: string) => {
									setTicketType(value);
								}}
							/>
						</label>
						<label className="ticket-form-label">
							&nbsp;
							<div>
								<Toggle value={true} onChange={(value) => {}} />
								英文付き券面
							</div>
						</label>
					</TabBox>
					<TabBox title="駅情報" className="flex flex-wrap gap-1">
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								出発
								<input
									value={station1}
									onChange={(e) => {
										setStation1(e.target.value);
									}}
								/>
							</label>
							<label className="ticket-form-label">
								出発外国語
								<input value={station1en} onChange={(e) => setStation1en(e.target.value)} />
							</label>
						</div>
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								到着
								<input
									value={station2}
									onChange={(e) => {
										setStation2(e.target.value);
									}}
								/>
							</label>
							<label className="ticket-form-label">
								到着外国語
								<input value={station2en} onChange={(e) => setStation2en(e.target.value)} />
							</label>
						</div>
						<div className="flex flex-wrap gap-2">
							<label>
								<Toggle
									value={doShowEnglish}
									onChange={(value) => {
										setDoShowEnglish(value);
									}}
								/>
								<span>外国語を表示</span>
							</label>
						</div>
					</TabBox>

					<TabBox title="運行情報" className="flex flex-wrap gap-2">
						<label className="ticket-form-label">
							発車日付
							<input type="date" value={date.toISOString().slice(0, 10)} onChange={(e) => setDate(new Date(e.target.value))} />
						</label>
						<label className="ticket-form-label">
							発車時間
							<input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
						</label>
						<Divider />
						<label className="ticket-form-label">
							<div className="flex gap-2">
								車両番号
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={noCarriage}
										onChange={(e) => {
											setNoCarriage(e.target.checked);
										}}
									/>
									<span>無指定車両番号</span>
								</label>
							</div>
							<input value={carriage} onChange={(e) => setCarriage(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							<div className="flex gap-2">
								座席番号
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={noSeat}
										onChange={(e) => {
											setNoSeat(e.target.checked);
										}}
									/>
									<span>無座席指定</span>
								</label>
							</div>
							<input value={seat1} onChange={(e) => setSeat1(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							座席
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
							寝台席位置
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: 'up', title: '上段' },
										{ value: 'center', title: '中段' },
										{ value: 'down', title: '下段' },
										{ value: 'room', title: '個室' },
									]}
									value={seat3}
									onChange={(value: string) => {
										setSeat3(value);
									}}
								/>
							</div>
						</label>
					</TabBox>

					<TabBox title="購入情報" className="flex flex-wrap">
						<label className="ticket-form-label">
							値段 ￥
							<input value={price} onChange={(e) => setPrice(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							購入場所
							<input className="" value={soldplace} onChange={(e) => setSoldPlace(e.target.value)} />
						</label>

						<Divider />
					</TabBox>
					<TabBox title="番号" className="flex flex-wrap">
						<label className="ticket-form-label">
							発券番号
							<input className="text-red-500" value={ticketNo} onChange={(e) => setTicketNo(e.target.value)} />
						</label>
						<label className="ticket-form-label">
							番号
							<input value={serialCode} onChange={(e) => setSerialCode(e.target.value)} />
						</label>
					</TabBox>
				</div>
			}
		/>
	);
}
