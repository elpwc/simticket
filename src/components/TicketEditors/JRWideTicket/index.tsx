'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { decodeTicket, fontsLoader } from '@/utils/utils';
import Toggle from '../../InfrastructureCompo/Toggle';
import TabBox from '../../InfrastructureCompo/TabBox';
import { Divider } from '../../InfrastructureCompo/Divider';
import localFonts from 'next/font/local';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { JRWideTicketBgSelector } from './JRWideTicketBgSelector';
import { UnderConstruction } from '@/components/TicketEditorCompo/UnderConstruction';
import { JR_TICKET_TYPE, JRWideTicketDrawParametersInitialValues, JR_MARS_PAPER_TICKET_CANVAS_SIZE, JR_MARS_PAPER_TICKET_SIZE } from './value';
import { JRWideTicketDrawParameters } from './type';
import { AppContext } from '@/app/app';
import { drawJRWideTicket } from './draw';
import { useSearchParams } from 'next/navigation';

export const DotFont = localFonts({
	//src: '../../assets/fonts/simsun.woff2',
	src: '../../../assets/fonts/JF-Dot-Izumi16.woff2',
	//src: '../../../assets/fonts/JF-Dot-Ayu20.woff2',
});

export default function JRWideTicket() {
	const searchParams = useSearchParams();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontRef = useRef<(size: number, fontName: string) => string>(null);

	const [size, setSize] = useState(JR_MARS_PAPER_TICKET_SIZE);
	const [canvasSize, setCanvasSize] = useState(JR_MARS_PAPER_TICKET_CANVAS_SIZE);
	const [currentScale, setCurrentScale] = useState(1);

	const [isFontLoading, setIsFontLoading] = useState(false);

	const { editingTicketData, setEditingTicketData } = useContext(AppContext);

	const getInitialValues = () => {
		const comParam = searchParams.get('com');
		const ticketParam = searchParams.get('ticket');
		let companyId = 0,
			ticketTypeId = 0;
		if (comParam !== null && !isNaN(Number(comParam))) {
			companyId = Number(comParam);
		}
		if (ticketParam !== null && !isNaN(Number(ticketParam))) {
			ticketTypeId = Number(ticketParam);
		}
		const ticketDataStr = searchParams.get('data');
		if (ticketDataStr !== null && ticketDataStr !== '' && companyId === 1 && ticketTypeId === 1) {
			const comParam = searchParams.get('com');
			const ticketParam = searchParams.get('ticket');
			let companyId = 0,
				ticketTypeId = 4;
			if (comParam !== null && !isNaN(Number(comParam))) {
				companyId = Number(comParam);
			}
			if (ticketParam !== null && !isNaN(Number(ticketParam))) {
				ticketTypeId = Number(ticketParam);
			}
			return decodeTicket(companyId, ticketTypeId, ticketDataStr);
		} else {
			return JRWideTicketDrawParametersInitialValues;
		}
	};
	const [drawParameters, setDrawParameters] = useState<JRWideTicketDrawParameters>(getInitialValues());

	useEffect(() => {
		fontsLoader(
			[{ name: 'DotFont', file: '../../../assets/fonts/JF-Dot-Izumi16.woff2' }],
			() => {
				setIsFontLoading(true);
			},
			() => {
				setIsFontLoading(false);
			},
			() => {
				setIsFontLoading(false);
			}
		);
	}, []);

	const drawTicket = () => {
		drawJRWideTicket(canvasRef.current, ctxRef.current, drawParameters);
	};

	useEffect(() => {
		setCanvasSize(JR_MARS_PAPER_TICKET_CANVAS_SIZE);
	}, [drawParameters.background]);

	useEffect(() => {
		drawTicket();
	}, [drawTicket, size, canvasSize, drawParameters, isFontLoading]);

	// 下のリスト更新用
	useEffect(() => {
		setEditingTicketData(drawParameters);
	}, [drawParameters]);

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
			ticketData={drawParameters}
			saveFilename={`ticket_${drawParameters.station1}-${drawParameters.station2}`}
			onScaleChange={setCurrentScale}
			isFontLoading={isFontLoading}
			form={
				<div className="flex flex-col gap-4 m-4">
					<UnderConstruction size="small" />
					<TabBox title="券面" className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							券面
							<JRWideTicketBgSelector value={drawParameters.background} onChange={(e) => setDrawParameters((prev) => ({ ...prev, background: e }))} />
						</label>
						<label className="ticket-form-label">
							印刷ズレ
							<div className="flex grid-cols-3 gap-2">
								<label className="flex gap-1 items-center">
									X
									<input
										className="max-w-[50px]"
										type="number"
										value={drawParameters.offsetX}
										onChange={(e) => setDrawParameters((prev) => ({ ...prev, offsetX: Number(e.target.value) }))}
									/>
								</label>
								<label className="flex gap-1 items-center">
									Y
									<input
										className="max-w-[50px]"
										type="number"
										value={0 - drawParameters.offsetY}
										onChange={(e) => setDrawParameters((prev) => ({ ...prev, offsetY: 0 - Number(e.target.value) }))}
									/>
								</label>
								<button
									className="w-[max-content] text-[12px]"
									onClick={() => {
										setDrawParameters((prev) => ({ ...prev, offsetX: 0, offsetY: 0 }));
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
									value={drawParameters.showWatermark}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, showWatermark: value }));
									}}
								/>
							</div>
							<input className="" style={{ color: '#AF0508' }} value={drawParameters.watermark} onChange={(e) => setDrawParameters((prev) => ({ ...prev, watermark: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							乗車券種類
							<PrettyInputRadioGroup
								list={JR_TICKET_TYPE.map((jrTicketTypeItem) => {
									return { value: jrTicketTypeItem.name, title: jrTicketTypeItem.name };
								})}
								value={drawParameters.ticketType}
								onChange={(value: string) => {
									setDrawParameters((prev) => ({ ...prev, ticketType: value }));
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
									value={drawParameters.station1}
									onChange={(e) => {
										setDrawParameters((prev) => ({ ...prev, station1: e.target.value }));
									}}
								/>
							</label>
							<label className="ticket-form-label">
								出発外国語
								<input value={drawParameters.station1en} onChange={(e) => setDrawParameters((prev) => ({ ...prev, station1en: e.target.value }))} />
							</label>
						</div>
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								到着
								<input
									value={drawParameters.station2}
									onChange={(e) => {
										setDrawParameters((prev) => ({ ...prev, station2: e.target.value }));
									}}
								/>
							</label>
							<label className="ticket-form-label">
								到着外国語
								<input value={drawParameters.station2en} onChange={(e) => setDrawParameters((prev) => ({ ...prev, station2en: e.target.value }))} />
							</label>
						</div>
						<div className="flex flex-wrap gap-2">
							<label>
								<Toggle
									value={drawParameters.doShowEnglish}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doShowEnglish: value }));
									}}
								/>
								<span>外国語を表示</span>
							</label>
						</div>
					</TabBox>

					<TabBox title="運行情報" className="flex flex-wrap gap-2">
						<label className="ticket-form-label">
							発車日付
							<input type="date" value={drawParameters.date.toISOString().slice(0, 10)} onChange={(e) => setDrawParameters((prev) => ({ ...prev, date: new Date(e.target.value) }))} />
						</label>
						<label className="ticket-form-label">
							発車時間
							<input type="time" value={drawParameters.time} onChange={(e) => setDrawParameters((prev) => ({ ...prev, time: e.target.value }))} />
						</label>
						<Divider />
						<label className="ticket-form-label">
							<div className="flex gap-2">
								車両番号
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={drawParameters.noCarriage}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, noCarriage: e.target.checked }));
										}}
									/>
									<span>無指定車両番号</span>
								</label>
							</div>
							<input value={drawParameters.carriage} onChange={(e) => setDrawParameters((prev) => ({ ...prev, carriage: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							<div className="flex gap-2">
								座席番号
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={drawParameters.noSeat}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, noSeat: e.target.checked }));
										}}
									/>
									<span>無座席指定</span>
								</label>
							</div>
							<input value={drawParameters.seat1} onChange={(e) => setDrawParameters((prev) => ({ ...prev, seat1: e.target.value }))} />
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
								value={drawParameters.seat2}
								onChange={(value: string) => {
									setDrawParameters((prev) => ({ ...prev, seat2: value }));
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
									value={drawParameters.seat3}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, seat3: value }));
									}}
								/>
							</div>
						</label>
					</TabBox>

					<TabBox title="購入情報" className="flex flex-wrap">
						<label className="ticket-form-label">
							値段 ￥
							<input value={drawParameters.price} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							購入場所
							<input className="" value={drawParameters.soldplace} onChange={(e) => setDrawParameters((prev) => ({ ...prev, soldplace: e.target.value }))} />
						</label>

						<Divider />
					</TabBox>
					<TabBox title="番号" className="flex flex-wrap">
						<label className="ticket-form-label">
							発券番号
							<input className="text-red-500" value={drawParameters.ticketNo} onChange={(e) => setDrawParameters((prev) => ({ ...prev, ticketNo: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							番号
							<input value={drawParameters.serialCode} onChange={(e) => setDrawParameters((prev) => ({ ...prev, serialCode: e.target.value }))} />
						</label>
					</TabBox>
				</div>
			}
		/>
	);
}
