import { JRTicketTitles, JRTicketTypesettingtype, JRWideTicketDrawParameters } from './type';

// このファイルにあるパラメーターの順序は※絶対※に変更してはいけません
// このファイルにあるパラメーターの順序は※絶対※に変更してはいけません

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
		+p.isKaisukenArrow,
		p.date,
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
		+p.is120mm,
		+p.hasSinkansen,
		p.titleUnderlineStyle,
		p.sinkansenRange1,
		p.sinkansenRange2,
		p.sinkansenRange3,
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
		is120mm,
		hasSinkansen,
		titleUnderlineStyle,
		sinkansenRange1,
		sinkansenRange2,
		sinkansenRange3,
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
		date: date,
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
		is120mm: !!is120mm,
		hasSinkansen: !!hasSinkansen,
		titleUnderlineStyle,
		sinkansenRange1,
		sinkansenRange2,
		sinkansenRange3,
	} as JRWideTicketDrawParameters;
}

export const getJRPrintingTicketTitleByTicketType = (ticketType: string) => {
	const index = JRTicketTitles.findIndex((title) => {
		return title.name === ticketType;
	});
	if (index !== -1) {
		return JRTicketTitles[index];
	}
	let res = '';
	if (ticketType.includes('(')) {
		const splited = ticketType.split('(');
		if (splited[0].length <= 6) {
			res += [...splited[0]].join('　') + ' (' + splited[1];
		} else {
			res = ticketType;
		}
	} else {
		if (ticketType.length <= 6) {
			res += [...ticketType].join('　');
		} else {
			res = ticketType;
		}
	}

	return {
		name: ticketType,
		printingName: res,
		desc: '',
		typeset: JRTicketTypesettingtype.Fare,
		typeset120: JRTicketTypesettingtype.Fare,
	};
};

export const getJRPrintingTicketTitleUnchinkasanAsteriskNum = (title: string) => {
	if (title.replaceAll('　', '').includes('乗車券') && (title.replaceAll('　', '').includes('特急券') || title.replaceAll('　', '').includes('急行券'))) {
		const len = title.length;
		if (len <= 17) {
			if (['乗　車　券　・　特　急　券', '乗　車　券　・　急　行　券'].includes(title)) {
				return 5;
			} else {
				return 17 - len;
			}
		}
	}
	return 0;
};
