import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRWideTicketDrawParameters } from './type';

export const JR_MARS_PAPER_TICKET_SIZE: [number, number] = [1477, 1000];
export const JR_MARS_PAPER_TICKET_CANVAS_SIZE: [number, number] = [310, 210];
export const JR_MARS_PAPER_TICKET_A4_SIZE: [number, number] = [85 / 210, 57 / 297];

export const JR_TICKET_TYPE = [
	{ name: '乗車券', title: '' },
	{ name: '乗車券（ゆき）', title: '' },
	{ name: '乗車券（かえり）', title: '' },
	{ name: '乗車券（連続１）', title: '' },
	{ name: '乗車券（連続２）', title: '' },
	{ name: 'グリーン券', title: '' },
	{ name: '特急券', title: '' },
	{ name: '指定席券', title: '' },
	{ name: '特急券・グリーン券', title: '' },
	{ name: '乗車券・特急券', title: '' },
	{ name: 'B自由席特急券', title: '' },
	{ name: '指定券', title: '' },
	{ name: '新幹線指定券', title: '' },
	{ name: '新幹線自由席特急券', title: '' },
	{ name: '新幹線自由席特急券／特定特急券', title: '' },
	{ name: '乗車券・新幹線自由席特急券／特定特急券', title: '' },
	{ name: '乗車券・新幹線特急券', title: '' },
	{ name: '乗車券・新幹線特定特急券', title: '' },
];

export enum JRPaymentMethod {
	Cash,
	ICCard,
	CreditCard,
}

export const JRPAYMENT_METHOD_LIST = [
	{
		value: JRPaymentMethod.Cash,
		title: '現金',
	},
	{
		value: JRPaymentMethod.ICCard,
		title: 'ＩＣカード',
	},
	{
		value: JRPaymentMethod.CreditCard,
		title: 'クレジットカード',
	},
];

export const JRWideTicketDrawParametersInitialValues: JRWideTicketDrawParameters = {
	background: JRTicketBackGround.JR_E,
	showBorder: true,
	offsetX: 0,
	offsetY: 0,
	showWatermark: true,
	watermark: '見本',
	ticketType: '乗車券',
	ticketNo: 'A000001',
	station1: '小田原',
	station2: '沼津',
	station1en: 'Odawara',
	station2en: 'Numazu',
	doShowEnglish: false,
	railways: ['東海道', '御殿場'],
	paymentMethod: JRPaymentMethod.CreditCard,
	date: new Date(),
	time: '11:55',
	carriage: '04',
	seat1: '012',
	seat2: '',
	seat3: '上段',
	seatClass: '新空调硬卧',
	price: '1540.0',
	soldplace: '稚内',
	serialCode: '1145141919810A000001 JM',
	noSeat: false,
	noCarriage: false,
	info1: '乘车纪念',
};
