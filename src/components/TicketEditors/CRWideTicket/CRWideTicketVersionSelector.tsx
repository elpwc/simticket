import cr_red_preview from '../../../assets/tickets_preview/cr_red.png';
import cr_blue_preview from '../../../assets/tickets_preview/cr_blue.png';
import cr_mag_blue_preview from '../../../assets/tickets_preview/cr_mag_blue.png';
import cr_mag_red_preview from '../../../assets/tickets_preview/cr_mag_red.png';
import cr_preview from '../../../assets/tickets_preview/cr.png';
import cr_mag_preview from '../../../assets/tickets_preview/cr_mag.png';
import './index.css';
import { CRWideTicketVersion } from './type';

interface Props {
	value: CRWideTicketVersion;
	onChange: (value: CRWideTicketVersion) => void;
}

const bgInfos = [
	{
		id: '1996',
		title: '1996版',
		img: cr_red_preview.src,
		value: CRWideTicketVersion.V1996,
		disabled: false,
	},
	{
		id: '1997',
		title: '1997版',
		img: cr_blue_preview.src,
		value: CRWideTicketVersion.V1997,
	},
	{
		id: '2000',
		title: '2000版',
		img: cr_blue_preview.src,
		value: CRWideTicketVersion.V2000,
	},
	{
		id: '2006',
		title: '2006版',
		img: cr_mag_red_preview.src,
		value: CRWideTicketVersion.V2006,
	},
	{
		id: '2009',
		title: '2009版',
		img: cr_mag_blue_preview.src,
		value: CRWideTicketVersion.V2009,
	},
	{
		id: '2011',
		title: '2011版',
		img: cr_preview.src,
		value: CRWideTicketVersion.V2011,
	},
	{
		id: '2015',
		title: '2015版',
		img: cr_mag_preview.src,
		value: CRWideTicketVersion.V2015,
	},
	{
		id: '2022',
		title: '2022版',
		img: cr_mag_preview.src,
		value: CRWideTicketVersion.V2022,
	},
];

export const CRWideTicketVersionSelector = ({ value, onChange }: Props) => {
	return (
		<div className="flex flex-row gap-4 flex-wrap">
			{bgInfos.map((bgInfo) => {
				return (
					<label
						className={'CRWideTicketBgSelector-item flex-[50px] items-center' + (value === bgInfo.value ? ' selected' : '') + (bgInfo.disabled === true ? ' disabled' : '')}
						key={bgInfo.id}
						onClick={() => {
							if (bgInfo.disabled !== true) {
								onChange(bgInfo.value);
							}
						}}
					>
						<div className="flex flex-col items-center">
							<img src={bgInfo.img} alt={bgInfo.id} className="w-16 h-auto border border-[lab(88_0_-0.01)]" />
							{bgInfo.title}
						</div>
					</label>
				);
			})}
		</div>
	);
};
