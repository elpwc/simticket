import { CRWideTicketDrawParameters } from './type';

export function encodeCRWideTicketParams(p: CRWideTicketDrawParameters): string {
	const arr: any[] = [
		p.background,
		+p.showBorder,
		+p.isHKWestKowloonStyle,
		p.offsetX,
		p.offsetY,
		+p.showWatermark,
		p.watermark,
		p.ticketNo,
		p.station1,
		p.station2,
		p.station1en,
		p.station2en,
		+p.doShowZhan,
		+p.doShowEnglish,
		+p.doUseHuaWenXinWei1,
		+p.doUseHuaWenXinWei2,
		p.routeIdentifier,
		p.date.toISOString(),
		p.time,
		p.carriage,
		p.seat1,
		p.seat2,
		p.seat3,
		p.seatClass,
		p.price,
		p.idNumber,
		p.passenger,
		+p.doShowPassenger,
		p.soldplace,
		p.turnstile,
		+p.showSoldPlaceDown,
		p.rightUpContentType,
		p.serialCode,
		p.qrCodeText,
		+p.doShowQRCode,
		p.purchaseMethod,
		+p.doPurchaseMethodHaveCircle,
		+p.noSeat,
		+p.noCarriage,
		p.info1,
		p.info2,
		p.info3,
		p.message,
		p.messageAlign,
		+p.doShowMessage,
		p.info1TrainType,
		p.info1from,
		p.info1to,
	];

	// JSON → UTF-8 → Base64 (URL safe)
	const json = JSON.stringify(arr);
	const bytes = new TextEncoder().encode(json);
	const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
	const b64 = btoa(binary);

	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeCRWideTicketParams(str: string): CRWideTicketDrawParameters {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const binary = Buffer.from(base64, 'base64').toString('binary');
	const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
	const json = new TextDecoder().decode(bytes);
	const arr = JSON.parse(json);

	const [
		background,
		showBorder,
		isHKWestKowloonStyle,
		offsetX,
		offsetY,
		showWatermark,
		watermark,
		ticketNo,
		station1,
		station2,
		station1en,
		station2en,
		doShowZhan,
		doShowEnglish,
		doUseHuaWenXinWei1,
		doUseHuaWenXinWei2,
		routeIdentifier,
		date,
		time,
		carriage,
		seat1,
		seat2,
		seat3,
		seatClass,
		price,
		idNumber,
		passenger,
		doShowPassenger,
		soldplace,
		turnstile,
		showSoldPlaceDown,
		rightUpContentType,
		serialCode,
		qrCodeText,
		doShowQRCode,
		purchaseMethod,
		doPurchaseMethodHaveCircle,
		noSeat,
		noCarriage,
		info1,
		info2,
		info3,
		message,
		messageAlign,
		doShowMessage,
		info1TrainType,
		info1from,
		info1to,
	] = arr;

	return {
		background,
		showBorder: !!showBorder,
		isHKWestKowloonStyle: !!isHKWestKowloonStyle,
		offsetX,
		offsetY,
		showWatermark: !!showWatermark,
		watermark,
		ticketNo,
		station1,
		station2,
		station1en,
		station2en,
		doShowZhan: !!doShowZhan,
		doShowEnglish: !!doShowEnglish,
		doUseHuaWenXinWei1: !!doUseHuaWenXinWei1,
		doUseHuaWenXinWei2: !!doUseHuaWenXinWei2,
		routeIdentifier,
		date: new Date(date),
		time,
		carriage,
		seat1,
		seat2,
		seat3,
		seatClass,
		price,
		idNumber,
		passenger,
		doShowPassenger: !!doShowPassenger,
		soldplace,
		turnstile,
		showSoldPlaceDown: !!showSoldPlaceDown,
		rightUpContentType,
		serialCode,
		qrCodeText,
		doShowQRCode: !!doShowQRCode,
		purchaseMethod,
		doPurchaseMethodHaveCircle: !!doPurchaseMethodHaveCircle,
		noSeat: !!noSeat,
		noCarriage: !!noCarriage,
		info1,
		info2,
		info3,
		message,
		messageAlign,
		doShowMessage: !!doShowMessage,
		info1TrainType,
		info1from,
		info1to,
	} as CRWideTicketDrawParameters;
}

export const getRandomCRTicketNo = () => {
	const pre = Math.floor(Math.random() * 200).toString();
	const alphabetPosition = Math.floor(Math.random() * 26);
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(alphabetPosition, alphabetPosition + 1);
	const no = Math.floor(Math.random() * 99999)
		.toString()
		.padStart(6, '0');

	return (Math.random() > 0.1 ? (Math.random() > 0.6 ? pre : '') + alphabet : '') + no;
};
