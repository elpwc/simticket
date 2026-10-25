import { getInitialMethods } from '@/components/TicketEditorCompo/TicketEditorTemplate';
import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRWideTicketDrawParameters } from './type';
import {
	JRWideTicketDrawParametersInitialValues,
	JR_MARS_120_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_120_PAPER_TICKET_SIZE,
	JR_MARS_PAPER_TICKET_CANVAS_SIZE,
	JR_MARS_PAPER_TICKET_SIZE,
} from './value';
import { fontsLoader } from '@/utils/utils';
import jr_h from '../../../assets/tickets/jr_h.jpg';
import jr_e from '../../../assets/tickets/jr_e.jpg';
import jr_c from '../../../assets/tickets/jr_c.jpg';
import jr_w from '../../../assets/tickets/jr_w.jpg';
import jr_s from '../../../assets/tickets/jr_s.jpg';
import jr_k from '../../../assets/tickets/jr_k.jpg';
import jr_e_120 from '../../../assets/tickets/jr_e_120.jpg';
import localFonts from 'next/font/local';
import { createJRScaleFns, JRDrawerContext } from './drawerForEachTicketVersion/drawerUtils';
import { drawDefaultJRWideTicketFace, drawDefaultJRWideTicketFlip } from './drawerForEachTicketVersion/defaultDrawer';

export const DotFont = localFonts({
	//src: '../../assets/fonts/simsun.woff2',
	src: '../../../assets/fonts/JF-Dot-Izumi16.woff2',
	//src: '../../../assets/fonts/JF-Dot-Ayu20.woff2',
});

export const drawJRWideTicket = (
	canvas: HTMLCanvasElement | null,
	width: number,
	height: number,
	ctx: CanvasRenderingContext2D | null,
	partialDrawParameters: Partial<JRWideTicketDrawParameters>,
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
	if (!ctx || !canvas) {
		return;
	}

	fontsLoader(
		[{ name: 'DotFont', file: '../../../assets/fonts/JF-Dot-Izumi16.woff2' }],
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

	const is120mm = partialDrawParameters.is120mm === true;

	const w = canvas.width > width ? canvas.width : width;
	const h = canvas.height > height ? canvas.height : height;

	const drawParameters: JRWideTicketDrawParameters = {
		...JRWideTicketDrawParametersInitialValues,
		...partialDrawParameters,
	};
	if (initialMethods === undefined) {
		if (is120mm) {
			initialMethods = getInitialMethods(
				width || JR_MARS_120_PAPER_TICKET_CANVAS_SIZE[0],
				height || JR_MARS_120_PAPER_TICKET_CANVAS_SIZE[1],
				JR_MARS_120_PAPER_TICKET_SIZE[0],
				JR_MARS_120_PAPER_TICKET_SIZE[1],
				1,
			);
		} else {
			initialMethods = getInitialMethods(
				width || JR_MARS_PAPER_TICKET_CANVAS_SIZE[0],
				height || JR_MARS_PAPER_TICKET_CANVAS_SIZE[1],
				JR_MARS_PAPER_TICKET_SIZE[0],
				JR_MARS_PAPER_TICKET_SIZE[1],
				1,
			);
		}
	}

	const { resizedScaleX, resizedScaleY, offsetScaleX, offsetScaleY, resizedFont } = createJRScaleFns(initialMethods, drawParameters);

	const bg = new Image();
	if (is120mm) {
		switch (drawParameters.background) {
			case JRTicketBackGround.JR_H:
				bg.src = jr_h.src;
				break;
			case JRTicketBackGround.JR_E:
				bg.src = jr_e_120.src;
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
	} else {
		switch (drawParameters.background) {
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
	}

	const drawerContext: JRDrawerContext = {
		ctx,
		drawParameters,
		resizedScaleX,
		resizedScaleY,
		offsetScaleX,
		offsetScaleY,
		resizedFont,
		w,
		h,
		is120mm,
		bg,
		onDone,
	};

	if (isFlip) {
		onBgImageLoadStart?.();
		drawDefaultJRWideTicketFlip(drawerContext);
		onBgImageLoaded?.();
	} else {
		onBgImageLoadStart?.();
		switch (drawParameters.background) {
			case JRTicketBackGround.JR_H:
			case JRTicketBackGround.JR_E:
			case JRTicketBackGround.JR_C:
			case JRTicketBackGround.JR_W:
			case JRTicketBackGround.JR_S:
			case JRTicketBackGround.JR_K:
				// 有背景的
				bg.onload = () => {
					onBgImageLoaded?.();
					drawDefaultJRWideTicketFace(drawerContext);
				};
				break;
			case JRTicketBackGround.JR_Empty:
				onBgImageLoaded?.();
				drawDefaultJRWideTicketFace(drawerContext);
				break;
		}
	}
};
