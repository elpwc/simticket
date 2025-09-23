import CR_logo from '../assets/companyLogos/China_Railways.svg';
import JR_logo from '../assets/companyLogos/JR_logo_JRgroup.svg';
import TR_logo from '../assets/companyLogos/ROC_Taiwan_Railways_Administration_Logo.svg';
import VNR_logo from '../assets/companyLogos/Đsvn.png';
import THSR_logo from '../assets/companyLogos/THSR.svg';
import KORAIL_logo from '../assets/companyLogos/Korail_logo.svg';
import { StaticImageData } from 'next/image';
import { JSX } from 'react';

export interface Company {
	logo: string | StaticImageData;
	abbr: string;
	name: string | JSX.Element;
	disabled?: boolean;
	tickets?: { name: string | JSX.Element; disabled?: boolean }[];
}

export const companyList: Company[] = [
	{
		logo: CR_logo,
		abbr: 'CR',
		name: '中国国家铁路集团',
		tickets: [
			{
				name: '红票',
			},
			{
				name: '蓝票',
			},
		],
	},
	{
		logo: JR_logo,
		abbr: 'JR',
		name: '日本旅客鉄道',
	},
	{
		logo: TR_logo,
		abbr: 'TR',
		name: '臺鐵公司',
	},
	{
		logo: THSR_logo,
		abbr: 'THSR',
		name: '台灣高鐵',
	},
	{
		logo: VNR_logo,
		abbr: 'VNR',
		name: (
			<ruby>
				總<rt>Tổng</rt>公<rt>công</rt>司<rt>ty</rt>塘<rt>Đường</rt>鐡<rt>sắt</rt>越<rt>Việt</rt>南<rt>Nam</rt>
			</ruby>
		),
	},
	{
		logo: KORAIL_logo,
		abbr: 'KORAIL',
		name: (
			<ruby>
				韓<rt>한</rt>國<rt>국</rt>鐵<rt>철</rt>道<rt>도</rt>公<rt>공</rt>社<rt>사</rt>
			</ruby>
		),
		disabled: true,
	},
];
