import { CRTicketBackGround, CRWideTicketDrawParameters, PurchaseMethod, RightUpContentType } from './type';
import { getRandomCRTicketNo } from './utils';

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

export const PAPER_TICKET_SIZE: [number, number] = [1698, 1162];
export const MAG_TICKET_SIZE: [number, number] = [1689, 1042];
export const PAPER_TICKET_CANVAS_SIZE: [number, number] = [322, 220];
export const MAG_TICKET_CANVAS_SIZE: [number, number] = [320, 197];
export const PAPER_TICKET_A4_SIZE: [number, number] = [89.7 / 210, 61 / 297];
export const MAG_TICKET_A4_SIZE: [number, number] = [88 / 210, 54 / 297];

export enum PurchaseMethodType {
	TicketType = 'value.purchaseMethod.type.TicketType',
	PurchaseMethod = 'value.purchaseMethod.type.PurchaseMethod',
	POSPrint = 'value.purchaseMethod.type.POSPrint',
	WebPurchase = 'value.purchaseMethod.type.WebPurchase',
	Other = 'value.purchaseMethod.type.Other',
}

export const CRPresetStations = [
	{
		station1: '格尔木',
		station2: '拉萨',
		station1en: "Ge'ermu",
		station2en: 'Lasa',
	},
	{
		background: CRTicketBackGround.MagBlue,
		station1: '西安北',
		station2: '乌鲁木齐',
		station1en: "Xi'anbei",
		station2en: 'Wulumuqi',
	},
	{
		background: CRTicketBackGround.MagBlue,
		station1: '东京',
		station2: '上海松江',
		station1en: 'Tokyo',
		station2en: 'Shanghaisongjiang',
	},
	{
		station1: '深圳',
		station2: '九龙',
		station1en: 'Shenzhen',
		station2en: 'Kowloon',
	},
	{
		station1: '南宁',
		station2: '河内嘉林',
		station1en: 'Nam Ninh',
		station2en: 'Gia Lâm Hà Nội',
	},
	{
		station1: '北京',
		station2: '平壤',
		station1en: 'Beijing',
		station2en: 'Pyongyang',
	},
	{
		background: CRTicketBackGround.MagBlue,
		station1: '北京东',
		station2: '北京城市副中心',
		station1en: 'Beijingdong',
		station2en: 'Beijingchengshifuzhongxin',
	},
	{
		station1: '上海虹桥',
		station2: '南京',
		station1en: 'Shanghaihongqiao',
		station2en: 'Nanjing',
		doUseHuaWenXinWei1: true,
		doUseHuaWenXinWei2: true,
	},
	{
		background: CRTicketBackGround.MagBlue,
		station1: '东京都区内',
		station2: '北京朝阳',
		station1en: 'Tokyo Ward Area',
		station2en: 'Beijingchaoyang',
	},
];

export const CRWideTicketDrawParametersInitialValues: CRWideTicketDrawParameters = {
	background: CRTicketBackGround.SoftRed,
	showBorder: true,
	isHKWestKowloonStyle: false,
	offsetX: 0,
	offsetY: 0,
	showWatermark: true,
	watermark: '票样',
	ticketNo: getRandomCRTicketNo(),
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
	doShowQRCode: true,
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
	messageAlign: 1,
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

export const CRTicketFlipSideText = `　　　　　　　　　　☆请妥善保管车票。☆请凭车票和本人有效身份证
件原件乘车,如改签､变更到站或退票请提前办理｡票､证､人不一致的,
铁路部门有权拒绝进站乘车｡直达票中途下车,未乘区间失效,通票中转
需签证。☆免费携带品上限为成人 20 千克､儿童 10 千克､长宽高之和
160 厘米(动车组 130 厘米),超过上限请办理托运｡不得携带可能威胁
公共安全的禁止或限制运输物品､造成人身伤害的大件硬质物品､妨碍公
共卫生及损坏污染车辆的物品。☆开车前提前停止检票,请提前到车站指
定场所候车。☆对无票乘车､冒用身份信息购票及多次挂失车票有一票两
用的,铁路部门保留限制购票等权利。☆遇运行图调整导致已购车票列车
运行时刻变动的,铁路部门免费提供改签､变更到站及退票服务。☆遇灾
害险情等特殊情况,须听从铁路工作人员指挥安排。☆12306.cn(含铁
路 12306 手机客户端)是唯一官方网站,请勿通过其他网站技术手段抢票，
以免遭受损失。☆未尽事宜详见⟪铁路旅客运输规程⟫等有关规定和车站
公告｡跨境旅客事宜详见铁路跨境旅客相关运输组织规则和车站公告。`;
