import { JRTicketBackGround } from './JRWideTicketBgSelector';
import { JRStationNameType, JRTitleUnderlineStyle, JRWideTicketDrawParameters, ShinkansenRange } from './type';

export const JR_MARS_PAPER_TICKET_SIZE: [number, number] = [1477, 1000];
export const JR_MARS_PAPER_TICKET_CANVAS_SIZE: [number, number] = [310, 210];
export const JR_MARS_PAPER_TICKET_A4_SIZE: [number, number] = [85 / 210, 57 / 297];
export const JR_MARS_120_PAPER_TICKET_SIZE: [number, number] = [2085, 1000];
export const JR_MARS_120_PAPER_TICKET_CANVAS_SIZE: [number, number] = [438, 210];
export const JR_MARS_120_PAPER_TICKET_A4_SIZE: [number, number] = [120 / 210, 57 / 297];

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
	JRE,
	JRC,
	JRW,
	JRCreditCard,
}

export const JRPAYMENT_METHOD_LIST = [
	{
		value: JRPaymentMethod.Cash,
		title: '現金',
		text: '現金',
	},
	{
		value: JRPaymentMethod.ICCard,
		title: 'ＩＣカード',
		text: 'ⅠＣ',
	},
	{
		value: JRPaymentMethod.CreditCard,
		title: 'クレジットカード',
		text: 'Ｃ制',
	},
	{
		value: JRPaymentMethod.JRE,
		title: 'ビューカード',
		text: '東Ｃ',
	},
	{
		value: JRPaymentMethod.JRC,
		title: 'JR東海エクスプレス・カード',
		text: '海Ｃ',
	},
	{
		value: JRPaymentMethod.JRW,
		title: 'J-WEST CARD',
		text: '西Ｃ',
	},
	{
		value: JRPaymentMethod.JRCreditCard,
		title: 'JRカード',
		text: 'クレジット',
	},
];

export const JRPresetStations = [
	{
		station1: '東京山手線内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '山',
		station1en: '',
		station2: '北海道/医療大学',
		station2Type: JRStationNameType.LeftLargeAndRightSmall,
		station2AreaChar: '',
		station2en: '',
		railways: ['新幹線', '函館', '室蘭', '札沼'],
	},
	{
		station1: '勝沼ぶどう郷',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '',
		station1en: '',
		station2: '沼津',
		station2Type: JRStationNameType.Normal,
		station2AreaChar: '',
		station2en: '',
		railways: ['中央東', '甲駿線', '御殿場'],
	},
	{
		station1: '豊原市内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '豊',
		station1en: '',
		station2: '樺太/工科大学前',
		station2Type: JRStationNameType.LeftUpAndDownRightLarge,
		station2AreaChar: '',
		station2en: '',
		railways: ['新幹線', '樺太東'],
	},
	{
		station1: '札幌市内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '札',
		station1en: '',
		station2: '豊原市内',
		station2Type: JRStationNameType.Normal,
		station2AreaChar: '豊',
		station2en: '',
		railways: ['新幹線'],
	},
	{
		station1: '根室',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '',
		station1en: '',
		station2: '東根室',
		station2Type: JRStationNameType.Normal,
		station2AreaChar: '',
		station2en: '',
		railways: ['根室'],
	},
	{
		station1: '稚内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '',
		station1en: '',
		station2: '枕崎',
		station2Type: JRStationNameType.Normal,
		station2AreaChar: '',
		station2en: '',
		railways: ['宗谷', '函館', '室蘭', '函館', '新幹線', '指宿枕崎線'],
	},
	{
		station1: '那覇',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '',
		station1en: '',
		station2: '本部/美ら海水族館前',
		station2Type: JRStationNameType.UpAndDownAlignLeft,
		station2AreaChar: '',
		station2en: '',
		railways: ['沖縄', '名護'],
	},
	{
		station1: '（信）/横　川',
		station1Type: JRStationNameType.LeftSmallAndRightLarge,
		station1AreaChar: '',
		station1en: '',
		station2: '軽井沢',
		station2Type: JRStationNameType.Normal,
		station2AreaChar: '',
		station2en: '',
		railways: ['信越', '新幹線'],
	},
	{
		station1: '高輪/ゲートウェイ',
		station1Type: JRStationNameType.LeftLargeAndRightSmall,
		station1AreaChar: '',
		station1en: '',
		station2: '行川/アイランド',
		station2Type: JRStationNameType.LeftVerticalAndRightLarge,
		station2AreaChar: '',
		station2en: '',
		railways: ['東海道', '京葉', '外房'],
	},
	{
		station1: '東京都区内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '区',
		station1en: '',
		station2: '国際/上 海',
		station2Type: JRStationNameType.LeftSmallAndRightLarge,
		station2AreaChar: '',
		station2en: '',
		railways: ['新幹線', 'KTX線', 'CR線'],
	},
	{
		station1: '福岡市内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '福',
		station1en: '',
		station2: '国際/ソウル',
		station2Type: JRStationNameType.LeftSmallAndRightLarge,
		station2AreaChar: '',
		station2en: '',
		railways: ['唐津', '対馬海峡線', 'KR京釜線'],
	},
	{
		station1: '那覇市内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '那',
		station1en: '',

		station2: '国際/台　北',
		station2Type: JRStationNameType.LeftSmallAndRightLarge,
		station2AreaChar: '',
		station2en: '',
		railways: ['沖縄', '日台連絡船', 'TR縦貫線'],
	},
	{
		station1: '仙台市内',
		station1Type: JRStationNameType.Normal,
		station1AreaChar: '仙',
		station1en: '',

		station2: 'ＢＲＴ/奇跡の一本松',
		station2Type: JRStationNameType.UpAlignLeftAndDownAlignCenter,
		station2AreaChar: '',
		station2en: '',
		railways: ['仙石', '石巻', 'BRT線'],
	},
	{
		station1: 'ＪＲ難波/(市内)',
		station1Type: JRStationNameType.LeftLargeAndRightSmall,
		station1AreaChar: '',
		station1en: '',
		station2: 'りんくうタウン',
		station2Type: JRStationNameType.Small,
		station2AreaChar: '',
		station2en: '',
		railways: ['関西', '阪和', '関西空港線'],
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
	isKaisukenArrow: false,
	railways: ['新幹線', '函館', '室蘭', '札沼'],
	paymentMethod: JRPaymentMethod.CreditCard,
	date: new Date().toISOString().slice(0, 10),
	time: '11:55',
	carriage: '04',
	seat1: '012',
	seat2: '',
	seat3: '上段',
	seatClass: '',
	price: '1,540',
	soldplace: '',
	serialCode: '50000-010',
	noSeat: false,
	noCarriage: false,
	info1: '下車前途無効',
	is120mm: false,
	hasSinkansen: false,
	titleUnderlineStyle: JRTitleUnderlineStyle.StraightLine,
	sinkansenRange1: ShinkansenRange.NotPass,
	sinkansenRange2: ShinkansenRange.NotPass,
	sinkansenRange3: ShinkansenRange.NotPass,
	trainName: 'のぞみ',
	trainNo: '5',
	date2: new Date().toISOString().slice(0, 10),
	time2: '11:55',
	price1: '0',
	price2: '0',
	price3: '0',
	discount: '',
	paymentPlace: '稚内駅MR',
	paymentDate: new Date().toISOString().slice(0, 10),
	paymentNo: '10001-01',
	issuingPlace: '稚内駅MR',
	issuingDate: new Date().toISOString().slice(0, 10),
	issuingNo: '10001-01',
	issuingAreaNo: '2',
	hasOtherCompanyLines: false,
	RCode: '001',
	CCode: '50',
	expressExpireDate: new Date().toISOString().slice(0, 10),
	fareTicketExpireDate: new Date().toISOString().slice(0, 10),
	isPaymentIssuingTheSamePlace: true,
};

export const TokuteiTokuShinai = [
	{ char: '区', name: '東京都区内' },
	{ char: '山', name: '東京山手線内', fontSize: 'middle' },
	{ char: '札', name: '札幌市内' },
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
	{ type: JRStationNameType.Normal, name: '一般', desc: '埼玉' },
	{ type: JRStationNameType.Small, name: '小文字', desc: '埼玉シーサイド' },
	{ type: JRStationNameType.UpAndDownAlignLeft, name: '上下左詰め', desc: '埼玉/シーサイド' },
	{
		type: JRStationNameType.UpAlignLeftAndDownAlignCenter,
		name: '上左詰め下中寄せ',
		desc: '埼玉/シーサイド',
	},
	{
		type: JRStationNameType.UpAlignLeftAndDownAlignRight,
		name: '上左詰め下右詰め',
		desc: '埼玉/シーサイド',
	},
	{ type: JRStationNameType.LeftLargeAndRightSmall, name: '左大右小', desc: '埼玉/シーサイド' },
	{ type: JRStationNameType.LeftSmallAndRightLarge, name: '左小右大', desc: 'シーサイド/公園' },
	{ type: JRStationNameType.LeftVerticalAndRightLarge, name: '左縦右大', desc: '埼玉/シーサイド' },
	{ type: JRStationNameType.LeftLargeAndRightVertical, name: '左大右縦', desc: '埼玉海浜/公園' },
	{ type: JRStationNameType.LeftLargeRightUpAndDown, name: '左大右2行', desc: '埼玉/シーサイド/パーク' },
	{ type: JRStationNameType.LeftUpAndDownRightLarge, name: '左2行右大', desc: 'シーサイド/パーク/埼玉' },
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
		name: '他会社連絡',
		color: '#000000',
	},
];

export const JRTicketFlipSideText = `●このきっぶに関するお取扱いは、
券面表示事項のほか、ＪＲの「旅客
営業規則」等の関係約款及び法令な
どによります。
●指定列車に乗り遅れたときは、指
定券の払戻しはできません。当日の
普通車自由席に限り乗車できます。
また、指定席に乗車されるときは、
改めて指定席特急券などが必要です。
●また、券面に㊭㈽契替定などと
表示されているきっぶは、有効期間・
途中下車･変更･払戻し･乗り遅れ時の
取扱いなどに特別な制約があります。
　詳しくは係員にお尋ね下さい。`;

export const JR_info1List = ['下車前途無効', '山手線内各駅下車前途無効', '券面表示の都区市内各駅下車前途無効'];

export const JR_hakken_area = [
	{ title: '(1)JR北海道', value: 1 },
	{ title: '(2)JR東日本', value: 2 },
	{ title: '(3)JR東海', value: 3 },
	{ title: '(4)JR西日本', value: 4 },
	{ title: '(5)JR四国', value: 5 },
	{ title: '(6)JR九州', value: 6 },
];

/** https://mars.saloon.jp/discount01.shtml */
export const JR_discount_list = [
	{ title: '割引なし', value: '', isCommon: true, desc: '' },
	{ title: '乗継割引', value: '乗継', isCommon: true, desc: '' },
	{ title: '往復割引', value: '復割', isCommon: true, desc: '' },
	{ title: '学生割引', value: '証明書/を携帯して下さい/学割', isCommon: true, desc: '' },
	{ title: '学生往復割引', value: '証明書/を携帯して下さい/復学割', isCommon: true, desc: '' },
	{ title: '鉄社学割', value: '鉄社学割', isCommon: false, desc: '' },
	{ title: '国社学割', value: '国社学割', isCommon: false, desc: '' },
	{ title: '社学割', value: '社学割', isCommon: false, desc: '' },
	{ title: '鉄社復学割', value: '鉄社復学割', isCommon: false, desc: '' },
	{ title: '身割', value: '手帳/を携帯して下さい/身割', desc: '' },
	{ title: '療割', value: '手帳/を携帯して下さい/療割', desc: '' },
	{ title: '健割', value: '手帳/を携帯して下さい/健割', desc: '' },
	{ title: '障割', value: '手帳/を携帯して下さい/障割', desc: '' },
	{ title: '育割', value: '手帳/を携帯して下さい/育割', desc: '' },
	{ title: '福割', value: '手帳/を携帯して下さい/福割', desc: '' },
	{ title: '介割', value: '手帳/を携帯して下さい/介割', desc: '' },
	{ title: '護割', value: '手帳/を携帯して下さい/護割', desc: '' },
	{ title: '付割', value: '手帳/を携帯して下さい/付割', desc: '' },
	{ title: '被救護者割引本人', value: '救割', desc: '' },
	{ title: '被救護者割引付添人', value: '添割', desc: '' },
	{ title: 'ジパング倶楽部3割引', value: '会員証/-手巾長の携帯必要/ジ３割', desc: '' },
	{ title: '鉄社割', value: '鉄社割', desc: '' },
	{ title: '職務乗車用', value: '社用', desc: '' },
	{ title: '国会議員', value: '乗車症/を携帯して下さい/国会', desc: '' },
	{ title: '通学用割引普通回数乗車券(放送大学)', value: '放送大学', desc: '' },
	{ title: '戦傷病者後払', value: '戦後', desc: '' },
];
