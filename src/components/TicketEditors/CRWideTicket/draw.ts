import { fontsLoader } from '@/utils/utils';
import { CRTicketBackGround, CRWideTicketDrawParameters, CRWideTicketVersion } from './type';
import { CRWideTicketDrawParametersInitialValues, MAG_TICKET_CANVAS_SIZE, PAPER_TICKET_CANVAS_SIZE, PAPER_TICKET_SIZE } from './value';
import cr_red from '../../../assets/tickets/cr_red.png';
import cr_blue from '../../../assets/tickets/cr_blue.png';
import cr_mag_blue from '../../../assets/tickets/cr_mag_blue.png';
import cr_mag_red from '../../../assets/tickets/cr_mag_red.png';
import { getInitialMethods } from '@/components/TicketEditorCompo/TicketEditorTemplate';
import localFonts from 'next/font/local';
import { BackgroundImageType, createCRScaleFns, CRDrawerContext } from './drawerForEachTicketVersion/drawerUtils';
import { drawDefaultCRWideTicketFace, drawDefaultCRWideTicketFlip } from './drawerForEachTicketVersion/defaultDrawer';

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
	onBgImageLoaded?: () => void,
	onFontLoadStart?: () => void,
	onFontLoaded?: () => void,
) => {
	if (!ctx || !canvas) return;

	fontsLoader(
		[
			{ name: 'HuawenXinwei', file: '../../../assets/fonts/STXINWEI.woff2' },
			{ name: 'SongTi', file: '../../../assets/fonts/LXGWNeoZhiSong.woff2' },
			{ name: 'SongTiEn', file: '../../../assets/fonts/NimbusRomNo9L-Regu.woff2' },
			{ name: 'HeiTi', file: '../../../assets/fonts/simhei.woff2' },
			{ name: 'TicketNoFont', file: '../../../assets/fonts/cr_ticketNo.woff2' },
			{ name: 'TrainCodeFont', file: '../../../assets/fonts/traincode.woff2' },
		],
		() => {
			onFontLoadStart?.();
		},
		() => {
			onFontLoaded?.();
		},
		() => {
			onFontLoaded?.();
		},
	);

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
	/** 车票是红票还是蓝票 */
	let isBackgroundImageType = BackgroundImageType.Mag;
	switch (drawParameters.background) {
		case CRTicketBackGround.SoftRed:
			bg.src = cr_red.src;
			isBackgroundImageType = BackgroundImageType.Soft;
			break;
		case CRTicketBackGround.SoftBlue:
			bg.src = cr_blue.src;
			isBackgroundImageType = BackgroundImageType.Soft;
			break;
		case CRTicketBackGround.MagRed:
			bg.src = cr_mag_red.src;
			isBackgroundImageType = BackgroundImageType.Mag;
			break;
		case CRTicketBackGround.MagBlue:
			bg.src = cr_mag_blue.src;
			isBackgroundImageType = BackgroundImageType.Mag;
			break;
		case CRTicketBackGround.MagNoneBackground:
			isBackgroundImageType = BackgroundImageType.Mag;
			break;
		case CRTicketBackGround.SoftNoneBackground:
			isBackgroundImageType = BackgroundImageType.Soft;
			break;
	}

	const { resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY, resizedFont } = createCRScaleFns(initialMethods, isBackgroundImageType, drawParameters, backgroundEdgeHori, backgroundEdgeVert);

	const drawerContext: CRDrawerContext = {
		ctx,
		drawParameters,
		resizedScaleX,
		resizedScaleY,
		offsetScaleX,
		offsetScaleY,
		resizedFont,
		w,
		h,
		isMag,
		isBackgroundImageType,
		backgroundEdgeHori,
		backgroundEdgeVert,
		bg,
		onDone,
	};

	const drawByVersion = () => {
		switch (drawParameters.version) {
			case CRWideTicketVersion.Default:
			default:
				drawDefaultCRWideTicketFace(drawerContext);
				break;
		}
	};

	const drawFlipByVersion = () => {
		switch (drawParameters.version) {
			case CRWideTicketVersion.Default:
			default:
				drawDefaultCRWideTicketFlip(drawerContext);
				break;
		}
	};

	if (isFlip) {
		onBgImageLoadStart?.();
		drawFlipByVersion();
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
					drawByVersion();
				};
				break;
			case CRTicketBackGround.MagNoneBackground:
			case CRTicketBackGround.SoftNoneBackground:
				onBgImageLoaded?.();
				drawByVersion();
				break;
		}
	}
};
