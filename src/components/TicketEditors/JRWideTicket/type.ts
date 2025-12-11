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
	/** unused */
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
	isKaisukenArrow: boolean;
	railways: string[];
	/** unused */
	paymentMethod: JRPaymentMethod;
	date: string;
	time: string;
	carriage: string;
	seat1: string;
	seat2: string;
	seat3: string;
	seatClass: string;
	price: string;
	/** unused */
	soldplace: string;
	/** 旅行会社向けプリカット通番 */
	serialCode: string;
	noSeat: boolean;
	noCarriage: boolean;
	info1: string;
	is120mm: boolean;
	hasSinkansen: boolean;
	titleUnderlineStyle: JRTitleUnderlineStyle;
	sinkansenRange1: ShinkansenRange;
	sinkansenRange2: ShinkansenRange;
	sinkansenRange3: ShinkansenRange;
	trainName: string;
	trainNo: string;
	date2: string;
	time2: string;
	price1: string;
	price2: string;
	price3: string;
	discount: string;
	paymentPlace: string;
	paymentDate: string;
	paymentNo: string;
	issuingPlace: string;
	issuingDate: string;
	issuingNo: string;
	issuingAreaNo: string;
	hasOtherCompanyLines: boolean;
	RCode: string;
	CCode: string;
	expressExpireDate: string;
	fareTicketExpireDate: string;
	isPaymentIssuingTheSamePlace: boolean;
	doShowSerialCode: boolean;
	isChild: boolean;
	hasCannotPassAutoPasiAreaMark: boolean;
	hasJouhenMark: boolean;
};

export enum JRStationNameType {
	Normal,
	Small,
	UpAndDownAlignLeft,
	UpAlignLeftAndDownAlignCenter,
	UpAlignLeftAndDownAlignRight,
	LeftLargeAndRightSmall,
	LeftSmallAndRightLarge,
	LeftVerticalAndRightLarge,
	LeftLargeAndRightVertical,
	LeftLargeRightUpAndDown,
	LeftUpAndDownRightLarge,
}

export enum JRTicketType {
	Regular, // 乗車券
	Admission, // 入場券
	Green, // グリーン券
	Excursion, // 企画券
	Express, // 急行券
	LimitedExpress, // 特急券
	ReservedSeat, // 指定券
	Kaisuken, // 回数券
	SleepingCar, // 寝台券
	Others,
}

export const JRTicketTypeList = [
	{ type: JRTicketType.Regular, name: '乗車券', shortName: '乗車券', isLongSize: false },
	{ type: JRTicketType.LimitedExpress, name: '特急券 / 急行券 / 寝台券 / ｸﾞﾘｰﾝ券', shortName: '特急', isLongSize: false },
	// { type: JRTicketType.Express, name: '急行券', shortName: '急行', isLongSize: false },
	{ type: JRTicketType.ReservedSeat, name: '指定券', shortName: '指定', isLongSize: false },
	//{ type: JRTicketType.SleepingCar, name: '寝台券', shortName: '寝台券', isLongSize: true },
	{ type: JRTicketType.Admission, name: '入場券', shortName: '入場', isLongSize: false },
	// { type: JRTicketType.Green, name: 'ｸﾞﾘｰﾝ券', shortName: 'グリーン', isLongSize: false },
	// { type: JRTicketType.Excursion, name: '企画券', shortName: '企画', isLongSize: true },
	// { type: JRTicketType.Kaisuken, name: '回数券', shortName: '回数券', isLongSize: false },
	{ type: JRTicketType.Others, name: 'カスタム', shortName: 'その他', isLongSize: false },
];

export enum JRTicketTypesettingtype {
	///////////////////////////// 85mm /////////////////////////////
	/** 乗車券 */
	Fare,
	/** 急行券/特急券/乗車券・特急券/特急券・グリーン券/指定席券/指定券/寝台指定券/普通列車用グリーン券 */
	Express,
	/** 自由席急行券/自由席特急券/寝台券85mm */
	NonReserved,
	/** 乗車券・自由席特急券/ */
	FareAndNonReserved,
	/** 自由席急行券/自由席特急券 第2種　企画？ */
	NonReserved2Kikaku,

	/** 特急券（座席未指定）/乗車券・特急券（座席未指定）*/
	Unreserved,

	/** 寝台料金券 */
	SleepingCarCash,

	///////////////////////////// 120mm /////////////////////////////
	Fare120,

	/** 寝台券120㎜ */
	SleepingCar120,

	///////////////////////////// other /////////////////////////////
	/** 入場券 */
	Admission,
}

export const JRTicketTitles = [
	{
		name: '普通入場券',
		printingName: '普　通　入　場　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Admission,
		typeset120: JRTicketTypesettingtype.Admission,
	},
	////////////////////////////////////////////////////////////////////////
	{
		name: '普通列車用グリーン券',
		printingName: '普　通　列　車　用　グリーン券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	////////////////////////////////////////////////////////////////////////
	{
		name: '指定席券',
		printingName: '指　定　席　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '指定券',
		printingName: '指　　定　　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '指定券(グリーン)',
		printingName: '指　　定　　券(グリーン)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '新幹線指定券',
		printingName: '新　幹　線　指　定　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '新幹線指定券(グリーン)',
		printingName: '新幹線指定券(グリーン)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: 'バス指定券',
		printingName: 'バ　ス　指　定　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '寝台指定券(A個)',
		printingName: '寝台指定券(A個)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.SleepingCar120,
	},
	{
		name: '寝台指定券(A寝台)',
		printingName: '寝台指定券(A寝台)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.SleepingCar120,
	},
	{
		name: '寝台指定券(B個)',
		printingName: '寝台指定券(B個)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.SleepingCar120,
	},
	{
		name: '寝台指定券(B寝台)',
		printingName: '寝台指定券(B寝台)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.SleepingCar120,
	},
	////////////////////////////////////////////////////////////////////////
	{
		name: '寝台料金券(A寝台)',
		printingName: '寝　台　料　金　券　(A寝台)',
		desc: '',
		typeset: JRTicketTypesettingtype.SleepingCarCash,
		typeset120: JRTicketTypesettingtype.SleepingCarCash,
	},
	{
		name: '寝台料金券(B寝台)',
		printingName: '寝　台　料　金　券　(B寝台)',
		desc: '',
		typeset: JRTicketTypesettingtype.SleepingCarCash,
		typeset120: JRTicketTypesettingtype.SleepingCarCash,
	},
	{
		name: '寝台料金券(A個)',
		printingName: '寝　台　料　金　券　(A個)',
		desc: '',
		typeset: JRTicketTypesettingtype.SleepingCarCash,
		typeset120: JRTicketTypesettingtype.SleepingCarCash,
	},
	{
		name: '寝台料金券(B個)',
		printingName: '寝　台　料　金　券　(B個)',
		desc: '',
		typeset: JRTicketTypesettingtype.SleepingCarCash,
		typeset120: JRTicketTypesettingtype.SleepingCarCash,
	},
	////////////////////////////////////////////////////////////////////////

	{
		name: '乗車券',
		printingName: '乗　車　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Fare,
		typeset120: JRTicketTypesettingtype.Fare120,
	},
	{
		name: '乗車券(ゆき)',
		printingName: '乗　車　券　(ゆ　き)',
		desc: '',
		typeset: JRTicketTypesettingtype.Fare,
		typeset120: JRTicketTypesettingtype.Fare120,
	},
	{
		name: '乗車券(かえり)',
		printingName: '乗　車　券　(かえり)',
		desc: '',
		typeset: JRTicketTypesettingtype.Fare,
		typeset120: JRTicketTypesettingtype.Fare120,
	},
	{
		name: '乗車券(連続1)',
		printingName: '乗　車　券　(連続　１)',
		desc: '',
		typeset: JRTicketTypesettingtype.Fare,
		typeset120: JRTicketTypesettingtype.Fare120,
	},
	{
		name: '乗車券(連続2)',
		printingName: '乗　車　券　(連続　２)',
		desc: '',
		typeset: JRTicketTypesettingtype.Fare,
		typeset120: JRTicketTypesettingtype.Fare120,
	},
	////////////////////////////////////////////////////////////////////////
	{
		name: '乗車券・特急券',
		printingName: '乗　車　券　・　特　急　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・B特急券',
		printingName: '乗車券・B特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・立席特急券',
		printingName: '乗車券・立席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・新幹線特急券',
		printingName: '乗車券・新幹線特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・新幹線特定特急券(立席)',
		printingName: '乗車券・新幹線特定特急券(立席)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},

	{
		name: '乗車券・新幹線自由席特急券',
		printingName: '乗車券・新幹線自由席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・新幹線自由席特急券／特定特急券',
		printingName: '乗車券・新幹線自由席特急券／特定特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・特定特急券',
		printingName: '乗車券・特定特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・自由席特急券',
		printingName: '乗車券・自由席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・B自由席特急券',
		printingName: '乗車券・B自由席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・新幹線特定特急券',
		printingName: '乗車券・新幹線特定特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・特急券(座席未指定)',
		printingName: '乗車券・特急券(座席未指定)',
		desc: '',
		typeset: JRTicketTypesettingtype.Unreserved,
		typeset120: JRTicketTypesettingtype.Unreserved,
	},

	////////////////////////////////////////////////////////////////////////
	{
		name: '乗車券・急行券',
		printingName: '乗　車　券　・　急　行　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・B急行券',
		printingName: '乗車券・B急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・立席急行券',
		printingName: '乗車券・立席急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '乗車券・特定急行券',
		printingName: '乗車券・特定急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・自由席急行券',
		printingName: '乗車券・自由席急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・B自由席急行券',
		printingName: '乗車券・B自由席急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.FareAndNonReserved,
		typeset120: JRTicketTypesettingtype.FareAndNonReserved,
	},
	{
		name: '乗車券・急行券(座席未指定)',
		printingName: '乗車券・急行券(座席未指定)',
		desc: '',
		typeset: JRTicketTypesettingtype.Unreserved,
		typeset120: JRTicketTypesettingtype.Unreserved,
	},

	////////////////////////////////////////////////////////////////////////
	{
		name: '特急券',
		printingName: '特　　急　　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: 'B特急券',
		printingName: 'B　特　急　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '立席特急券',
		printingName: '立　席　特　急　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '新幹線特急券',
		printingName: '新　幹　線　特　急　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '新幹線特定特急券(立席)',
		printingName: '新幹線特定特急券(立席)',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '新幹線自由席特急券',
		printingName: '新幹線自由席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '新幹線自由席特急券／特定特急券',
		printingName: '新幹線自由席特急券／特定特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '特定特急券',
		printingName: '特　定　特　急　券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '自由席特急券',
		printingName: '自由席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B自由席特急券',
		printingName: 'B自由席特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '新幹線特定特急券',
		printingName: '新幹線特定特急券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '特急券(座席未指定)',
		printingName: '特　急　券(座席未指定)',
		desc: '',
		typeset: JRTicketTypesettingtype.Unreserved,
		typeset120: JRTicketTypesettingtype.Unreserved,
	},
	////////////////////////////////////////////////////////////////////////
	{
		name: '急行券',
		printingName: '急　行　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: 'B急行券',
		printingName: 'B急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '立席急行券',
		printingName: '立　席　急　行　券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '特定急行券',
		printingName: '特　定　急　行　券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '自由席急行券',
		printingName: '自由席急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B自由席急行券',
		printingName: 'B自由席急行券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '急行券(座席未指定)',
		printingName: '急　行　券(座席未指定)',
		desc: '',
		typeset: JRTicketTypesettingtype.Unreserved,
		typeset120: JRTicketTypesettingtype.Unreserved,
	},

	////////////////////////////////////////////////////////////////////////
	{
		name: '特急券・A寝台券',
		printingName: '特急券・A寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '特急券・A寝台券(個)',
		printingName: '特急券・A寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '特急券・B寝台券',
		printingName: '特急券・B寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '特急券・B寝台券(個)',
		printingName: '特急券・B寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B特急券・A寝台券',
		printingName: 'B特急券・A寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B特急券・A寝台券(個)',
		printingName: 'B特急券・A寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B特急券・B寝台券',
		printingName: 'B特急券・B寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B特急券・B寝台券(個)',
		printingName: 'B特急券・B寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},

	{
		name: '特急券・グリーン券',
		printingName: '特急券・グリーン券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: '新幹線特急券・グリーン券',
		printingName: '新幹線特急券・グリーン券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: 'B特急券・グリーン券',
		printingName: 'B特急券・グリーン券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},

	////////////////////////////////////////////////////////////////////////
	{
		name: '急行券・A寝台券',
		printingName: '急行券・A寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '急行券・A寝台券(個)',
		printingName: '急行券・A寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '急行券・B寝台券',
		printingName: '急行券・B寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: '急行券・B寝台券(個)',
		printingName: '急行券・B寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B急行券・A寝台券',
		printingName: 'B急行券・A寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B急行券・A寝台券(個)',
		printingName: 'B急行券・A寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B急行券・B寝台券',
		printingName: 'B急行券・B寝台券',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},
	{
		name: 'B急行券・B寝台券(個)',
		printingName: 'B急行券・B寝台券(個)',
		desc: '',
		typeset: JRTicketTypesettingtype.NonReserved,
		typeset120: JRTicketTypesettingtype.NonReserved,
	},

	{
		name: '急行券・グリーン券',
		printingName: '急行券・グリーン券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
	{
		name: 'B急行券・グリーン券',
		printingName: 'B急行券・グリーン券',
		desc: '',
		typeset: JRTicketTypesettingtype.Express,
		typeset120: JRTicketTypesettingtype.Express,
	},
];

export enum JRTitleUnderlineStyle {
	StraightLine,
	Shinkansen4Blocks,
	Shinkansen2Blocks,
	Shinkansen1Blocks,
	None,
}

export const JRTitleUnderlineStyleTitles = [
	{
		value: JRTitleUnderlineStyle.StraightLine,
		title: '直線——————',
	},
	{
		value: JRTitleUnderlineStyle.Shinkansen4Blocks,
		title: '新幹線区間有(4x) · · · ·□□□□■■■■',
	},
	{
		value: JRTitleUnderlineStyle.Shinkansen2Blocks,
		title: '新幹線区間有(2x) · ·□□■■',
	},
	{
		value: JRTitleUnderlineStyle.Shinkansen1Blocks,
		title: '新幹線区間有(1x) ·□■',
	},
	{
		value: JRTitleUnderlineStyle.None,
		title: 'なし',
	},
];

export enum ShinkansenRange {
	NotPass,
	Zairaisen,
	Shinkansen,
}

export const ShinkansenRangeTitles = [
	{
		value: ShinkansenRange.NotPass,
		title: '不通過 · · · ·',
	},
	{
		value: ShinkansenRange.Zairaisen,
		title: '在来線 □□□□',
	},
	{
		value: ShinkansenRange.Shinkansen,
		title: '新幹線 ■■■■',
	},
];
