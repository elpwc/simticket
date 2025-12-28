'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { decodeTicket } from '@/utils/utils';
import Toggle from '../../InfrastructureCompo/Toggle';
import TitleContainer from '../../InfrastructureCompo/TitleContainer';
import { Divider } from '../../InfrastructureCompo/Divider';
import localFonts from 'next/font/local';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { JRWideTicketBgSelector } from './JRWideTicketBgSelector';
import { UnderConstruction } from '@/components/TicketEditorCompo/UnderConstruction';
import {
	JRWideTicketDrawParametersInitialValues,
	JR_MARS_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_PAPER_TICKET_SIZE,
	JRStationNameTypeRadioboxItemData,
	TokuteiTokuShinai,
	JRPresetStations,
	JRPAYMENT_METHOD_LIST,
	JRPaymentMethod,
	JR_info1List,
	JR_MARS_120_PAPER_TICKET_CANVAS_SIZE,
	JR_hakken_area,
	JR_discount_list,
} from './value';
import { JRStationNameType, JRTicketTypeList, JRTicketTypesettingtype, JRTitleUnderlineStyleTitles, JRWideTicketDrawParameters, ShinkansenRangeTitles } from './type';
import { AppContext } from '@/app/app';
import { drawJRWideTicket } from './draw';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { JRStationNameText } from '@/components/InfrastructureCompo/JRComponents/JRStationNameText';
import { JRPresetStationsModal } from '@/components/Modals/JRPresetStationsModal';
import { useLocale } from '@/utils/hooks/useLocale';
import { Tab } from '@/components/InfrastructureCompo/Tab/Tab';
import { AdmissionForm, CustomForm, ExpressForm, RegularForm, ReservedForm } from './JRTicketTypeComponents';
import { JRPaymentSerialNumberInput } from '@/components/InfrastructureCompo/JRComponents/JRPaymentSerialNumberInput';
import { JRDiscountNameText } from '@/components/InfrastructureCompo/JRComponents/JRDiscountNameText';
import { getJRPrintingTicketTitleByTicketType } from './utils';

export const DotFont = localFonts({
	//src: '../../assets/fonts/simsun.woff2',
	src: '../../../assets/fonts/JF-Dot-Izumi16.woff2',
	//src: '../../../assets/fonts/JF-Dot-Ayu20.woff2',
});

export default function JRWideTicket() {
	const { t } = useLocale();
	const searchParams = useSearchParams();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontRef = useRef<(size: number, fontName: string) => string>(null);

	const [size, setSize] = useState(JR_MARS_PAPER_TICKET_SIZE);
	const [canvasSize, setCanvasSize] = useState(JR_MARS_PAPER_TICKET_CANVAS_SIZE);
	const [currentScale, setCurrentScale] = useState(1);

	const [isBgImageLoading, setIsBgImageLoading] = useState(false);
	const [isFontLoading, setIsFontLoading] = useState(false);
	const [isFlipSide, setIsFlipSide] = useState(false);
	/** 0: close, 1: station1, 2: station2 */
	const [showJRPresetStationsModal, setShowJRPresetStationsModal] = useState(0);

	const [ticketTypeset, setTicketTypeset] = useState(JRTicketTypesettingtype.Fare);

	const { editingTicketData, setEditingTicketData } = useContext(AppContext);
	const { copyEditingTicketDataToDrawParameters, setCopyEditingTicketDataToDrawParameters } = useContext(AppContext);

	const getInitialValues = () => {
		const comParam = searchParams.get('com');
		const ticketParam = searchParams.get('ticket');
		//const id = searchParams.get('id');
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
			return {
				...JRWideTicketDrawParametersInitialValues,
				...JRPresetStations[Math.floor(Math.random() * JRPresetStations.length)],
			};
		}
	};
	const [drawParameters, setDrawParameters] = useState<JRWideTicketDrawParameters>(copyEditingTicketDataToDrawParameters ? editingTicketData : getInitialValues());

	const [offsetContent, setOffsetContent] = useState([drawParameters.offsetX.toString(), (0 - drawParameters.offsetY).toString()]);

	useEffect(() => {
		setDrawParameters((prev) => ({
			...prev,
			offsetX: Number(offsetContent[0]),
			offsetY: 0 - Number(offsetContent[1]),
		}));
	}, [offsetContent]);

	useEffect(() => {
		if (copyEditingTicketDataToDrawParameters) {
			setDrawParameters(editingTicketData);
			setCopyEditingTicketDataToDrawParameters(false);
		}
	}, [copyEditingTicketDataToDrawParameters]);

	useEffect(() => {}, []);

	const drawTicket = () => {
		drawJRWideTicket(
			canvasRef.current,
			canvasRef.current?.width || canvasSize[0],
			canvasRef.current?.height || canvasSize[1],
			ctxRef.current,
			drawParameters,
			undefined,
			isFlipSide,
			() => {},
			() => {
				setIsBgImageLoading(false);
			}
		);
	};

	useEffect(() => {
		setIsBgImageLoading(true);
		setCanvasSize(drawParameters.is120mm ? JR_MARS_120_PAPER_TICKET_CANVAS_SIZE : JR_MARS_PAPER_TICKET_CANVAS_SIZE);
	}, [drawParameters.background, drawParameters.is120mm]);

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
			isBgImageLoading={isBgImageLoading}
			isFontLoading={isFontLoading}
			onFlip={(isFlip) => {
				setIsFlipSide(isFlip);
			}}
			form={
				<div className="flex flex-col m-4">
					<UnderConstruction size="small" />
					<TitleContainer title="券面" className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							券面
							<JRWideTicketBgSelector is120mm={drawParameters.is120mm} value={drawParameters.background} onChange={(e) => setDrawParameters((prev) => ({ ...prev, background: e }))} />
						</label>
						<label className="ticket-form-label">
							券幅
							<PrettyInputRadioGroup
								value={drawParameters.is120mm}
								onChange={(value) => {
									setDrawParameters((prev) => ({ ...prev, is120mm: value }));
								}}
								list={[
									{ value: false, title: '85ミリ券' },
									{ value: true, title: '120ミリ券' },
								]}
								doNotShowInputBox
							/>
						</label>
						<label className="ticket-form-label">
							印刷ズレ
							<div className="flex grid-cols-3">
								<label className="flex items-center">
									X
									<input className="max-w-[60px]" type="number" value={offsetContent[0]} onChange={(e) => setOffsetContent([e.target.value, offsetContent[1]])} />
								</label>
								<label className="flex items-center">
									Y
									<input className="max-w-[60px]" type="number" value={offsetContent[1]} onChange={(e) => setOffsetContent([offsetContent[0], e.target.value])} />
								</label>
								<button
									className="w-[max-content] text-[12px]"
									style={{ borderRadius: '4px 0 0 4px', padding: '4px 4px', marginRight: 0 }}
									onClick={() => {
										setOffsetContent(['0', '0']);
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
										<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
									</svg>
								</button>
								<button
									className="w-[max-content] text-[12px]"
									style={{ borderRadius: '0 4px 4px 0', padding: '4px 4px', marginLeft: 0, borderLeft: 'none' }}
									onClick={() => {
										setOffsetContent([(Math.random() * 30 - 15).toFixed(0), (Math.random() * 16 - 8).toFixed(0)]);
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path
											fillRule="evenodd"
											d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"
										/>
										<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192" />
									</svg>
								</button>
							</div>
						</label>
						<label className="ticket-form-label">
							<div>
								透かし
								<Toggle
									value={drawParameters.showWatermark}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, showWatermark: value }));
									}}
								/>
							</div>
							<input className="" style={{ color: '#AF0508' }} value={drawParameters.watermark} onChange={(e) => setDrawParameters((prev) => ({ ...prev, watermark: e.target.value }))} />
						</label>
						<div className="w-full">
							券種　※現在（2025.12）は乗車券、特急券、指定席券だけ対応（未完成の箇所があります）
							<div>
								<Tab
									menuPosition="top"
									menu={JRTicketTypeList.map((JRTicketType) => ({ title: JRTicketType.name }))}
									pages={[
										<RegularForm
											onChange={(title) => {
												setDrawParameters((prev) => ({ ...prev, ticketType: title }));
												setTicketTypeset(drawParameters.is120mm ? getJRPrintingTicketTitleByTicketType(title).typeset120 : getJRPrintingTicketTitleByTicketType(title).typeset);
											}}
											key="1"
										/>,
										<ExpressForm
											onChange={(title) => {
												setDrawParameters((prev) => ({ ...prev, ticketType: title }));
												setTicketTypeset(drawParameters.is120mm ? getJRPrintingTicketTitleByTicketType(title).typeset120 : getJRPrintingTicketTitleByTicketType(title).typeset);
											}}
											key="2"
										/>,
										<ReservedForm
											onChange={(title) => {
												setDrawParameters((prev) => ({ ...prev, ticketType: title }));
												setTicketTypeset(drawParameters.is120mm ? getJRPrintingTicketTitleByTicketType(title).typeset120 : getJRPrintingTicketTitleByTicketType(title).typeset);
											}}
											key="3"
										/>,
										<AdmissionForm
											onChange={(title) => {
												setDrawParameters((prev) => ({ ...prev, ticketType: title }));
												setTicketTypeset(drawParameters.is120mm ? getJRPrintingTicketTitleByTicketType(title).typeset120 : getJRPrintingTicketTitleByTicketType(title).typeset);
											}}
											key="4"
										/>,
										<CustomForm
											ticketTitle={drawParameters.ticketType}
											onChange={(title) => {
												setDrawParameters((prev) => ({ ...prev, ticketType: title }));
												setTicketTypeset(drawParameters.is120mm ? getJRPrintingTicketTitleByTicketType(title).typeset120 : getJRPrintingTicketTitleByTicketType(title).typeset);
											}}
											key="5"
										/>,
									]}
									defaultSelectedIndex={0}
									menuItemStyle={{ width: 'auto' }}
								/>
							</div>
						</div>
						<label className="ticket-form-label">
							&nbsp;
							<div>
								<Toggle
									value={drawParameters.hasSinkansen}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, hasSinkansen: value }));
									}}
								>
									新幹線区間あり→（幹）
								</Toggle>
								<Toggle
									value={drawParameters.doShowEnglish}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doShowEnglish: value }));
									}}
								>
									英文付き券面（仮）
								</Toggle>
								<Toggle
									value={drawParameters.hasCannotPassAutoPasiAreaMark}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, hasCannotPassAutoPasiAreaMark: value }));
									}}
								>
									改札利用不可マーク
								</Toggle>
								<Toggle
									value={drawParameters.isChild}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, isChild: value }));
									}}
								>
									<span className="text-[white] bg-black px-1" style={{ fontFamily: 'DotFont', fontWeight: 'bold' }}>
										小
									</span>
									こども料金
								</Toggle>
								<Toggle
									value={drawParameters.hasJouhenMark}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, hasJouhenMark: value }));
									}}
								>
									<span className="text-[black] border-2 text-[14px] bg-white px-[2px]" style={{ fontFamily: 'DotFont', fontWeight: 'bold' }}>
										乗変
									</span>
									マーク
								</Toggle>
							</div>
						</label>
						<label className="ticket-form-label">
							タイトル下線様式
							<PrettyInputRadioGroup
								value={drawParameters.titleUnderlineStyle}
								onChange={(value) => {
									setDrawParameters((prev) => ({ ...prev, titleUnderlineStyle: value }));
								}}
								list={JRTitleUnderlineStyleTitles}
								doNotShowInputBox
							/>
						</label>
						<label className="ticket-form-label">
							幹在別線区間
							<div className="flex">
								<div>
									<p className="text-[12px] text-[green]">◎東京～熱海</p>
									<PrettyInputRadioGroup
										style={{ flexDirection: 'column' }}
										value={drawParameters.sinkansenRange1}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, sinkansenRange1: value }));
										}}
										list={ShinkansenRangeTitles}
										doNotShowInputBox
									/>
								</div>
								<div>
									<p className="text-[12px] text-[blue]">◎米原～新大阪</p>
									<PrettyInputRadioGroup
										style={{ flexDirection: 'column' }}
										value={drawParameters.sinkansenRange2}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, sinkansenRange2: value }));
										}}
										list={ShinkansenRangeTitles}
										doNotShowInputBox
									/>
								</div>
								<div>
									<p className="text-[12px] text-[red]">◎新下関～博多</p>
									<PrettyInputRadioGroup
										style={{ flexDirection: 'column' }}
										value={drawParameters.sinkansenRange3}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, sinkansenRange3: value }));
										}}
										list={ShinkansenRangeTitles}
										doNotShowInputBox
									/>
								</div>
							</div>
						</label>
					</TitleContainer>
					<TitleContainer title="駅情報" className="flex flex-wrap gap-1">
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								出発駅特定都区市内
								<PrettyInputRadioGroup
									value={drawParameters.station1AreaChar}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, station1AreaChar: value }));
									}}
									list={TokuteiTokuShinai.map((TokuteiTokuShinaiItem) => {
										return {
											value: TokuteiTokuShinaiItem.char,
											title: (
												<span
													className={clsx(
														'text-10 text-white bg-black p-[0px]',
														drawParameters.station1AreaChar === TokuteiTokuShinaiItem.char ? 'border-2 border-blue-600' : ''
													)}
												>
													{TokuteiTokuShinaiItem.char}
												</span>
											),
										};
									})}
									className="items-center"
									itemStyle={{ padding: 0, minWidth: 0, height: 'fit-content' }}
									inputStyle={{ width: '100px' }}
								/>
							</label>
							<label className="ticket-form-label">
								<span className="font-bold">出発駅</span>
								<div className="flex flex-wrap">
									<input
										className="border-[#79b8f2] border-2 font-bold"
										value={drawParameters.station1}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, station1: e.target.value }));
										}}
									/>
									<button
										className="flex items-center border-[#79b8f2] border-2 w-max"
										onClick={() => {
											setShowJRPresetStationsModal(1);
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
										</svg>
										{t('editor.jr.mars.stationInfo.specialStationNamePresetButton')}
									</button>
								</div>
							</label>
							<p>
								※{t('editor.jr.mars.stationInfo.specialStationNameTip')}（例：高輪/ゲートウェイ→
								<span className={''} style={{ fontFamily: 'DotFont', fontWeight: 'bold' }}>
									<span className={'text-[16px]'}>高輪</span>
									<span className={'text-[10px]'}>ゲートウェイ</span>
								</span>
								）
							</p>

							<label className="ticket-form-label">
								2/3段式駅名種類
								<PrettyInputRadioGroup
									value={drawParameters.station1Type.toString()}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, station1Type: Number(value) }));
									}}
									list={JRStationNameTypeRadioboxItemData.map((JRStationNameTypeRadioboxItemDataItem) => {
										return {
											value: JRStationNameTypeRadioboxItemDataItem.type.toString(),
											title: (
												<div className="flex flex-col !text-[#222222]">
													<JRStationNameText
														className="min-w-16 px-1 pb-1"
														stationName={JRStationNameTypeRadioboxItemDataItem.desc}
														stationNameType={JRStationNameTypeRadioboxItemDataItem.type}
													/>
													<p
														className={clsx('border-t-1 text-[11px] h-fit bg-white')}
														style={{
															fontWeight: drawParameters.station1Type === JRStationNameTypeRadioboxItemDataItem.type ? 'bold' : '',
															backgroundColor: drawParameters.station1Type === JRStationNameTypeRadioboxItemDataItem.type ? 'black' : 'white',
															color: drawParameters.station1Type === JRStationNameTypeRadioboxItemDataItem.type ? 'white' : 'black',
														}}
													>
														{JRStationNameTypeRadioboxItemDataItem.name}
													</p>
												</div>
											),
										};
									})}
									itemStyle={{ padding: 0, minWidth: 0, display: 'flex', alignItems: 'flex-end', backgroundColor: '#DDF6EE' }}
									doNotShowInputBox
								/>
							</label>

							<label className="ticket-form-label">
								出発外国語
								<input value={drawParameters.station1en} onChange={(e) => setDrawParameters((prev) => ({ ...prev, station1en: e.target.value }))} />
							</label>
						</div>

						<Divider />

						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								到着駅特定都区市内
								<PrettyInputRadioGroup
									value={drawParameters.station2AreaChar}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, station2AreaChar: value }));
									}}
									list={TokuteiTokuShinai.map((TokuteiTokuShinaiItem) => {
										return {
											value: TokuteiTokuShinaiItem.char,
											title: (
												<span
													className={clsx(
														'text-10 text-white bg-black p-[0px]',
														drawParameters.station2AreaChar === TokuteiTokuShinaiItem.char ? 'border-2 border-blue-600' : ''
													)}
												>
													{TokuteiTokuShinaiItem.char}
												</span>
											),
										};
									})}
									className="items-center"
									itemStyle={{ padding: 0, minWidth: 0, height: 'fit-content' }}
									inputStyle={{ width: '100px' }}
								/>
							</label>
							<label className="ticket-form-label">
								<span className="font-bold">到着駅</span>
								<div className="flex flex-wrap">
									<input
										className="border-[#79b8f2] border-2 font-bold"
										value={drawParameters.station2}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, station2: e.target.value }));
										}}
									/>
									<button
										className="flex items-center border-[#79b8f2] border-2"
										onClick={() => {
											setShowJRPresetStationsModal(2);
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
										</svg>
										{t('editor.jr.mars.stationInfo.specialStationNamePresetButton')}
									</button>
								</div>
							</label>
							<label className="ticket-form-label">
								2/3段式駅名種類
								<PrettyInputRadioGroup
									value={drawParameters.station2Type.toString()}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, station2Type: Number(value) }));
									}}
									list={JRStationNameTypeRadioboxItemData.map((JRStationNameTypeRadioboxItemDataItem) => {
										return {
											value: JRStationNameTypeRadioboxItemDataItem.type.toString(),
											title: (
												<div className="flex flex-col !text-[#222222]">
													<JRStationNameText
														className="min-w-16 px-1 pb-1"
														stationName={JRStationNameTypeRadioboxItemDataItem.desc}
														stationNameType={JRStationNameTypeRadioboxItemDataItem.type}
													/>
													<p
														className="border-t-1 text-[11px] h-fit bg-white"
														style={{
															fontWeight: drawParameters.station2Type === JRStationNameTypeRadioboxItemDataItem.type ? 'bold' : '',
															backgroundColor: drawParameters.station2Type === JRStationNameTypeRadioboxItemDataItem.type ? 'black' : 'white',
															color: drawParameters.station2Type === JRStationNameTypeRadioboxItemDataItem.type ? 'white' : 'black',
														}}
													>
														{JRStationNameTypeRadioboxItemDataItem.name}
													</p>
												</div>
											),
										};
									})}
									itemStyle={{ padding: 0, minWidth: 0, display: 'flex', alignItems: 'flex-end', backgroundColor: '#DDF6EE' }}
									doNotShowInputBox
								/>
							</label>
							<label className="ticket-form-label">
								到着外国語
								<input value={drawParameters.station2en} onChange={(e) => setDrawParameters((prev) => ({ ...prev, station2en: e.target.value }))} />
							</label>
						</div>

						<Divider />

						<label className="ticket-form-label">
							経由
							<input
								value={drawParameters.railways.join(',')}
								placeholder="半角「,」で分けて下さい（例：東海道,御殿場）"
								onChange={(e) => setDrawParameters((prev) => ({ ...prev, railways: e.target.value.split(/[,;|，、・·]/) }))}
							/>
						</label>

						<label className="ticket-form-label border-t-[#ccc_!important]">
							テキスト１
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									name="info1"
									list={JR_info1List.map((item) => ({ title: item, value: item }))}
									value={drawParameters.info1}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, info1: value }));
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							矢印様式
							<PrettyInputRadioGroup
								value={drawParameters.isKaisukenArrow ? '1' : '0'}
								onChange={(value) => {
									setDrawParameters((prev) => ({ ...prev, isKaisukenArrow: value === '1' }));
								}}
								list={[
									{ value: '0', title: '→（一般）' },
									{ value: '1', title: '↔（回数券）' },
								]}
								doNotShowInputBox
							/>
						</label>
					</TitleContainer>

					<TitleContainer title="運行情報（仮）" className="flex flex-wrap gap-2">
						<label className="ticket-form-label">
							列車名
							<input value={drawParameters.trainName} onChange={(e) => setDrawParameters((prev) => ({ ...prev, trainName: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							列車番
							<div>
								<input value={drawParameters.trainNo} onChange={(e) => setDrawParameters((prev) => ({ ...prev, trainNo: e.target.value }))} />号
							</div>
						</label>
						<Divider />

						<label className="ticket-form-label">
							発車時間
							<div className="flex">
								<input
									type="date"
									value={drawParameters.date}
									onChange={(e) => {
										const value = e.target.value;
										setDrawParameters((prev) => ({
											...prev,
											date: value,
										}));
									}}
								/>
								<input type="time" value={drawParameters.time} onChange={(e) => setDrawParameters((prev) => ({ ...prev, time: e.target.value }))} />
							</div>
						</label>
						<label className="ticket-form-label">
							到着時間
							<div className="flex">
								<input
									type="date"
									value={drawParameters.date2}
									onChange={(e) => {
										const value = e.target.value;
										setDrawParameters((prev) => ({
											...prev,
											date2: value,
										}));
									}}
								/>
								<input type="time" value={drawParameters.time2} onChange={(e) => setDrawParameters((prev) => ({ ...prev, time2: e.target.value }))} />
							</div>
						</label>
						<label className="ticket-form-label">
							特急券有効期間（仮）
							<div className="flex flex-wrap">
								<input
									type="date"
									value={drawParameters.date2}
									onChange={(e) => {
										const value = e.target.value;
										setDrawParameters((prev) => ({
											...prev,
											date2: value,
										}));
									}}
								/>
								～
								<input
									type="date"
									value={drawParameters.expressExpireDate}
									onChange={(e) => {
										const value = e.target.value;
										setDrawParameters((prev) => ({
											...prev,
											expressExpireDate: value,
										}));
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							乗車券有効期間（仮）
							<div className="flex flex-wrap">
								<input
									type="date"
									value={drawParameters.date}
									onChange={(e) => {
										const value = e.target.value;
										setDrawParameters((prev) => ({
											...prev,
											date: value,
										}));
									}}
								/>
								～
								<input
									type="date"
									value={drawParameters.fareTicketExpireDate}
									onChange={(e) => {
										const value = e.target.value;
										setDrawParameters((prev) => ({
											...prev,
											fareTicketExpireDate: value,
										}));
									}}
								/>
							</div>
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
							寝台席位置（仮）
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									disabled
									list={[
										{ value: '上段', title: '上段' },
										{ value: '中段', title: '中段' },
										{ value: '下段', title: '下段' },
										{ value: '個室', title: '個室' },
									]}
									value={drawParameters.seat3}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, seat3: value }));
									}}
								/>
							</div>
						</label>
					</TitleContainer>

					<TitleContainer title="購入情報（仮）" className="flex flex-wrap">
						<label className="ticket-form-label">
							購入手段（仮）
							<PrettyInputRadioGroup
								doNotShowInputBox
								value={drawParameters.paymentMethod.toString()}
								onChange={(e) => setDrawParameters((prev) => ({ ...prev, paymentMethod: Number(e) as JRPaymentMethod }))}
								list={JRPAYMENT_METHOD_LIST.map((JRPAYMENTHOD) => {
									return {
										value: JRPAYMENTHOD.value.toString(),
										title: <p title={JRPAYMENTHOD.title}>{JRPAYMENTHOD.text}</p>,
									};
								})}
							/>
						</label>
						<label className="ticket-form-label">
							値段 ￥（仮）
							<div className="flex flex-col">
								<input value={drawParameters.price} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price: e.target.value }))} />
								<label className="">
									内訳＝値段1 ￥
									<input value={drawParameters.price1} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price1: e.target.value }))} />
								</label>
								<label className="">
									　　＋値段2 ￥
									<input value={drawParameters.price2} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price2: e.target.value }))} />
								</label>
								<label className="">
									　　＋値段3 ￥
									<input value={drawParameters.price3} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price3: e.target.value }))} />
								</label>
							</div>
						</label>
						<Divider />
						<label className="ticket-form-label">
							割引（仮）
							<div>
								<PrettyInputRadioGroup
									value={drawParameters.discount}
									onChange={(e) => setDrawParameters((prev) => ({ ...prev, discount: e }))}
									list={JR_discount_list.map((discount) => {
										return {
											title: <JRDiscountNameText name={discount.value} desc={discount.title} />,
											value: discount.value,
										};
									})}
									itemStyle={{ padding: '3px 0' }}
								/>
								{/* <button>他の割引</button> */}
								<p>※カスタマイズ説明：</p>
								<p className="flex flex-wrap">
									「鉄印帳/を携帯して下さい/乗り鉄割」と入力して→
									<JRDiscountNameText name="鉄印帳/を携帯して下さい/乗り鉄割" />
									のような割引様式になるよ
								</p>
							</div>
						</label>

						<Divider />
						<Toggle
							value={drawParameters.isPaymentIssuingTheSamePlace}
							onChange={(value) => {
								setDrawParameters((prev) => ({ ...prev, isPaymentIssuingTheSamePlace: value }));
							}}
						>
							発行発券場所は同じ
						</Toggle>
						<label className="ticket-form-label">
							発行場所
							<div>
								<input className="w-full" value={drawParameters.paymentPlace} onChange={(e) => setDrawParameters((prev) => ({ ...prev, paymentPlace: e.target.value }))} />
								<div>※えきねっと発行発券の場合自動的に左下に「えきねっと発券」付けます</div>
							</div>
						</label>
						<label className="ticket-form-label">
							発行日付
							<input
								type="date"
								value={drawParameters.paymentDate}
								onChange={(e) => {
									const value = e.target.value;
									setDrawParameters((prev) => ({
										...prev,
										paymentDate: value,
									}));
								}}
							/>
						</label>
						<label className="ticket-form-label">
							発行番号
							<JRPaymentSerialNumberInput
								defaultvalue={drawParameters.paymentNo}
								value={drawParameters.paymentNo}
								onChange={(e) => setDrawParameters((prev) => ({ ...prev, paymentNo: e }))}
							/>
						</label>
						<Divider />
						<label className="ticket-form-label">
							発券場所
							<input className="" value={drawParameters.issuingPlace} onChange={(e) => setDrawParameters((prev) => ({ ...prev, issuingPlace: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							発券日付
							<input
								type="date"
								value={drawParameters.issuingDate}
								onChange={(e) => {
									const value = e.target.value;
									setDrawParameters((prev) => ({
										...prev,
										issuingDate: value,
									}));
								}}
							/>
						</label>
						<label className="ticket-form-label">
							発券番号
							<JRPaymentSerialNumberInput
								defaultvalue={drawParameters.paymentNo}
								value={drawParameters.issuingNo}
								onChange={(e) => setDrawParameters((prev) => ({ ...prev, issuingNo: e }))}
							/>
						</label>

						<Divider />
						<label className="ticket-form-label">
							発券エリア番号
							<div>
								<PrettyInputRadioGroup value={drawParameters.issuingAreaNo} onChange={(e) => setDrawParameters((prev) => ({ ...prev, issuingAreaNo: e }))} list={JR_hakken_area} />

								<Toggle
									value={drawParameters.hasOtherCompanyLines}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, hasOtherCompanyLines: value }));
									}}
								>
									他社路線有り
								</Toggle>
							</div>
						</label>
						<label className="ticket-form-label">
							R通番
							<input value={drawParameters.RCode} onChange={(e) => setDrawParameters((prev) => ({ ...prev, RCode: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							誤取消防止符号（C通番）
							<input value={drawParameters.CCode} onChange={(e) => setDrawParameters((prev) => ({ ...prev, CCode: e.target.value }))} />
						</label>
						<Divider />
					</TitleContainer>
					<TitleContainer title="番号（仮）" className="flex flex-wrap">
						<label className="ticket-form-label">
							<label>
								<span>旅行会社向けプリカット通番</span>
								<Toggle
									value={drawParameters.doShowSerialCode}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doShowSerialCode: value }));
									}}
								/>
							</label>
							<input className="text-[#A942C3]" value={drawParameters.serialCode} onChange={(e) => setDrawParameters((prev) => ({ ...prev, serialCode: e.target.value }))} />
						</label>
					</TitleContainer>
					<TitleContainer title="印字（仮）" className="flex flex-wrap">
						<label className="ticket-form-label">
							入出場記録（仮）
							<input disabled className="" value={'開発中'} onChange={(e) => setDrawParameters((prev) => ({ ...prev, serialCode: e.target.value }))} />
						</label>
					</TitleContainer>
					<JRPresetStationsModal
						show={showJRPresetStationsModal > 0}
						onClose={() => {
							setShowJRPresetStationsModal(0);
						}}
						onSelect={(selectedStationName: { type: JRStationNameType; company: string; name: string; areaChar: string; en?: string }) => {
							if (showJRPresetStationsModal === 1) {
								setDrawParameters((prev) => ({
									...prev,
									station1: selectedStationName.name,
									station1Type: selectedStationName.type,
									station1AreaChar: selectedStationName.areaChar,
									station1en: selectedStationName.en || '',
								}));
							} else {
								setDrawParameters((prev) => ({
									...prev,
									station2: selectedStationName.name,
									station2Type: selectedStationName.type,
									station2AreaChar: selectedStationName.areaChar,
									station2en: selectedStationName.en || '',
								}));
							}
							setShowJRPresetStationsModal(0);
						}}
					/>
				</div>
			}
		/>
	);
}
