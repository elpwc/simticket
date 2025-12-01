'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { decodeTicket, fontsLoader, TextAlign } from '@/utils/utils';
import Toggle from '../../InfrastructureCompo/Toggle';
import TabBox from '../../InfrastructureCompo/TabBox';
import { Divider } from '../../InfrastructureCompo/Divider';
import localFonts from 'next/font/local';
import { CRWideTicketBgSelector } from './CRWideTicketBgSelector';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { pinyin } from 'pinyin-pro';
import { DescriptionButton } from '@/components/InfrastructureCompo/DescriptionButton';
import {
	CR_TRAIN_TYPE_ARRAY,
	CR_TRAIN_TYPES,
	CRPresetStations,
	CRWideTicketDrawParametersInitialValues,
	info1List,
	info2List,
	info3List,
	MAG_TICKET_CANVAS_SIZE,
	messageList,
	PAPER_TICKET_CANVAS_SIZE,
	PAPER_TICKET_SIZE,
	purchaseCertTypeList,
	purchaseMethodList,
	purchasePassportNationList,
	seatType,
	sleepingCarSeatType,
} from './value';
import { CRTicketBackGround, CRWideTicketDrawParameters, PurchaseMethod, RightUpContentType } from './type';
import { drawCRWideTicket } from './draw';
import { AppContext } from '@/app/app';
import { useLocale } from '@/utils/hooks/useLocale';
import { useSearchParams } from 'next/navigation';
import { getRandomCRTicketNo } from './utils';

export const HuawenXinwei = localFonts({
	src: '../../../assets/fonts/STXINWEI.woff2',
});
export const SongTi = localFonts({
	src: '../../../assets/fonts/LXGWNeoZhiSong.woff2',
});
export const SongTiEn = localFonts({
	src: '../../../assets/fonts/NimbusRomNo9L-Regu.woff2',
});
export const HeiTi = localFonts({
	src: '../../../assets/fonts/simhei.woff2',
});
export const TicketNoFont = localFonts({
	src: '../../../assets/fonts/cr_ticketNo.woff2',
});
export const TrainCodeFont = localFonts({
	src: '../../../assets/fonts/traincode.woff2',
});

export default function CRWideTicket() {
	const { t } = useLocale();
	const searchParams = useSearchParams();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontRef = useRef<(size: number, fontName: string) => string>(null);

	const [size, setSize] = useState(PAPER_TICKET_SIZE);
	const [canvasSize, setCanvasSize] = useState(PAPER_TICKET_CANVAS_SIZE);

	const [isBgImageLoading, setIsBgImageLoading] = useState(false);
	const [isFontLoading, setIsFontLoading] = useState(false);
	const [isFlipSide, setIsFlipSide] = useState(false);

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
		if (ticketDataStr !== null && ticketDataStr !== '' && companyId === 0 && ticketTypeId === 4) {
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
				...CRWideTicketDrawParametersInitialValues,
				...CRPresetStations[Math.floor(Math.random() * CRPresetStations.length)],
			};
		}
	};

	const [drawParameters, setDrawParameters] = useState<CRWideTicketDrawParameters>(copyEditingTicketDataToDrawParameters ? editingTicketData : getInitialValues());

	const [offsetContent, setOffsetContent] = useState([drawParameters.offsetX.toString(), (0 - drawParameters.offsetY).toString()]);
	const [TMIS, setTMIS] = useState(drawParameters.serialCode.slice(0, 5));
	const [machineNo, setMachineNo] = useState(drawParameters.serialCode.slice(5, 10));
	const [purchaseDate, setPurchaseDate] = useState(drawParameters.serialCode.slice(10, 14));
	const [purchaseCertType, setPurchaseCertType] = useState(drawParameters.serialCode.split(' ').length > 1 ? drawParameters.serialCode.split(' ')[1] : 'JM');
	const [purchasePassportCode, setPurchasePassportCode] = useState(drawParameters.serialCode.split(' ').length > 2 ? drawParameters.serialCode.split(' ')[2] : '');

	useEffect(() => {
		setDrawParameters((prev) => ({
			...prev,
			offsetX: Number(offsetContent[0]),
			offsetY: 0 - Number(offsetContent[1]),
		}));
	}, [offsetContent]);

	useEffect(() => {
		setDrawParameters((prev) => ({
			...prev,
			serialCode:
				`${TMIS}${machineNo}${purchaseDate}${drawParameters.ticketNo}` +
				(purchaseCertType.length > 0 ? ` ${purchaseCertType}` + (purchasePassportCode.length > 0 ? ` ${purchasePassportCode}` : '') : ''),
		}));
	}, [TMIS, machineNo, purchaseDate, drawParameters.ticketNo, purchaseCertType, purchasePassportCode]);

	useEffect(() => {
		if (copyEditingTicketDataToDrawParameters) {
			setDrawParameters(editingTicketData);
			setCopyEditingTicketDataToDrawParameters(false);
		}
	}, [copyEditingTicketDataToDrawParameters]);

	const drawTicket = () => {
		drawCRWideTicket(
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
		// setDrawParameters((prev) => ({
		// 	...prev,
		// 	qrCodeText: getTicketURL(0, 4, drawParameters),
		// }));
		drawTicket();
	}, [drawTicket, size, canvasSize, drawParameters, isFontLoading]);

	// 下のリスト更新
	useEffect(() => {
		setEditingTicketData(drawParameters);
	}, [drawParameters]);

	useEffect(() => {
		setDrawParameters((prev) => ({
			...prev,
			qrCodeText: `${window.location.origin + window.location.pathname}?${drawParameters.station1}-${drawParameters.station2} No.${drawParameters.ticketNo} ${
				typeof drawParameters.date === 'string' && (drawParameters.date.includes('-') || drawParameters.date === '')
					? drawParameters.date
					: new Date(drawParameters.date).toISOString().slice(0, 10)
			} ${drawParameters.time} ${drawParameters.seatClass}车 ${drawParameters.carriage}${drawParameters.seat1}${drawParameters.seat2}号${drawParameters.seat3} ￥${drawParameters.price}元`,
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
			ticketData={drawParameters}
			saveFilename={`ticket_${drawParameters.station1}-${drawParameters.station2}`}
			isBgImageLoading={isBgImageLoading}
			isFontLoading={isFontLoading}
			onFlip={(isFlip: boolean) => {
				setIsFlipSide(isFlip);
			}}
			form={
				<div className="flex flex-col gap-4 m-4">
					<TabBox title={t('editor.common.ticketFace.title')} className="flex flex-wrap gap-1">
						<label className="ticket-form-label">
							{t('editor.common.ticketFace.paper')}
							<CRWideTicketBgSelector value={drawParameters.background} onChange={(value: CRTicketBackGround) => setDrawParameters((prev) => ({ ...prev, background: value }))} />
						</label>
						<label className="ticket-form-label">
							{t('editor.common.ticketFace.offset')}
							<div className="flex grid-cols-3 gap-2">
								<label className="flex gap-1 items-center">
									X
									<input className="max-w-[70px]" type="number" value={offsetContent[0]} onChange={(e) => setOffsetContent([e.target.value, offsetContent[1]])} />
								</label>
								<label className="flex gap-1 items-center">
									Y
									<input className="max-w-[70px]" type="number" value={offsetContent[1]} onChange={(e) => setOffsetContent([offsetContent[0], e.target.value])} />
								</label>
								<button
									className="w-[max-content] text-[12px]"
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
									onClick={() => {
										setOffsetContent([(Math.random() * 100 - 50).toFixed(0), (Math.random() * 80 - 40).toFixed(0)]);
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
							{t('editor.common.ticketNoInfo.ticketNo')}
							<div className="flex">
								<input className="text-red-500 w-full" value={drawParameters.ticketNo} onChange={(e) => setDrawParameters((prev) => ({ ...prev, ticketNo: e.target.value }))} />
								<button
									onClick={() => {
										setDrawParameters((prev) => ({ ...prev, ticketNo: getRandomCRTicketNo() }));
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
								{t('editor.common.ticketFace.watermark')}
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
										{t('editor.cr.jisuanjikepiao2010.ticketFace.useHKWestKowloonStyle')}
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
										{t('editor.cr.jisuanjikepiao2010.ticketFace.showBorderForNonBorder')}
									</div>
								</label>
							</div>
						</div>
					</TabBox>
					<TabBox title={t('editor.common.stationInfo.title')} className="flex flex-wrap gap-1">
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								{t('editor.common.stationInfo.departure')}
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
								{t('editor.common.stationInfo.departureForeign')}
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
									{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.useText')}
									<span className={HuawenXinwei.className}>{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.weibeitiText')}</span>
									<DescriptionButton modalTitle={t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.weibeitiText')}>
										<p>{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.desc1')}</p>
										<p>{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.desc2')}</p>
									</DescriptionButton>
								</span>
							</label>
						</div>
						<div className="flex flex-col gap-[2px]">
							<label className="ticket-form-label">
								{t('editor.common.stationInfo.arrival')}
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
								{t('editor.common.stationInfo.arrivalForeign')}
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
									{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.useText')}
									<span className={HuawenXinwei.className}>{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.weibeitiText')}</span>
									<DescriptionButton modalTitle={t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.weibeitiText')}>
										<p>{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.desc1')}</p>
										<p>{t('editor.cr.jisuanjikepiao2010.stationInfo.useWeibeiti.desc2')}</p>
									</DescriptionButton>
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
								<span>{t('editor.common.stationInfo.showTheTextOfStation')}</span>
							</label>
							<label>
								<Toggle
									value={drawParameters.doShowEnglish}
									onChange={(value) => {
										setDrawParameters((prev) => ({ ...prev, doShowEnglish: value }));
									}}
								/>
								<span>{t('editor.common.stationInfo.showForeignLanguageStationName')}</span>
							</label>
						</div>
					</TabBox>

					<TabBox title={t('editor.common.trainInfo.title')} className="flex flex-wrap gap-2">
						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.trainInfo.routeIdentifier')}
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
									<span>{t('editor.common.trainInfo.returnTrain')}</span>
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
							placeholder={t('editor.cr.jisuanjikepiao2010.trainInfo.pukepukuaiOrCustom')}
						/>
						<label className="ticket-form-label">
							{t('editor.common.trainInfo.departureDate')}
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
						</label>
						<label className="ticket-form-label">
							{t('editor.common.trainInfo.departureTime')}
							<input type="time" value={drawParameters.time} onChange={(e) => setDrawParameters((prev) => ({ ...prev, time: e.target.value }))} />
						</label>
						<Divider />
						<label className="ticket-form-label">
							<div className="flex gap-2">
								{t('editor.common.trainInfo.carriage')}
								<label className="flex items-center text-[12px]">
									<input
										type="checkbox"
										checked={drawParameters.noCarriage}
										onChange={(e) => {
											setDrawParameters((prev) => ({ ...prev, noCarriage: e.target.checked }));
										}}
									/>
									<span>{t('editor.common.trainInfo.noCarriage')}</span>
								</label>
							</div>
							<input value={drawParameters.carriage} onChange={(e) => setDrawParameters((prev) => ({ ...prev, carriage: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							{t('editor.common.trainInfo.seatNo')}

							<div>
								<input className="w-full" value={drawParameters.seat1} onChange={(e) => setDrawParameters((prev) => ({ ...prev, seat1: e.target.value }))} />

								<PrettyInputRadioGroup
									list={[
										{ value: '无座', title: '无座' },
										{ value: '无号', title: '无号' },
										{ value: '准乘', title: '准乘' },
										{ value: '不对号入座', title: '不对号入座' },
										{ value: '', title: '正常' },
									]}
									value={drawParameters.seatStatus}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, seatStatus: value }));
									}}
									showInputBox={false}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							{t('editor.common.trainInfo.seat2')}
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
							{t('editor.cr.jisuanjikepiao2010.trainInfo.seat3')}
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: '上铺', title: '上铺' },
										{ value: '中铺', title: '中铺' },
										{ value: '下铺', title: '下铺' },
										{ value: '上层', title: '上层' },
										{ value: '下层', title: '下层' },
									]}
									value={drawParameters.seat3}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, seat3: value }));
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.trainInfo.coolerType')}
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: '新空调', title: '新空调' },
										{ value: '空调', title: '空调' },
										{ value: '', title: '空' },
									]}
									value={drawParameters.seatClass.startsWith('空调') ? '空调' : drawParameters.seatClass.startsWith('新空调') ? '新空调' : ''}
									onChange={(value: string) => {
										let seatClassMain = '';
										if (drawParameters.seatClass.startsWith('空调')) {
											seatClassMain = drawParameters.seatClass.replace('空调', '').trim();
										} else if (drawParameters.seatClass.startsWith('新空调')) {
											seatClassMain = drawParameters.seatClass.replace('新空调', '').trim();
										} else {
											seatClassMain = drawParameters.seatClass;
										}
										setDrawParameters((prev) => ({ ...prev, seatClass: value + seatClassMain }));
									}}
								/>
							</div>
						</label>
						<label className="ticket-form-label">
							{t('editor.common.trainInfo.seatClass')}
							<PrettyInputRadioGroup
								list={seatType.map((seatTypeItem) => {
									return { value: seatTypeItem, title: seatTypeItem };
								})}
								value={
									drawParameters.seatClass.startsWith('空调')
										? drawParameters.seatClass.replace('空调', '').trim()
										: drawParameters.seatClass.startsWith('新空调')
										? drawParameters.seatClass.replace('新空调', '').trim()
										: drawParameters.seatClass
								}
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

					<TabBox title={t('editor.common.purchaseInfo.title')} className="flex flex-wrap">
						<label className="ticket-form-label">
							{t('editor.common.purchaseInfo.price')} {drawParameters.isHKWestKowloonStyle ? 'HK＄' : '￥'}
							<input value={drawParameters.price} onChange={(e) => setDrawParameters((prev) => ({ ...prev, price: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							{t('editor.common.purchaseInfo.soldPlace')}
							<input className="" value={drawParameters.soldplace} onChange={(e) => setDrawParameters((prev) => ({ ...prev, soldplace: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							{t('editor.common.purchaseInfo.turnstile')}
							<input className="" value={drawParameters.turnstile} onChange={(e) => setDrawParameters((prev) => ({ ...prev, turnstile: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.rightUpContentText')}
							<div className="flex items-center flex-wrap">
								<PrettyInputRadioGroup
									list={[
										{ value: RightUpContentType.None, title: t('editor.cr.jisuanjikepiao2010.purchaseInfo.rightUpContentTextNotShow') },
										{ value: RightUpContentType.SoldPlace, title: '售票站' },
										{ value: RightUpContentType.Turnstile, title: '检票口' },
										{ value: RightUpContentType.International, title: '国际联运' },
									]}
									value={drawParameters.rightUpContentType}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, rightUpContentType: value as RightUpContentType }));
									}}
									placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
								/>

								<label>
									<Toggle
										value={drawParameters.showSoldPlaceDown}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, showSoldPlaceDown: value }));
										}}
									/>
									<span>{t('editor.cr.jisuanjikepiao2010.purchaseInfo.showSoldPlaceDown')}</span>
								</label>
							</div>
						</label>
						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchaseCertType')}
							<PrettyInputRadioGroup
								list={purchaseCertTypeList}
								value={purchaseCertType}
								onChange={(value: string) => {
									setPurchaseCertType(value);
								}}
								placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
							/>
						</label>
						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchasePassportCode')}
							<PrettyInputRadioGroup
								list={purchasePassportNationList}
								value={purchasePassportCode}
								onChange={(value: string) => {
									setPurchasePassportCode(value);
								}}
								placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
							/>
						</label>

						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.passengerIdNumber')}
							<input value={drawParameters.idNumber} onChange={(e) => setDrawParameters((prev) => ({ ...prev, idNumber: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.passengerName')}
							<div>
								<input value={drawParameters.passenger} onChange={(e) => setDrawParameters((prev) => ({ ...prev, passenger: e.target.value }))} />
								<label>
									<Toggle
										value={drawParameters.doShowPassenger}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, doShowPassenger: value }));
										}}
									/>
									<span>{t('editor.cr.jisuanjikepiao2010.purchaseInfo.showPassengerInfo')}</span>
								</label>
							</div>
						</label>
						<label className="ticket-form-label">
							<div>
								{t('editor.common.purchaseInfo.purchaseMethod')}
								<DescriptionButton>
									<div className="flex flex-row gap-1 flex-wrap">
										{Object.entries(
											purchaseMethodList.reduce<Record<string, PurchaseMethod[]>>((acc, item) => {
												(acc[item.type] ||= []).push(item);
												return acc;
											}, {})
										).map(([type, items]) => (
											<div key={type} className="w-full">
												<div className="text-sm font-semibold mt-2 mb-1">{t(type)}</div>
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
																<span className="text-[12px] text-[#242424]">{t(purchaseMethodItem.desc)}</span>
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
										<div className="text-sm font-semibold mt-1">{t(type)}</div>
										<div className="flex flex-wrap gap-1">
											{items.map((purchaseMethodItem) => {
												const isChecked = drawParameters.purchaseMethod.some((pm) => pm === purchaseMethodItem.title);
												return (
													<label title={t(purchaseMethodItem.desc)} key={purchaseMethodItem.type + '_' + purchaseMethodItem.title} className="flex items-center">
														<input
															type="checkbox"
															checked={isChecked}
															onChange={() => {
																if (isChecked) {
																	setDrawParameters((prev) => ({
																		...prev,
																		purchaseMethod: prev.purchaseMethod.filter((j) => !(j === purchaseMethodItem.title)),
																	}));
																} else {
																	setDrawParameters((prev) => ({ ...prev, purchaseMethod: [...prev.purchaseMethod, purchaseMethodItem.title] }));
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
									<span>{t('editor.cr.jisuanjikepiao2010.purchaseInfo.addCircleToPurchaseMethod')}</span>
								</label>
							</div>
						</label>
						<Divider />
						<label className="ticket-form-label border-t-[solid_1px_#ccc]">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.info1.text')}
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
														placeholder={t('editor.cr.jisuanjikepiao2010.purchaseInfo.info1.inputBox1')}
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
														placeholder={t('editor.cr.jisuanjikepiao2010.purchaseInfo.info1.inputBox2')}
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
														placeholder={t('editor.cr.jisuanjikepiao2010.purchaseInfo.info1.inputBox3')}
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
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.info2')}
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									name="info2"
									list={info2List.map((item) => ({ title: item, value: item }))}
									value={drawParameters.info2}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, info2: value }));
									}}
								/>
							</div>
						</label>
						<Divider />
						<label className="ticket-form-label border-t-[solid_1px_#ccc]">
							{t('editor.cr.jisuanjikepiao2010.purchaseInfo.info3')}
							<div className="flex gap-3 flex-wrap">
								<PrettyInputRadioGroup
									name="info3"
									list={info3List.map((item) => ({ title: item, value: item }))}
									value={drawParameters.info3}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, info3: value }));
									}}
								/>
							</div>
						</label>
					</TabBox>
					<TabBox title={t('editor.cr.jisuanjikepiao2010.ticketNoInfo.title')} className="flex flex-wrap">
						<label className="ticket-form-label">
							{t('editor.common.ticketNoInfo.ticketNo')}
							<div className="flex">
								<input className="text-red-500 w-full" value={drawParameters.ticketNo} onChange={(e) => setDrawParameters((prev) => ({ ...prev, ticketNo: e.target.value }))} />
								<button
									onClick={() => {
										setDrawParameters((prev) => ({ ...prev, ticketNo: getRandomCRTicketNo() }));
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
							{t('editor.cr.jisuanjikepiao2010.ticketNoInfo.ticketSerialCode')}
							<div>
								<input className="w-full" value={drawParameters.serialCode} onChange={(e) => setDrawParameters((prev) => ({ ...prev, serialCode: e.target.value }))} />
								<div className="flex flex-col">
									<div className="flex">
										<label className="flex flex-col">
											TMIS
											<input className="w-[80px]" value={TMIS} onChange={(e) => setTMIS(e.target.value)} />
										</label>
										<label className="flex flex-col">
											{t('editor.cr.jisuanjikepiao2010.purchaseInfo.machineNo')}
											<input className="w-[80px]" value={machineNo} onChange={(e) => setMachineNo(e.target.value)} />
										</label>
										<label className="flex flex-col">
											{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchaseDate')}
											<input className="w-[80px]" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
										</label>
										<label className="flex flex-col">
											<div className="flex items-center">
												{t('editor.common.ticketNoInfo.ticketNo')}
												<button
													className="m-0"
													onClick={() => {
														setDrawParameters((prev) => ({ ...prev, ticketNo: getRandomCRTicketNo() }));
													}}
												>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
														<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
														<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
													</svg>
												</button>
											</div>
											<div className="flex">
												<input
													className="text-red-500 w-[130px]"
													value={drawParameters.ticketNo}
													onChange={(e) => setDrawParameters((prev) => ({ ...prev, ticketNo: e.target.value }))}
												/>
											</div>
										</label>
										<label className="flex flex-col">
											{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchaseCertType')}
											<input className="w-[120px]" value={purchaseCertType} onChange={(e) => setPurchaseCertType(e.target.value)} />
										</label>
										<label className="flex flex-col">
											{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchasePassportCode')}
											<input className="w-[80px]" value={purchasePassportCode} onChange={(e) => setPurchasePassportCode(e.target.value)} />
										</label>
									</div>
									<div>
										<label className="">
											{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchaseCertType')}
											<PrettyInputRadioGroup
												list={purchaseCertTypeList}
												value={purchaseCertType}
												onChange={(value: string) => {
													setPurchaseCertType(value);
												}}
												placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
											/>
										</label>
										<label className="">
											{t('editor.cr.jisuanjikepiao2010.purchaseInfo.purchasePassportCode')}
											<PrettyInputRadioGroup
												list={purchasePassportNationList}
												value={purchasePassportCode}
												onChange={(value: string) => {
													setPurchasePassportCode(value);
												}}
												placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
											/>
										</label>
									</div>
								</div>
							</div>
						</label>
						<label className="ticket-form-label">
							<div>
								<label>
									<span>{t('editor.cr.jisuanjikepiao2010.ticketNoInfo.qrCodeText')}</span>
									<Toggle
										value={drawParameters.doShowQRCode}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, doShowQRCode: value }));
										}}
									/>
								</label>
							</div>
							<textarea className="w-full h-[100px]" value={drawParameters.qrCodeText} onChange={(e) => setDrawParameters((prev) => ({ ...prev, qrCodeText: e.target.value }))} />
						</label>
						<label className="ticket-form-label">
							<div>
								<label>
									<span>{t('editor.cr.jisuanjikepiao2010.ticketNoInfo.message')}</span>
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

								<label>
									<span>{t('editor.cr.jisuanjikepiao2010.ticketNoInfo.showMessageBorder')}</span>
									<Toggle
										value={drawParameters.showMessageBorder}
										onChange={(value) => {
											setDrawParameters((prev) => ({ ...prev, showMessageBorder: value }));
										}}
									/>
								</label>
								<PrettyInputRadioGroup
									list={[
										{ value: TextAlign.Left.toString(), title: t('editor.cr.jisuanjikepiao2010.ticketNoInfo.align.left') },
										{ value: TextAlign.Center.toString(), title: t('editor.cr.jisuanjikepiao2010.ticketNoInfo.align.center') },
										{ value: TextAlign.Right.toString(), title: t('editor.cr.jisuanjikepiao2010.ticketNoInfo.align.right') },
										{ value: TextAlign.JustifyBetween.toString(), title: t('editor.cr.jisuanjikepiao2010.ticketNoInfo.align.justifyBetween') },
										{ value: TextAlign.JustifyEvenly.toString(), title: t('editor.cr.jisuanjikepiao2010.ticketNoInfo.align.justifyEvenly') },
										{ value: TextAlign.JustifyAround.toString(), title: t('editor.cr.jisuanjikepiao2010.ticketNoInfo.align.justifyAround') },
									]}
									value={drawParameters.messageAlign.toString()}
									onChange={(value: string) => {
										setDrawParameters((prev) => ({ ...prev, messageAlign: Number(value) as TextAlign }));
									}}
									placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
									showInputBox={false}
								/>
								<p>{t('editor.cr.jisuanjikepiao2010.ticketNoInfo.presetText')}</p>
								<PrettyInputRadioGroup
									list={messageList.map((messageListItem) => {
										return { value: messageListItem, title: messageListItem.text };
									})}
									value={messageList.find((item) => item.text === drawParameters.message)}
									onChange={(value: (typeof messageList)[0]) => {
										setDrawParameters((prev) => ({ ...prev, message: value.text, messageAlign: value.align, showMessageBorder: value.showBorder }));
									}}
									placeholder={t('SaveImageModal.customizeSizeTab.buttonTitle')}
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
