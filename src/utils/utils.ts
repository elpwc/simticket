import QRCode from 'qrcode';

export const saveCanvasToLocal = (canvas: HTMLCanvasElement | null, filename: string, onSave?: () => void) => {
	if (!canvas) return;

	canvas.toBlob((blob) => {
		if (!blob) return;
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename + '.png';
		a.click();

		URL.revokeObjectURL(url);

		onSave?.();
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
	/** 字间距 */
	letterSpacing: number = 0,
	/** 行间距 相对于字体大小的倍数 */
	lineHeight: number = 1.2,
	/** 文字水平压缩（每个字符独立缩放） */
	charHorizonalScale: number = 1
) => {
	if (!text) return;

	const lines = text.split('\n');
	const fontSize = parseFloat(ctx.font.match(/\d+(\.\d+)?/g)?.[0] || '16');
	const actualLineHeight = fontSize * lineHeight;

	ctx.save();
	ctx.translate(x, y);

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex];
		const chars = [...line];
		const charWidths = chars.map((ch) => ctx.measureText(ch).width * charHorizonalScale);
		const textWidth = charWidths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);

		let scaleX = 1;
		if (!isNaN(w) && textWidth > w) scaleX = w / textWidth;

		ctx.save();
		ctx.scale(scaleX, 1);

		const availableWidth = isNaN(w) ? textWidth : w / scaleX;
		const isJustify = align === TextAlign.JustifyBetween || align === TextAlign.JustifyAround || align === TextAlign.JustifyEvenly;

		let cursorX = 0;

		// 对齐
		if (isJustify && !isNaN(w) && w > 0) {
			if (chars.length === 1) {
				cursorX = (availableWidth - charWidths[0]) / 2;
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

				cursorX = leftPadding;

				for (let i = 0; i < chars.length; i++) {
					const ch = chars[i];
					ctx.save();
					ctx.translate(cursorX, 0);
					ctx.scale(charHorizonalScale, 1);
					method === DrawTextMethod.fillText ? ctx.fillText(ch, 0, 0) : ctx.strokeText(ch, 0, 0);
					ctx.restore();
					cursorX += charWidths[i] + gap;
				}

				ctx.restore();
				ctx.translate(0, actualLineHeight);
				continue;
			}
		} else {
			// 非 Justify 对齐
			switch (align) {
				case TextAlign.Center:
					cursorX = (availableWidth - textWidth) / 2;
					break;
				case TextAlign.Right:
					cursorX = availableWidth - textWidth;
					break;
				case TextAlign.Left:
				default:
					cursorX = 0;
					break;
			}
		}

		// 绘
		for (let i = 0; i < chars.length; i++) {
			const ch = chars[i];
			ctx.save();
			ctx.translate(cursorX, 0);
			ctx.scale(charHorizonalScale, 1);
			method === DrawTextMethod.fillText ? ctx.fillText(ch, 0, 0) : ctx.strokeText(ch, 0, 0);
			ctx.restore();

			cursorX += charWidths[i] + letterSpacing;
		}

		ctx.restore();
		ctx.translate(0, actualLineHeight);
	}

	ctx.restore();
};

export function drawCarbonText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string = 'sans-serif', fillStyle: string = 'black', scale: number = 1, widthPX: number = 2) {
	const { width, height } = ctx.canvas;
	const boxWidth = Math.round(scale * widthPX);

	const tmpCanvas = document.createElement('canvas');
	tmpCanvas.width = width * scale;
	tmpCanvas.height = height * scale;
	const tmpCtx = tmpCanvas.getContext('2d')!;
	tmpCtx.clearRect(0, 0, width, height);

	tmpCtx.font = font;
	tmpCtx.fillStyle = fillStyle;
	tmpCtx.textBaseline = 'alphabetic';
	tmpCtx.fillText(text, x, y);

	const imgData = tmpCtx.getImageData(0, 0, width, height);
	const data = imgData.data;
	if (boxWidth > 0) {
		const newImage = tmpCtx.createImageData(width, height);
		const newData = newImage.data;

		for (let by = 0; by < height; by += boxWidth) {
			for (let bx = 0; bx < width; bx += boxWidth) {
				let sum = 0;
				const count = boxWidth ** 2;
				for (let yy = 0; yy < boxWidth; yy++) {
					for (let xx = 0; xx < boxWidth; xx++) {
						const px = (bx + xx + (by + yy) * width) * 4;
						if (px >= data.length) continue;
						const a = data[px + 3];
						if (a > 0) {
							// const r = data[px];
							// const g = data[px + 1];
							// const b = data[px + 2];
							sum += 1;
						}
					}
				}

				if (count === 0) continue;
				const avg: number = sum / count;
				const isBlack = avg > 0.7; // 黑度阈值

				for (let yy = 0; yy < boxWidth; yy++) {
					for (let xx = 0; xx < boxWidth; xx++) {
						const px = (bx + xx + (by + yy) * width) * 4;
						if (px >= newData.length) continue;
						if (isBlack) {
							newData[px] = 0;
							newData[px + 1] = 0;
							newData[px + 2] = 0;
							newData[px + 3] = 255;
						} else {
							newData[px + 3] = 0; // 透明
						}
					}
				}
			}
		}
		tmpCtx.putImageData(newImage, 0, 0);
	} else {
		tmpCtx.putImageData(imgData, 0, 0);
	}
	ctx.drawImage(tmpCanvas, 0, 0);
}

/** unused */
export const drawTextNew = (
	ctx: CanvasRenderingContext2D,
	text: string,
	font: string = 'sans-serif',
	fillStyle: string = 'black',
	x: number,
	y: number,
	w: number = NaN,
	align: TextAlign = TextAlign.Left,
	method: DrawTextMethod = DrawTextMethod.fillText,
	/** 字间距 */
	letterSpacing: number = 0,
	/** 行间距 相对于字体大小的倍数*/
	lineHeight: number = 1.2,
	scale: number = 1,
	widthPX: number = 2
) => {
	if (!text) return;

	ctx.save();
	ctx.translate(x, y);

	const { width, height } = ctx.canvas;
	const boxWidth = Math.round(scale * widthPX);

	const tmpCanvas = document.createElement('canvas');
	tmpCanvas.width = width * scale;
	tmpCanvas.height = height * scale;
	const tmpCtx = tmpCanvas.getContext('2d')!;
	tmpCtx.clearRect(0, 0, width, height);

	tmpCtx.font = font;
	tmpCtx.fillStyle = fillStyle;
	//const fillStyleColorRBG = converter.('#B8860B').to('RGB', false);

	if (isNaN(lineHeight) && lineHeight < 0) lineHeight = 1.2;

	const lines = text.split('\n');
	const fontSize = parseFloat(tmpCtx.font.match(/\d+(\.\d+)?/g)?.[0] || '16');
	const actualLineHeight = fontSize * lineHeight;

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex];
		const chars = [...line];
		const charWidths = chars.map((ch) => tmpCtx.measureText(ch).width);
		const textWidth = charWidths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);

		let scaleX = 1;
		if (!isNaN(w) && w > 0 && textWidth > w) scaleX = w / textWidth;

		tmpCtx.save();
		tmpCtx.scale(scaleX, 1);

		const availableWidth = isNaN(w) ? textWidth : w / scaleX;
		const isJustify = align === TextAlign.JustifyBetween || align === TextAlign.JustifyAround || align === TextAlign.JustifyEvenly;

		let cursorX = 0;

		// 对齐
		if (isJustify && !isNaN(w)) {
			if (chars.length === 1) {
				cursorX = (availableWidth - charWidths[0]) / 2;
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

				cursorX = leftPadding;

				for (let i = 0; i < chars.length; i++) {
					const ch = chars[i];
					method === DrawTextMethod.fillText ? tmpCtx.fillText(ch, cursorX, 0) : tmpCtx.strokeText(ch, cursorX, 0);
					cursorX += charWidths[i] + gap;
				}

				continue;
			}
		} else {
			// 非 Justify 对齐
			switch (align) {
				case TextAlign.Center:
					cursorX = (availableWidth - textWidth) / 2;
					break;
				case TextAlign.Right:
					cursorX = availableWidth - textWidth;
					break;
				case TextAlign.Left:
				default:
					cursorX = 0;
					break;
			}
		}

		// 绘
		for (let i = 0; i < chars.length; i++) {
			const ch = chars[i];
			method === DrawTextMethod.fillText ? tmpCtx.fillText(ch, cursorX, 0) : tmpCtx.strokeText(ch, cursorX, 0);
			cursorX += charWidths[i] + letterSpacing;
		}

		tmpCtx.restore();
		tmpCtx.translate(0, actualLineHeight);
	}

	const imgData = tmpCtx.getImageData(0, 0, width, height);
	const data = imgData.data;
	if (boxWidth > 0) {
		const newImage = tmpCtx.createImageData(width, height);
		const newData = newImage.data;

		for (let by = 0; by < height; by += boxWidth) {
			for (let bx = 0; bx < width; bx += boxWidth) {
				let sum = 0;
				const count = boxWidth ** 2;
				for (let yy = 0; yy < boxWidth; yy++) {
					for (let xx = 0; xx < boxWidth; xx++) {
						const px = (bx + xx + (by + yy) * width) * 4;
						if (px >= data.length) continue;
						const a = data[px + 3];
						if (a > 0) {
							// const r = data[px];
							// const g = data[px + 1];
							// const b = data[px + 2];
							sum += 1;
							console.log(sum);
						}
					}
				}

				if (count === 0) continue;
				const avg: number = sum / count;
				const isColored = avg > 0.7; // 黑度阈值

				for (let yy = 0; yy < boxWidth; yy++) {
					for (let xx = 0; xx < boxWidth; xx++) {
						const px = (bx + xx + (by + yy) * width) * 4;
						if (px >= newData.length) continue;
						if (isColored) {
							newData[px] = 0;
							newData[px + 1] = 0;
							newData[px + 2] = 0;
							newData[px + 3] = 255;
						} else {
							newData[px + 3] = 0; // 透明
						}
					}
				}
			}
		}
		tmpCtx.putImageData(newImage, 0, 0);
	} else {
		tmpCtx.putImageData(imgData, 0, 0);
	}
	ctx.drawImage(tmpCanvas, 0, 0);

	ctx.restore();
};

/**
 * 簡単にフォントリストをロード
 * @param fontList
 * @param onLoadStart
 * @param onLoadEnd
 * @param onNotNeeded
 */
export const fontsLoader = (fontList: { name: string; file: string }[], onLoadStart: () => void, onLoadEnd: () => void, onNotNeeded: () => void) => {
	const loadFonts = async () => {
		const fonts = fontList.map((font) => new FontFace(font.name, `url(${font.file})`));

		await Promise.all(fonts.map((f) => f.load()));
		fonts.forEach((f) => document.fonts.add(f));
	};
	if (fontList.every((font) => document.fonts.check(`1em ${font.name}`))) {
		onNotNeeded();
	} else {
		onLoadStart();
		loadFonts().finally(() => onLoadEnd());
	}
};

export interface TicketListItemProperty {
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
}
