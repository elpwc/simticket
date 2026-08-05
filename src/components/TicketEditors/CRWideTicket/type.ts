import { TextAlign } from '@/utils/utils';

export const enum RightUpContentType {
	None = 'none',
	SoldPlace = 'soldplace',
	Turnstile = 'turnstile',
	International = 'international',
	Chebu = 'chebu',
	Zhanbu = 'zhanbu',
}

export enum CRTicketBackGround {
	SoftRed,
	SoftBlue,
	MagRed,
	MagBlue,
	SoftNoneBackground,
	MagNoneBackground,
}

export type CRWideTicketDrawParameters = {
	background: CRTicketBackGround;
	showBorder: boolean;
	isHKWestKowloonStyle: boolean;
	offsetX: number;
	offsetY: number;
	showWatermark: boolean;
	watermark: string;
	ticketNo: string;
	station1: string;
	station2: string;
	station1en: string;
	station2en: string;
	doShowZhan: boolean;
	doShowEnglish: boolean;
	doUseHuaWenXinWei1: boolean;
	doUseHuaWenXinWei2: boolean;
	/** 车次 */
	routeIdentifier: string;
	date: string;
	time: string;
	carriage: string;
	seat1: string;
	seat2: string;
	seat3: string;
	seatClass: string;
	price: string;
	idNumber: string;
	passenger: string;
	doShowPassenger: boolean;
	soldplace: string;
	turnstile: string;
	showSoldPlaceDown: boolean;
	rightUpContentType: RightUpContentType;
	serialCode: string;
	qrCodeText: string;
	doShowQRCode: boolean;
	purchaseMethod: string[];
	doPurchaseMethodHaveCircle: boolean;
	/** unused in CRWideTicket */
	noSeat: boolean;
	noCarriage: boolean;
	info1: string;
	info2: string;
	info3: string;
	message: string;
	messageAlign: TextAlign;
	doShowMessage: boolean;
	info1TrainType: string;
	info1from: string;
	info1to: string;
	showMessageBorder: boolean;
	seatStatus: string;
	purchaseCertType: string;
	purchasePassportCode: string;
	isRouteIdentifierOldStyle: boolean;
	carriageFloor: number;
	tongpiaoStyle: TongPiaoStyle;
	tongpiaoStation: string;
	tongpiaoStationEn: string;
	tongpiaoTrainClass: string;
	tongpiaoRoute: string;
};

export interface PurchaseMethod {
	type: string;
	title: string;
	desc: string;
}

export enum TongPiaoStyle {
	None = 'none',
	Old = 'old',
	New = 'new',
}
