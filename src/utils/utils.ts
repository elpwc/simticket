import QRCode from 'qrcode';

export const saveCanvasToLocal = (canvas: HTMLCanvasElement | null, filename: string) => {
	if (!canvas) return;

	canvas.toBlob((blob) => {
		if (!blob) return;
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename + '.png';
		a.click();

		URL.revokeObjectURL(url);
	}, 'image/png');
};

export const drawQRCode = async (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, text: string) => {
	try {
		const qrDataUrl = await QRCode.toDataURL(text, {
			color: {
				dark: '#000000',
				light: '#00000000',
			},
		});

		const img = new Image();
		img.src = qrDataUrl;
		img.onload = () => {
			ctx.drawImage(img, x, y, size, size);
		};
	} catch (err) {
		console.error(err);
	}
};
export enum TextAlign {
	Left,
	Right,
	Center,
	JustifyBetween, // space-between
	JustifyAround, // space-around
	JustifyEvenly, // space-evenly
}

export enum DrawTextMethod {
	fillText,
	strokeText,
}

export const drawText = (
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	w: number = NaN,
	align: TextAlign = TextAlign.Left,
	method: DrawTextMethod = DrawTextMethod.fillText,
	letterSpacing: number = 0
) => {
	if (!text) return;

	const chars = [...text];
	const charWidths = chars.map((ch) => ctx.measureText(ch).width);

	const textWidth = charWidths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);

	let scaleX = 1;
	if (!isNaN(w) && textWidth > w) scaleX = w / textWidth;

	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scaleX, 1);

	const availableWidth = isNaN(w) ? textWidth : w / scaleX;
	const isJustify = align === TextAlign.JustifyBetween || align === TextAlign.JustifyAround || align === TextAlign.JustifyEvenly;

	if (isJustify && !isNaN(w)) {
		if (chars.length === 1) {
			const singleOffset = (availableWidth - charWidths[0]) / 2;
			method === DrawTextMethod.fillText ? ctx.fillText(chars[0], singleOffset, 0) : ctx.strokeText(chars[0], singleOffset, 0);
		} else {
			const baseWidth = charWidths.reduce((a, b) => a + b, 0);
			const totalGap = availableWidth - baseWidth;

			let leftPadding = 0;
			let gap = 0;

			switch (align) {
				case TextAlign.JustifyBetween:
					leftPadding = 0;
					gap = totalGap / (chars.length - 1);
					break;
				case TextAlign.JustifyAround:
					gap = totalGap / chars.length;
					leftPadding = gap / 2;
					break;
				case TextAlign.JustifyEvenly:
					gap = totalGap / (chars.length + 1);
					leftPadding = gap;
					break;
			}

			let cursor = leftPadding;
			for (let i = 0; i < chars.length; i++) {
				const ch = chars[i];
				method === DrawTextMethod.fillText ? ctx.fillText(ch, cursor, 0) : ctx.strokeText(ch, cursor, 0);
				cursor += charWidths[i] + gap;
			}
		}

		ctx.restore();
		return;
	}

	//非 justify
	let cursorX = 0;
	switch (align) {
		case TextAlign.Right:
			cursorX = availableWidth - textWidth;
			break;
		case TextAlign.Center:
			cursorX = (availableWidth - textWidth) / 2;
			break;
		case TextAlign.Left:
		default:
			cursorX = 0;
			break;
	}

	let cursor = cursorX;
	for (let i = 0; i < chars.length; i++) {
		const ch = chars[i];
		method === DrawTextMethod.fillText ? ctx.fillText(ch, cursor, 0) : ctx.strokeText(ch, cursor, 0);
		cursor += charWidths[i] + letterSpacing;
	}

	ctx.restore();
};

export const CR_TRAIN_TYPES = [
	{ value: 'G', desc: '高铁' },
	{ value: 'D', desc: '动车' },
	{ value: 'C', desc: '城际' },
	{ value: 'S', desc: '市郊' },
	{ value: 'Z', desc: '直达' },
	{ value: 'T', desc: '特快' },
	{ value: 'K', desc: '快速' },
	{ value: 'N', desc: '管内快速' },
	{ value: 'Y', desc: '旅游' },
	{ value: 'L', desc: '临时' },
	{ value: 'A', desc: '临时特快' },
	{ value: 'I', desc: 'D代用' },
	{ value: 'P', desc: 'Z代用' },
	{ value: 'Q', desc: 'T代用' },
	{ value: 'W', desc: 'K代用' },
	{ value: 'V', desc: '普代用' },
	{ value: '青', desc: '' },
	{ value: '藏', desc: '' },
];

export const CR_TRAIN_TYPE_ARRAY = CR_TRAIN_TYPES.map((type) => type.value);
