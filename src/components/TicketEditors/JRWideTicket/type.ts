import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRPaymentMethod } from './value';

export type JRWideTicketDrawParameters = {
	background: JRTicketBackGround;
	showBorder: boolean;
	offsetX: number;
	offsetY: number;
	showWatermark: boolean;
	watermark: string;
	ticketType: string;
	ticketNo: string;
	station1: string;
	station2: string;
	station1AreaChar: string;
	station2AreaChar: string;
	station1Type: JRStationNameType;
	station2Type: JRStationNameType;
	station1en: string;
	station2en: string;
	doShowEnglish: boolean;
	railways: string[];
	paymentMethod: JRPaymentMethod;
	date: Date;
	time: string;
	carriage: string;
	seat1: string;
	seat2: string;
	seat3: string;
	seatClass: string;
	price: string;
	soldplace: string;
	serialCode: string;
	noSeat: boolean;
	noCarriage: boolean;
	info1: string;
};

export enum JRStationNameType {
	Normal,
	Small,
	UpAndDownAlignLieft,
	UpAlignLeftAndDownAlignRight,
	UpAlignLeftAndDownAlignCenter,
	LeftLargeAndRightSmall,
	LeftSmallAndRightLarge,
	LeftVerticalAndRightLarge,
	LeftLargeAndRightVertical,
}
