'use client';

import { useEffect, useRef, useState } from 'react';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { fontsLoader, TextAlign } from '@/utils/utils';
import Toggle from '../../InfrastructureCompo/Toggle';
import TabBox from '../../InfrastructureCompo/TabBox';
import InputRadioGroup from '../../InfrastructureCompo/InputRadioGroup';
import { Divider } from '../../InfrastructureCompo/Divider';
import localFonts from 'next/font/local';
import { CRWideTicketBgSelector } from './CRWideTicketBgSelector';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { pinyin } from 'pinyin-pro';
import { DescriptionButton } from '@/components/InfrastructureCompo/DescriptionButton';
import {
	CR_TRAIN_TYPE_ARRAY,
	CR_TRAIN_TYPES,
	CRWideTicketDrawParametersInitialValues,
	info1List,
	info2List,
	info3List,
	MAG_TICKET_CANVAS_SIZE,
	messageList,
	PAPER_TICKET_CANVAS_SIZE,
	PAPER_TICKET_SIZE,
	purchaseMethodList,
	seatType,
	sleepingCarSeatType,
} from './value';
import { CRTicketBackGround, CRWideTicketDrawParameters, PurchaseMethod, RightUpContentType } from './type';
import { drawCRWideTicket } from './draw';

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

export default function CRWideTicket() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontRef = useRef<(size: number, fontName: string) => string>(null);

	const [size, setSize] = useState(PAPER_TICKET_SIZE);
	const [canvasSize, setCanvasSize] = useState(PAPER_TICKET_CANVAS_SIZE);

	const [isFontLoading, setIsFontLoading] = useState(false);

	const [drawParameters, setDrawParameters] = useState<CRWideTicketDrawParameters>(CRWideTicketDrawParametersInitialValues);

	useEffect(() => {
		fontsLoader(
			[
				{ name: 'HuawenXinwei', file: '../../../assets/fonts/STXINWEI.woff2' },
				{ name: 'SongTi', file: '../../../assets/fonts/simsun.woff2' },
				{ name: 'HeiTi', file: '../../../assets/fonts/simhei.woff2' },
			],
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
		drawCRWideTicket(canvasRef.current, ctxRef.current, drawParameters);
	};

	useEffect(() => {
		switch (drawParameters.background) {
			case CRTicketBackGround.MagRed:
			case CRTicketBackGround.MagBlue:
			case CRTicketBackGround.MagNoneBackground:
				setCanvasSize(MAG_TICKET_CANVAS_SIZE);
				break;
			case CRTicketBackGround.SoftRed:
			case CRTicketBackGround.SoftBlue:
			case CRTicketBackGround.SoftNoneBackground:
				setCanvasSize(PAPER_TICKET_CANVAS_SIZE);
				break;
		}
	}, [drawParameters.background]);

	useEffect(() => {
		drawTicket();
	}, [drawTicket, size, canvasSize, drawParameters]);

	useEffect(() => {
		setDrawParameters((prev) => ({
			...prev,
			qrCodeText: `${drawParameters.station1}-${drawParameters.station2} No.${drawParameters.ticketNo} ${drawParameters.date.toISOString().slice(0, 10)} ${drawParameters.time} ${
				drawParameters.seatClass
			}车 ${drawParameters.carriage}${drawParameters.seat1}${drawParameters.seat2}号${drawParameters.seat3} ￥${drawParameters.price}元`,
		}));
	}, [
		drawParameters.ticketNo,
		drawParameters.station1,
		drawParameters.station2,
		drawParameters.date,
		drawParameters.time,
		drawParameters.carriage,
		drawParameters.seat1,
		drawParameters.seat2,
		drawParameters.seat3,
		drawParameters.seatClass,
		drawParameters.price,
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
			canvasBorderRadius={drawParameters.background === CRTicketBackGround.MagBlue || drawParameters.background === CRTicketBackGround.MagRed ? 16 : 0}
			canvasShowShandow={drawParameters.background !== CRTicketBackGround.MagBlue && drawParameters.background !== CRTicketBackGround.MagRed}
			scaleXWidth={size[0]}
			scaleYWidth={size[1]}
			saveFilename={`ticket_${drawParameters.station1}-${drawParameters.station2}`}
			isFontLoading={isFontLoading}
			form={
				<div className="flex flex-col gap-4 m-4">
					<TabBox title="票面" className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							车票用纸
							<CRWideTicketBgSelector value={drawParameters.background} onChange={(value: CRTicketBackGround) => setDrawParameters((prev) => ({ ...prev, background: value }))} />
						</label>
						<label className="ticket-form-label">
							印刷偏移
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
								水印
								<Toggle
									value={drawParameters.showWatermark}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, showWatermark: value }));
									}}
								/>
							</div>
							<input className="text-red-400" value={drawParameters.watermark} onChange={(e) => setDrawParameters((prev) => ({ ...prev, watermark: e.target.value }))} />
						</label>
						<div className="ticket-form-label">
							&nbsp;
							<div className="flex flex-col">
								<label className="flex">
									<div>
										<Toggle
											value={drawParameters.isHKWestKowloonStyle}
											onChange={(value) => {
												if (value) {
													setDrawParameters((prev) => ({ ...prev, seatClass: '一等/First Class' }));
													setDrawParameters((prev) => ({ ...prev, doShowMessage: false }));
													setDrawParameters((prev) => ({ ...prev, showSoldPlaceDown: true }));
												} else {
													setDrawParameters((prev) => ({ ...prev, seatClass: '一等座' }));
													setDrawParameters((prev) => ({ ...prev, doShowMessage: true }));
												}
												setDrawParameters((prev) => ({ ...prev, isHKWestKowloonStyle: value }));
											}}
										/>
										使用香港西九龍站發售樣式
									</div>
								</label>
								<label className="flex">
									<div>
										<Toggle
											value={drawParameters.showBorder}
											onChange={(value) => {
												setDrawParameters((prev) => ({ ...prev, showBorder: value }));
											}}
										/>
										为软纸票和无背景显示边框
									</div>
								</label>
							</div>
						</div>
					</TabBox>
					<TabBox title="车站信息" className="flex flex-wrap gap-1">
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								出发
								<input
									value={drawParameters.station1}
									onChange={(e) => {
										let stationEnglish = pinyin(e.target.value, { toneType: 'none', type: 'array' }).join('');
										if (['香港西九龍', '香港西九龙'].includes(e.target.value)) {
											stationEnglish = 'HKWestKowloon';
										} else {
											stationEnglish = stationEnglish.substring(0, 1).toUpperCase() + stationEnglish.substring(1, stationEnglish.length);
										}
										setDrawParameters((prev) => ({ ...prev, station1en: stationEnglish }));

										setDrawParameters((prev) => ({ ...prev, station1: e.target.value }));
									}}
								/>
							</label>
							<label className="ticket-form-label">
								出发外文
								<input value={drawParameters.station1en} onChange={(e) => setDrawParameters((prev) => ({ ...prev, station1en: e.target.value }))} />
							</label>
							<label>
								<Toggle
									value={drawParameters.doUseHuaWenXinWei1}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doUseHuaWenXinWei1: value }));
									}}
								/>
								<span>
									使用<span className={HuawenXinwei.className}>魏碑体</span>
									<DescriptionButton modalTitle="魏碑体">
										<p>　曾经CR上海局发行的车票中，当里程在400km以内时，两方车站名使用魏碑体</p>
										<p>　但仍存在不少一方是黑体一方是魏碑体的车票，故在此对两车站分别设置字体而不是统一设置</p>
									</DescriptionButton>
								</span>
							</label>
						</div>
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								到达
								<input
									value={drawParameters.station2}
									onChange={(e) => {
										let stationEnglish = pinyin(e.target.value, { toneType: 'none', type: 'array' }).join('');
										if (['香港西九龍', '香港西九龙'].includes(e.target.value)) {
											stationEnglish = 'HKWestKowloon';
										} else {
											stationEnglish = stationEnglish.substring(0, 1).toUpperCase() + stationEnglish.substring(1, stationEnglish.length);
										}
										setDrawParameters((prev) => ({ ...prev, station2en: stationEnglish }));
										setDrawParameters((prev) => ({ ...prev, station2: e.target.value }));
									}}
								/>
							</label>
							<label className="ticket-form-label">
								到达外文
								<input value={drawParameters.station2en} onChange={(e) => setDrawParameters((prev) => ({ ...prev, station2en: e.target.value }))} />
							</label>
							<label>
								<Toggle
									value={drawParameters.doUseHuaWenXinWei2}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doUseHuaWenXinWei2: value }));
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
									value={drawParameters.doShowZhan}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doShowZhan: value }));
									}}
								/>
								<span>显示「站」</span>
							</label>
							<label>
								<Toggle
									value={drawParameters.doShowEnglish}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doShowEnglish: value }));
									}}
								/>
								<span>显示外文</span>
							</label>
						</div>
					</TabBox>

					<TabBox title="运行信息" className="flex flex-wrap gap-2">
						<label className="ticket-form-label">
							车次
							<div className="flex gap-4 items-center flex-wrap">
								<input value={drawParameters.routeIdentifier} onChange={(e) => setDrawParameters((prev) => ({ ...prev, routeIdentifier: e.target.value }))} />
								<label className="">
									<Toggle
										value={drawParameters.routeIdentifier.substring(0, 1) === '0' ? true : false}
										onChange={(value) => {
											if (value) {
												if (drawParameters.routeIdentifier.substring(0, 1) !== '0') {
													setDrawParameters((prev) => ({ ...prev, routeIdentifier: '0' + prev.routeIdentifier }));
												}
											} else {
												if (drawParameters.routeIdentifier.substring(0, 1) === '0') {
													setDrawParameters((prev) => ({ ...prev, routeIdentifier: prev.routeIdentifier.substring(1, prev.routeIdentifier.length) }));
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
								CR_TRAIN_TYPE_ARRAY.includes(
									drawParameters.routeIdentifier.substring(
										drawParameters.routeIdentifier.substring(0, 1) === '0' ? 1 : 0,
										drawParameters.routeIdentifier.substring(0, 1) === '0' ? 2 : 1
									)
								)
									? drawParameters.routeIdentifier.substring(
											drawParameters.routeIdentifier.substring(0, 1) === '0' ? 1 : 0,
											drawParameters.routeIdentifier.substring(0, 1) === '0' ? 2 : 1
									  )
									: ''
							}
							onChange={(value: string) => {
								const routeIdentifierFirstChar = drawParameters.routeIdentifier.substring(
									drawParameters.routeIdentifier.substring(0, 1) === '0' ? 1 : 0,
									drawParameters.routeIdentifier.substring(0, 1) === '0' ? 2 : 1
								);
								if (CR_TRAIN_TYPE_ARRAY.includes(routeIdentifierFirstChar)) {
									const routeIdentifierNumbersChar = drawParameters.routeIdentifier.substring(
										drawParameters.routeIdentifier.substring(0, 1) === '0' ? 2 : 1,
										drawParameters.routeIdentifier.length
									);
									setDrawParameters((prev) => ({ ...prev, routeIdentifier: (prev.routeIdentifier.substring(0, 1) === '0' ? '0' : '') + value + routeIdentifierNumbersChar }));
								} else {
									setDrawParameters((prev) => ({ ...prev, routeIdentifier: value + prev.routeIdentifier }));
								}

								setDrawParameters((prev) => ({ ...prev, seat3: value }));
							}}
							placeholder="普客普快(自定义)"
						/>

						<label className="ticket-form-label">
							發车日期
							<input type="date" value={drawParameters.date.toISOString().slice(0, 10)} onChange={(e) => setDrawParameters((prev) => ({ ...prev, date: new Date(e.target.value) }))} />
						</label>
						<label className="ticket-form-label">
							發车时间
							<input type="time" value={drawParameters.time} onChange={(e) => setDrawParameters((prev) => ({ ...prev, time: e.target.value }))} />
						</label>
						<Divider />
						<label className="ticket-form-label">
							<div className="flex gap-2">
								车厢
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={drawParameters.noCarriage}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, noCarriage: e.target.checked }));
										}}
									/>
									<span>无指定车厢</span>
								</label>
							</div>
							<input value={drawParameters.carriage} onChange={(e) => setDrawParameters((prev) => ({ ...prev, carriage: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							<div className="flex gap-2">
								座位号
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={drawParameters.noSeat}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, noSeat: e.target.checked }));
										}}
									/>
									<span>无座</span>
								</label>
							</div>
							<input value={drawParameters.seat1} onChange={(e) => setDrawParameters((prev) => ({ ...prev, seat1: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							座位
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
							铺位
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: '上铺', title: '上铺' },
										{ value: '中铺', title: '中铺' },
										{ value: '下铺', title: '下铺' },
									]}
									value={drawParameters.seat3}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, seat3: value }));
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
								value={drawParameters.seatClass}
								onChange={(value: string) => {
									if (sleepingCarSeatType.includes(value)) {
										setDrawParameters((prev) => ({ ...prev, seat2: '', seat3: '下铺' }));
									} else {
										setDrawParameters((prev) => ({ ...prev, seat2: 'F', seat3: '' }));
									}

									setDrawParameters((prev) => ({ ...prev, seatClass: value }));
								}}
							/>
						</label>
					</TabBox>

					<TabBox title="购票信息" className="flex flex-wrap">
						<label className="ticket-form-label">
							价格 {drawParameters.isHKWestKowloonStyle ? 'HK＄' : '￥'}
							<input value={drawParameters.price} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							购票处
							<input className="" value={drawParameters.soldplace} onChange={(e) => setDrawParameters((prev) => ({ ...prev, soldplace: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							检票
							<input className="" value={drawParameters.turnstile} onChange={(e) => setDrawParameters((prev) => ({ ...prev, turnstile: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							右上角显示
							<div className="flex items-center flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: RightUpContentType.None, title: '不显示' },
										{ value: RightUpContentType.SoldPlace, title: '售票站' },
										{ value: RightUpContentType.Turnstile, title: '检票口' },
										{ value: RightUpContentType.International, title: '国际联运' },
									]}
									value={drawParameters.rightUpContentType}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, rightUpContentType: value as RightUpContentType }));
									}}
									placeholder="自定义"
								/>

								<label>
									<Toggle
										value={drawParameters.showSoldPlaceDown}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, showSoldPlaceDown: value }));
										}}
									/>
									<span>下方显示购票处</span>
								</label>
							</div>
						</label>

						<label className="ticket-form-label">
							乘车人证件号
							<input value={drawParameters.idNumber} onChange={(e) => setDrawParameters((prev) => ({ ...prev, idNumber: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							乘车人
							<div>
								<input value={drawParameters.passenger} onChange={(e) => setDrawParameters((prev) => ({ ...prev, passenger: e.target.value }))} />
								<label>
									<Toggle
										value={drawParameters.doShowPassenger}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, doShowPassenger: value }));
										}}
									/>
									<span>显示乘车人信息</span>
								</label>
							</div>
						</label>
						<label className="ticket-form-label">
							<div>
								购票方式
								<DescriptionButton>
									<div className="flex flex-row gap-1 flex-wrap">
										{Object.entries(
											purchaseMethodList.reduce<Record<string, PurchaseMethod[]>>((acc, item) => {
												(acc[item.type] ||= []).push(item);
												return acc;
											}, {})
										).map(([type, items]) => (
											<div key={type} className="w-full">
												<div className="text-sm font-semibold mt-2 mb-1">{type}</div>
												<div className="flex flex-wrap gap-2">
													{items.map((purchaseMethodItem) => {
														return (
															<label key={purchaseMethodItem.type + '_' + purchaseMethodItem.title} className="flex items-center gap-2">
																<span
																	className={
																		purchaseMethodItem.title.length === 1
																			? 'border-black flex justify-center items-center border rounded-[20px] text-[13px] w-[18px] h-[18px]'
																			: ''
																	}
																>
																	{purchaseMethodItem.title}
																</span>
																<span className="text-[12px] text-[#242424]">{purchaseMethodItem.desc}</span>
															</label>
														);
													})}
												</div>
											</div>
										))}
									</div>
								</DescriptionButton>
							</div>
							<div className="flex flex-row gap-1 flex-wrap">
								{Object.entries(
									purchaseMethodList.reduce<Record<string, PurchaseMethod[]>>((acc, item) => {
										(acc[item.type] ||= []).push(item);
										return acc;
									}, {})
								).map(([type, items]) => (
									<div key={type} className="w-full">
										<div className="text-sm font-semibold mt-1">{type}</div>
										<div className="flex flex-wrap gap-1">
											{items.map((purchaseMethodItem) => {
												const isChecked = drawParameters.purchaseMethod.some((pm) => pm.type === purchaseMethodItem.type && pm.title === purchaseMethodItem.title);
												return (
													<label title={purchaseMethodItem.desc} key={purchaseMethodItem.type + '_' + purchaseMethodItem.title} className="flex items-center">
														<input
															type="checkbox"
															checked={isChecked}
															onChange={() => {
																if (isChecked) {
																	setDrawParameters((prev) => ({
																		...prev,
																		purchaseMethod: prev.purchaseMethod.filter(
																			(j) => !(j.type === purchaseMethodItem.type && j.title === purchaseMethodItem.title)
																		),
																	}));
																} else {
																	setDrawParameters((prev) => ({ ...prev, purchaseMethod: [...prev.purchaseMethod, purchaseMethodItem] }));
																}
															}}
														/>
														<span
															className={
																drawParameters.doPurchaseMethodHaveCircle
																	? purchaseMethodItem.title.length === 1
																		? 'border-black flex justify-center items-center border rounded-[20px] text-[13px] w-[18px] h-[18px]'
																		: ''
																	: ''
															}
														>
															{purchaseMethodItem.title}
														</span>
													</label>
												);
											})}
										</div>
									</div>
								))}
								<label>
									<Toggle
										value={drawParameters.doPurchaseMethodHaveCircle}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, doPurchaseMethodHaveCircle: value }));
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
											value: `${drawParameters.info1TrainType}经由${drawParameters.info1from}至${drawParameters.info1to}`,
											title: (
												<div>
													<span className="bg-black text-white p-[2px] mr-1">通票</span>
													<input
														type="text"
														value={drawParameters.info1TrainType}
														placeholder="列车类型"
														onChange={(e) => {
															const val = e.target.value;
															setDrawParameters((prev) => ({ ...prev, info1TrainType: val }));
														}}
														className="border w-16"
													/>
													经由
													<input
														type="text"
														value={drawParameters.info1from}
														placeholder="经由"
														onChange={(e) => {
															const val = e.target.value;
															setDrawParameters((prev) => ({ ...prev, info1from: val }));
														}}
														className="border w-24"
													/>
													至
													<input
														type="text"
														value={drawParameters.info1to}
														placeholder="终到站"
														onChange={(e) => {
															const val = e.target.value;
															setDrawParameters((prev) => ({ ...prev, info1to: val }));
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
									value={drawParameters.info1}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, info1: value }));
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
									value={drawParameters.info2}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, info2: value }));
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
									value={drawParameters.info3}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, info3: value }));
									}}
								/>
							</div>
						</label>
					</TabBox>
					<TabBox title="票号数据" className="flex flex-wrap">
						<label className="ticket-form-label">
							票号
							<input className="text-red-500" value={drawParameters.ticketNo} onChange={(e) => setDrawParameters((prev) => ({ ...prev, ticketNo: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							车票标识码
							<input value={drawParameters.serialCode} onChange={(e) => setDrawParameters((prev) => ({ ...prev, serialCode: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							二维码数据
							<textarea className="w-full h-[100px]" value={drawParameters.qrCodeText} onChange={(e) => setDrawParameters((prev) => ({ ...prev, qrCodeText: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							<div>
								<label>
									<span>虚线框内文字</span>
									<Toggle
										value={drawParameters.doShowMessage}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, doShowMessage: value }));
										}}
									/>
								</label>
							</div>
							<div>
								<textarea className="w-full h-[100px]" value={drawParameters.message} onChange={(e) => setDrawParameters((prev) => ({ ...prev, message: e.target.value }))} />
								<PrettyInputRadioGroup
									list={[
										{ value: TextAlign.Left.toString(), title: '左对齐' },
										{ value: TextAlign.Center.toString(), title: '居中' },
										{ value: TextAlign.Right.toString(), title: '右对齐' },
										{ value: TextAlign.JustifyBetween.toString(), title: '靠边铺开' },
										{ value: TextAlign.JustifyEvenly.toString(), title: '等距铺开' },
										{ value: TextAlign.JustifyAround.toString(), title: '最优铺开' },
									]}
									value={drawParameters.messageAlign.toString()}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, messageAlign: Number(value) as TextAlign }));
									}}
									placeholder="自定义"
									showInputBox={false}
								/>
								<p>预设文字：</p>
								<PrettyInputRadioGroup
									list={messageList.map((messageListItem) => {
										return { value: messageListItem, title: messageListItem };
									})}
									value={drawParameters.message}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, message: value }));
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
