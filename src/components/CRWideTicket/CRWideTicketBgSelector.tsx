import cr_red from '../../assets/tickets/cr_red.png';
import cr_blue from '../../assets/tickets/cr_blue.png';
import cr_mag_blue from '../../assets/tickets/cr_mag_blue.png';
import './index.css';

export enum CRTicketBackGround {
	SoftRed,
	SoftBlue,
	MagRed,
	MagBlue,
}

interface Props {
	value: CRTicketBackGround;
	onChange: (value: CRTicketBackGround) => void;
}

const bgInfos = [
	{
		id: 'cr_red',
		title: '软纸红票',
		img: cr_red.src,
		value: CRTicketBackGround.SoftRed,
	},
	{
		id: 'cr_blue',
		title: '软纸蓝票',
		img: cr_blue.src,
		value: CRTicketBackGround.SoftBlue,
	},
	{
		id: 'cr_mag_red',
		title: '磁纸红票',
		img: cr_red.src,
		value: CRTicketBackGround.MagRed,
		disabled: true,
	},
	{
		id: 'cr_mag_blue',
		title: '磁纸蓝票',
		img: cr_mag_blue.src,
		value: CRTicketBackGround.MagBlue,
	},
];

export const CRWideTicketBgSelector = ({ value, onChange }: Props) => {
	return (
		<div className="flex flex-row gap-4">
			{bgInfos.map((bgInfo) => {
				return (
					<label
						className={'CRWideTicketBgSelector-item flex items-center' + (value === bgInfo.value ? ' selected' : '') + (bgInfo.disabled === true ? ' disabled' : '')}
						key={bgInfo.id}
						onClick={() => {
							if (bgInfo.disabled !== true) {
								onChange(bgInfo.value);
							}
						}}
					>
						<div className="flex flex-col items-center">
							<img src={bgInfo.img} alt={bgInfo.id} className="w-16 h-auto border" />
							{bgInfo.title}
						</div>
					</label>
				);
			})}
		</div>
	);
};
