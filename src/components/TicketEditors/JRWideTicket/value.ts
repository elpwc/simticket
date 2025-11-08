import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRStationNameType, JRWideTicketDrawParameters } from './type';

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
	station1: '東京都区内',
	station2: '北海道/医療大学',
	station1AreaChar: '区',
	station2AreaChar: '',
	station1Type: JRStationNameType.Normal,
	station2Type: JRStationNameType.LeftLargeAndRightSmall,
	station1en: 'Tokyo Metro Area',
	station2en: 'Hokkaido Iryo Daigaku',
	doShowEnglish: false,
	railways: ['新幹線', '函館', '室蘭', '札沼'],
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

export const DaitoshiKinkouKukan = [
	{ char: '区', name: '東京都区内' },
	{ char: '山', name: '東京山手線内', fontSize: 'middle' },
	{ char: '仙', name: '仙台市内' },
	{ char: '名', name: '名古屋市内' },
	{ char: '浜', name: '浜松市内' },
	{ char: '京', name: '京都市内' },
	{ char: '阪', name: '大阪市内' },
	{ char: '神', name: '神戸市内' },
	{ char: '広', name: '広島市内' },
	{ char: '九', name: '北九州市内' },
	{ char: '福', name: '福岡市内' },
];

export const JRStationNameTypeRadioboxItemData = [
	{ type: JRStationNameType.Normal, name: '一般', desc: '根室' },
	{ type: JRStationNameType.Small, name: '小文字', desc: 'りんくうタウン' },
	{ type: JRStationNameType.UpAndDownAlignLeft, name: '上下左詰め', desc: '上越/国際スキー場前' },
	{
		type: JRStationNameType.UpAlignLeftAndDownAlignCenter,
		name: '上左詰め下中寄せ',
		desc: 'ユニバーサル/シティ',
	},
	{
		type: JRStationNameType.UpAlignLeftAndDownAlignRight,
		name: '上左詰め下右詰め',
		desc: 'サッポロ/ビール庭園',
	},
	{ type: JRStationNameType.LeftLargeAndRightSmall, name: '左大右小', desc: '高輪/ゲートウェイ' },
	{ type: JRStationNameType.LeftSmallAndRightLarge, name: '左小右大', desc: '(信)/横川' },
	{ type: JRStationNameType.LeftVerticalAndRightLarge, name: '左縦右大', desc: '行川/アイランド' },
	{ type: JRStationNameType.LeftLargeAndRightVertical, name: '左大右縦', desc: 'かみのやま/温泉' },
	{ type: JRStationNameType.LeftLargeRightUpAndDown, name: '左大右2行', desc: '鹿島/サッカー/スタジアム' },
	{ type: JRStationNameType.LeftUpAndDownRightLarge, name: '左2行右大', desc: '運転/免許/試験場' },
];

export const JRCompanies = [
	{
		value: 'H',
		name: 'JR北海道',
		color: 'rgb(77, 211, 91)',
	},
	{
		value: 'E',
		name: 'JR東日本',
		color: 'rgb(0, 160, 64)',
	},
	{
		value: 'C',
		name: 'JR東海',
		color: 'rgb(241, 90, 34)',
	},
	{
		value: 'W',
		name: 'JR西日本',
		color: 'rgb(0, 178, 227)',
	},
	{
		value: 'S',
		name: 'JR四国',
		color: 'rgb(6, 218, 255)',
	},
	{
		value: 'K',
		name: 'JR九州',
		color: 'rgb(229, 61, 74)',
	},
	{
		value: 'P',
		name: 'JR貨物',
		color: '#bb0764',
	},
	{
		value: 'O',
		name: '他会社',
		color: '#000000',
	},
];
