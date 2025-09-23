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
