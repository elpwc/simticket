'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import TicketEditorTemplate from '../../TicketEditorCompo/TicketEditorTemplate';
import { decodeTicket } from '@/utils/utils';
import TitleContainer from '../../InfrastructureCompo/TitleContainer';
import {
	CRPresetStations,
	CRWideTicketDrawParametersInitialValues,
	MAG_TICKET_CANVAS_SIZE,
	PAPER_TICKET_CANVAS_SIZE,
	PAPER_TICKET_SIZE,
} from './value';
import { CRTicketBackGround, CRWideTicketDrawParameters, CRWideTicketVersion } from './type';
import { drawCRWideTicket } from './draw';
export { HuawenXinwei, SongTi, SongTiEn, HeiTi, TicketNoFont, TrainCodeFont } from './draw';
import { AppContext } from '@/app/app';
import { useLocale } from '@/utils/hooks/useLocale';
import { useSearchParams } from 'next/navigation';
import { CRWideTicketVersionSelector } from './CRWideTicketVersionSelector';
import { DefaultEditor } from './editorForEachTicketVersion/DefaultEditor';
import { Ver1996Editor } from './editorForEachTicketVersion/Ver1996Editor';

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

	const [drawParameters, setDrawParameters] = useState<CRWideTicketDrawParameters>(() =>
		copyEditingTicketDataToDrawParameters && editingTicketData ? structuredClone(editingTicketData) : getInitialValues(),
	);

	const [offsetContent, setOffsetContent] = useState([drawParameters.offsetX.toString(), (0 - drawParameters.offsetY).toString()]);
	const [TMIS, setTMIS] = useState(drawParameters.serialCode.slice(0, 5));
	const [machineNo, setMachineNo] = useState(drawParameters.serialCode.slice(5, 10));
	const [purchaseDate, setPurchaseDate] = useState(drawParameters.serialCode.slice(10, 14));

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
			serialCode: `${TMIS}${machineNo}${purchaseDate}${drawParameters.ticketNo}`,
		}));
	}, [TMIS, machineNo, purchaseDate, drawParameters.ticketNo]);

	useEffect(() => {
		if (copyEditingTicketDataToDrawParameters && editingTicketData) {
			setDrawParameters(structuredClone(editingTicketData));
			setCopyEditingTicketDataToDrawParameters(false);
		}
	}, [copyEditingTicketDataToDrawParameters, editingTicketData, setCopyEditingTicketDataToDrawParameters]);

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
			},
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
	}, [drawTicket,drawParameters.version, size, canvasSize, drawParameters, isFontLoading]);

	// 下のリスト更新（列表导入期间跳过，避免用 getInitialValues 覆盖待载入数据）
	useEffect(() => {
		if (copyEditingTicketDataToDrawParameters) return;
		setEditingTicketData(drawParameters);
	}, [drawParameters, copyEditingTicketDataToDrawParameters, setEditingTicketData]);

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
				font: (size: number, fontName: string, isBold?: boolean) => string,
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
				<div>
					<TitleContainer title={t('editor.cr.jisuanjikepiao2010.version.title')} className="flex flex-wrap gap-2">
						<CRWideTicketVersionSelector
							value={drawParameters.version}
							onChange={(value: CRWideTicketVersion) =>
								setDrawParameters((prev) => ({
									...prev,
									version: value,
								}))
							}
						/>
					</TitleContainer>
					{
						(() => {switch(drawParameters.version) {
							case CRWideTicketVersion.Default:
								return <DefaultEditor
									drawParameters={drawParameters}
									setDrawParameters={setDrawParameters}
									offsetContent={offsetContent}
									setOffsetContent={setOffsetContent}
									TMIS={TMIS}
									setTMIS={setTMIS}
									machineNo={machineNo}
									setMachineNo={setMachineNo}
									purchaseDate={purchaseDate}
									setPurchaseDate={setPurchaseDate}
								/>
							case CRWideTicketVersion.V1996:
								return <Ver1996Editor
									drawParameters={drawParameters}
									setDrawParameters={setDrawParameters}
									offsetContent={offsetContent}
									setOffsetContent={setOffsetContent}
									TMIS={TMIS}
									setTMIS={setTMIS}
									machineNo={machineNo}
									setMachineNo={setMachineNo}
									purchaseDate={purchaseDate}
									setPurchaseDate={setPurchaseDate}
								/>
							default:
								return <DefaultEditor
								drawParameters={drawParameters}
								setDrawParameters={setDrawParameters}
								offsetContent={offsetContent}
								setOffsetContent={setOffsetContent}
								TMIS={TMIS}
								setTMIS={setTMIS}
								machineNo={machineNo}
								setMachineNo={setMachineNo}
								purchaseDate={purchaseDate}
								setPurchaseDate={setPurchaseDate}
							/>;
						}})()

					}
				</div>
			}
		/>
	);
}
