import CR_logo from '../assets/companyLogos/China_Railways.svg';
import JR_logo from '../assets/companyLogos/JR_logo_JRgroup.svg';
import TR_logo from '../assets/companyLogos/ROC_Taiwan_Railways_Administration_Logo.svg';
import VNR_logo from '../assets/companyLogos/Đsvn.png';
import THSR_logo from '../assets/companyLogos/THSR.svg';
import KORAIL_logo from '../assets/companyLogos/Korail_logo.svg';
import JNR_logo from '../assets/companyLogos/Japanese_National_Railway_logo.svg';
import { StaticImageData } from 'next/image';
import { JSX } from 'react';

export interface Company {
	logo: string | StaticImageData;
	abbr: string;
	name: string | JSX.Element;
	defaultSelectedTicketId?: number;
	disabled?: boolean;
	tickets?: { name: string | JSX.Element; disabled?: boolean }[];
}

export const companyList: Company[] = [
	{
		logo: CR_logo,
		abbr: 'CR',
		name: '中国国家铁路集团',
		defaultSelectedTicketId: 4,
		tickets: [
			{
				name: '卡片式客票',
				disabled: true,
			},
			{
				name: 'II型客票(1984)',
				disabled: true,
			},
			{
				name: '计算机客票(1996)',
				disabled: true,
			},
			{
				name: '计算机客票(2000)',
				disabled: true,
			},
			{
				name: '计算机客票(2010)',
			},
		],
	},
	{
		logo: JR_logo,
		abbr: 'JR',
		name: '日本旅客鉄道',
		defaultSelectedTicketId: 1,
		tickets: [
			{
				name: '硬券(D型券)',
				disabled: true,
			},
			{
				name: 'JR東日本マルス券',
			},
			{
				name: '近距離きっぷ',
				disabled: true,
			},
		],
	},
	{
		logo: JNR_logo,
		abbr: 'JNR',
		name: '日本国有鉄道',
		defaultSelectedTicketId: 0,
		tickets: [
			{
				name: '硬券(C型券)',
				disabled: true,
			},
		],
		disabled: true,
	},
	{
		logo: TR_logo,
		abbr: 'TR',
		name: '臺鐵公司',
		defaultSelectedTicketId: 2,
		tickets: [
			{
				name: '大張橫票（第三代）',
				disabled: true,
			},
			{
				name: '小張直票（第三代）',
				disabled: true,
			},
			{
				name: '直票（第四代）',
				disabled: true,
			},
		],
		disabled: true,
	},
	{
		logo: THSR_logo,
		abbr: 'THSR',
		name: '台灣高鐵',
		defaultSelectedTicketId: 0,
		tickets: [],
		disabled: true,
	},
	{
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
