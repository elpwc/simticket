import CR_logo from '../assets/companyLogos/China_Railways.svg';
import JR_logo from '../assets/companyLogos/JR_logo_JRgroup.svg';
import TR_logo from '../assets/companyLogos/ROC_Taiwan_Railways_Administration_Logo.svg';
import VNR_logo from '../assets/companyLogos/Đsvn.png';
import THSR_logo from '../assets/companyLogos/THSR.svg';
import KORAIL_logo from '../assets/companyLogos/Korail_logo.svg';
import JNR_logo from '../assets/companyLogos/Japanese_National_Railway_logo.svg';
import { StaticImageData } from 'next/image';
import { JSX } from 'react';

/** Maps to a registered ticket editor component in ticketEditorRegistry */
export type TicketEditorKey = 'CRWideTicket' | 'JRWideTicket';

export interface TicketType {
	/** Stable identifier (stored in DB / URL). Independent of array order. */
	id: number;
	name: string | JSX.Element;
	disabled?: boolean;
	/** When set, HomePage renders the matching editor; otherwise UnderConstruction */
	editorKey?: TicketEditorKey;
}

export interface Company {
	/** Stable identifier (stored in DB / URL). Independent of array order. */
	id: number;
	logo: string | StaticImageData;
	abbr: string;
	name: string | JSX.Element;
	/** References TicketType.id, not array index */
	defaultSelectedTicketId?: number;
	disabled?: boolean;
	tickets?: TicketType[];
}

export const companyList: Company[] = [
	{
		id: 0,
		logo: CR_logo,
		abbr: 'CR',
		name: '中国国家铁路集团',
		defaultSelectedTicketId: 4,
		tickets: [
			{ id: 0, name: '卡片式客票', disabled: true },
			{ id: 1, name: 'II型客票(1984)', disabled: true },
			{ id: 2, name: '计算机客票(1996)', disabled: true },
			{ id: 3, name: '计算机客票(2000)', disabled: true },
			{ id: 4, name: '计算机客票(2010)', editorKey: 'CRWideTicket' },
		],
	},
	{
		id: 1,
		logo: JR_logo,
		abbr: 'JR',
		name: '日本旅客鉄道',
		defaultSelectedTicketId: 1,
		tickets: [
			{ id: 0, name: '硬券(D型券)', disabled: true },
			{ id: 1, name: 'JR東日本マルス券', editorKey: 'JRWideTicket' },
			{ id: 2, name: '近距離きっぷ', disabled: true },
		],
	},
	{
		id: 2,
		logo: JNR_logo,
		abbr: 'JNR',
		name: '日本国有鉄道',
		defaultSelectedTicketId: 0,
		tickets: [{ id: 0, name: '硬券(C型券)', disabled: true }],
		disabled: true,
	},
	{
		id: 3,
		logo: TR_logo,
		abbr: 'TR',
		name: '臺鐵公司',
		defaultSelectedTicketId: 2,
		tickets: [
			{ id: 0, name: '大張橫票（第三代）', disabled: true },
			{ id: 1, name: '小張直票（第三代）', disabled: true },
			{ id: 2, name: '直票（第四代）', disabled: true },
		],
		disabled: true,
	},
	{
		id: 4,
		logo: THSR_logo,
		abbr: 'THSR',
		name: '台灣高鐵',
		defaultSelectedTicketId: 0,
		tickets: [],
		disabled: true,
	},
	{
		id: 5,
		logo: VNR_logo,
		abbr: 'VNR',
		name: (
			<ruby>
				總<rt>Tổng</rt>公<rt>công</rt>司<rt>ty</rt>塘<rt>Đường</rt>鐡<rt>sắt</rt>越<rt>Việt</rt>南<rt>Nam</rt>
			</ruby>
		),
		defaultSelectedTicketId: 0,
		tickets: [],
		disabled: true,
	},
	{
		id: 6,
		logo: KORAIL_logo,
		abbr: 'KORAIL',
		name: (
			<ruby>
				韓<rt>한</rt>國<rt>국</rt>鐵<rt>철</rt>道<rt>도</rt>公<rt>공</rt>社<rt>사</rt>
			</ruby>
		),
		defaultSelectedTicketId: 0,
		tickets: [],
		disabled: true,
	},
];

export function getCompanyById(companyId: number): Company | undefined {
	return companyList.find((c) => c.id === companyId);
}

export function getTicketType(companyId: number, ticketTypeId: number): TicketType | undefined {
	return getCompanyById(companyId)?.tickets?.find((t) => t.id === ticketTypeId);
}

export function getDefaultTicketId(companyId: number): number {
	const company = getCompanyById(companyId);
	if (company?.defaultSelectedTicketId !== undefined) {
		return company.defaultSelectedTicketId;
	}
	return company?.tickets?.[0]?.id ?? 0;
}
