import { JRWideTicketDrawParameters } from './type';

export function encodeJRWideTicketParams(p: JRWideTicketDrawParameters): string {
	const arr: any[] = [
		p.background,
		+p.showBorder,
		p.offsetX,
		p.offsetY,
		+p.showWatermark,
		p.watermark,
		p.ticketNo,
		p.station1,
		p.station2,
		p.station1en,
		p.station2en,
		p.station1AreaChar,
		p.station2AreaChar,
		p.station1Type,
		p.station2Type,
		+p.doShowEnglish,
		p.date.toISOString(),
		p.time,
		p.carriage,
		p.seat1,
		p.seat2,
		p.seat3,
		p.seatClass,
		p.price,
		p.soldplace,
		p.serialCode,
		+p.noSeat,
		+p.noCarriage,
		p.info1,
		p.railways,
		p.paymentMethod,
	];

	// JSON → UTF-8 → Base64 (URL safe)
	const json = JSON.stringify(arr);
	const bytes = new TextEncoder().encode(json);
	const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
	const b64 = btoa(binary);

	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeJRWideTicketParams(str: string): JRWideTicketDrawParameters {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const binary = Buffer.from(base64, 'base64').toString('binary'); // browser method: atob(base64);
	const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
	const json = new TextDecoder().decode(bytes);
	const arr = JSON.parse(json);

	const [
		background,
		showBorder,
		offsetX,
		offsetY,
		showWatermark,
		watermark,
		ticketNo,
		station1,
		station2,
		station1en,
		station2en,
		station1AreaChar,
		station2AreaChar,
		station1Type,
		station2Type,
		doShowEnglish,
		isKaisukenArrow,
		date,
		time,
		carriage,
		seat1,
		seat2,
		seat3,
		seatClass,
		price,
		soldplace,
		serialCode,
		noSeat,
		noCarriage,
		info1,
		railways,
		paymentMethod,
	] = arr;

	return {
		background,
		showBorder: !!showBorder,
		offsetX,
		offsetY,
		showWatermark: !!showWatermark,
		watermark,
		ticketNo,
		station1,
		station2,
		station1en,
		station2en,
		station1AreaChar,
		station2AreaChar,
		station1Type,
		station2Type,
		doShowEnglish: !!doShowEnglish,
		isKaisukenArrow: !!isKaisukenArrow,
		date: new Date(date),
		time,
		carriage,
		seat1,
		seat2,
		seat3,
		seatClass,
		price,
		soldplace,
		serialCode,
		noSeat: !!noSeat,
		noCarriage: !!noCarriage,
		info1,
		railways,
		paymentMethod,
	} as JRWideTicketDrawParameters;
}
