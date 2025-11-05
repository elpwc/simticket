import { TextAlign } from '@/utils/utils';
import { CRTicketBackGround, CRWideTicketDrawParameters, PurchaseMethod, RightUpContentType } from './type';

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

export const PAPER_TICKET_SIZE = [1698, 1162];
export const MAG_TICKET_SIZE = [1689, 1042];
export const PAPER_TICKET_CANVAS_SIZE = [322, 220];
export const MAG_TICKET_CANVAS_SIZE = [320, 197];

export enum PurchaseMethodType {
	TicketType = 'value.purchaseMethod.type.TicketType',
	PurchaseMethod = 'value.purchaseMethod.type.PurchaseMethod',
	POSPrint = 'value.purchaseMethod.type.POSPrint',
	WebPurchase = 'value.purchaseMethod.type.WebPurchase',
	Other = 'value.purchaseMethod.type.Other',
}

export const CRWideTicketDrawParametersInitialValues: CRWideTicketDrawParameters = {
	background: CRTicketBackGround.SoftRed,
	showBorder: true,
	isHKWestKowloonStyle: false,
	offsetX: 0,
	offsetY: 0,
	showWatermark: true,
	watermark: '票样',
	ticketNo: 'A000001',
	station1: '东京都区内',
	station2: '北京朝阳',
	station1en: 'Tokyo Ward Area',
	station2en: 'Beijingchaoyang',
	doShowZhan: true,
	doShowEnglish: true,
	doUseHuaWenXinWei1: false,
	doUseHuaWenXinWei2: false,
	routeIdentifier: 'Z1140',
	date: new Date(),
	time: '11:55',
	carriage: '04',
	seat1: '012',
	seat2: '',
	seat3: '上铺',
	seatClass: '新空调硬卧',
	price: '1540.0',
	idNumber: '1145141980****1919',
	passenger: '田浩',
	doShowPassenger: true,
	soldplace: '稚内',
	turnstile: 'A13',
	showSoldPlaceDown: true,
	rightUpContentType: RightUpContentType.Turnstile,
	serialCode: '1145141919810A000001 JM',
	qrCodeText: '1145141919810',
	purchaseMethod: [
		{ type: PurchaseMethodType.TicketType, title: '学', desc: '学生票' },
		{ type: PurchaseMethodType.PurchaseMethod, title: '网', desc: '互联网售票' },
	],
	doPurchaseMethodHaveCircle: true,
	noSeat: false,
	noCarriage: false,
	info1: '乘车纪念',
	info2: '',
	info3: '',
	message: `买票请到12306 发货请到95306
中国铁路祝您旅途愉快`,

	messageAlign: TextAlign.Center,
	doShowMessage: true,
	info1TrainType: '',
	info1from: '',
	info1to: '',
};
export const purchaseMethodList: PurchaseMethod[] = [
	{ type: PurchaseMethodType.TicketType, title: '孩', desc: 'value.purchaseMethod.list.hai' },
	{ type: PurchaseMethodType.TicketType, title: '学', desc: 'value.purchaseMethod.list.xue' },
	{ type: PurchaseMethodType.TicketType, title: '军', desc: 'value.purchaseMethod.list.jun' },
	{ type: PurchaseMethodType.TicketType, title: '探', desc: 'value.purchaseMethod.list.tan' },
	{ type: PurchaseMethodType.TicketType, title: '半', desc: 'value.purchaseMethod.list.ban' },
	{ type: PurchaseMethodType.TicketType, title: '兵', desc: 'value.purchaseMethod.list.bing' },
	{ type: PurchaseMethodType.TicketType, title: '红', desc: 'value.purchaseMethod.list.hong' },
	{ type: PurchaseMethodType.TicketType, title: '学返', desc: 'value.purchaseMethod.list.xuefan' },
	{ type: PurchaseMethodType.TicketType, title: '团', desc: 'value.purchaseMethod.list.tuan' },
	{ type: PurchaseMethodType.TicketType, title: '团优', desc: 'value.purchaseMethod.list.tuanyou' },
	{ type: PurchaseMethodType.TicketType, title: '返', desc: 'value.purchaseMethod.list.fan' },
	{ type: PurchaseMethodType.PurchaseMethod, title: '网', desc: 'value.purchaseMethod.list.wang' },
	{ type: PurchaseMethodType.POSPrint, title: '工', desc: 'value.purchaseMethod.list.gong' },
	{ type: PurchaseMethodType.POSPrint, title: '农', desc: 'value.purchaseMethod.list.nong' },
	{ type: PurchaseMethodType.POSPrint, title: '中', desc: 'value.purchaseMethod.list.zhong' },
	{ type: PurchaseMethodType.POSPrint, title: '招', desc: 'value.purchaseMethod.list.zhao' },
	{ type: PurchaseMethodType.WebPurchase, title: '建', desc: 'value.purchaseMethod.list.jian' },
	{ type: PurchaseMethodType.WebPurchase, title: '支', desc: 'value.purchaseMethod.list.zhi' },
	{ type: PurchaseMethodType.WebPurchase, title: '银', desc: 'value.purchaseMethod.list.yin' },
	{ type: PurchaseMethodType.WebPurchase, title: '微', desc: 'value.purchaseMethod.list.wei' },
	{ type: PurchaseMethodType.WebPurchase, title: '京', desc: 'value.purchaseMethod.list.jing' },
	{ type: PurchaseMethodType.WebPurchase, title: '现', desc: 'value.purchaseMethod.list.xian' },
	{ type: PurchaseMethodType.Other, title: '赠', desc: 'value.purchaseMethod.list.zeng' },
	{ type: PurchaseMethodType.Other, title: '折', desc: 'value.purchaseMethod.list.zhe' },
	{ type: PurchaseMethodType.Other, title: '补', desc: 'value.purchaseMethod.list.bu' },
	{ type: PurchaseMethodType.Other, title: '专', desc: 'value.purchaseMethod.list.zhuan' },
	{ type: PurchaseMethodType.Other, title: '行', desc: 'value.purchaseMethod.list.xing' },
	{ type: PurchaseMethodType.Other, title: '车', desc: 'value.purchaseMethod.list.che' },
	{ type: PurchaseMethodType.Other, title: '残', desc: 'value.purchaseMethod.list.can' },
	{ type: PurchaseMethodType.Other, title: '软', desc: 'value.purchaseMethod.list.ruan' },
	{ type: PurchaseMethodType.Other, title: '硬', desc: 'value.purchaseMethod.list.ying' },
	{ type: PurchaseMethodType.Other, title: '纪念票', desc: 'value.purchaseMethod.list.jinian' },
	{ type: PurchaseMethodType.Other, title: '挂失补', desc: 'value.purchaseMethod.list.guashi' },
];

export const info1List = ['限乘当日当次车', '乘车纪念'];
export const info2List = ['中途下车失效', '在2日内有效', '在3日内有效', '随原票使用', '随原票使用有效', '乘车纪念'];
export const info3List = ['仅供报销使用', '变更到站', '退票费', '中转签证', '乘车证签证', '始发改签', '乘车纪念'];

export const seatType = [
	'商务座',
	'一等座',
	'二等座',
	'动卧',
	'高级动卧',
	'新空调高级软卧',
	'新空调软卧',
	'新空调硬卧',
	'新空调软座',
	'新空调硬座',
	'软座',
	'硬座',
	'硬卧代硬座',
	'软卧代软座',
	'特等座',
	'观光座',
	'棚车',
	'一等/First Class',
	'二等/Second Class',
];
export const sleepingCarSeatType = ['动卧', '高级动卧', '新空调高级软卧', '新空调软卧', '新空调硬卧'];

export const messageList = [
	`买票请到12306 发货请到95306
中国铁路祝您旅途愉快`,
	`报销凭证 遗失不补
退票改签时须交回车站`,
	`欢度国庆，祝福祖国
中国铁路祝您旅途愉快`,
];
