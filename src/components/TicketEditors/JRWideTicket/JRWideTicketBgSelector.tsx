import jr_h from '../../../assets/tickets_preview/jr_h.jpg';
import jr_e from '../../../assets/tickets_preview/jr_e.jpg';
import jr_c from '../../../assets/tickets_preview/jr_c.jpg';
import jr_w from '../../../assets/tickets_preview/jr_w.jpg';
import jr_s from '../../../assets/tickets_preview/jr_s.jpg';
import jr_k from '../../../assets/tickets_preview/jr_k.jpg';
import './index.css';

export enum JRTicketBackGround {
	JR_H,
	JR_E,
	JR_C,
	JR_W,
	JR_S,
	JR_K,
	JR_Empty,
}

interface Props {
	value: JRTicketBackGround;
	onChange: (value: JRTicketBackGround) => void;
}

const bgInfos = [
	{
		id: 'jr_h',
		title: 'ＪＲ北海道',
		img: jr_h.src,
		value: JRTicketBackGround.JR_H,
		disabled: false,
	},
	{
		id: 'jr_e',
		title: 'ＪＲ東日本',
		img: jr_e.src,
		value: JRTicketBackGround.JR_E,
	},
	{
		id: 'jr_c',
		title: 'ＪＲ東海',
		img: jr_c.src,
		value: JRTicketBackGround.JR_C,
	},
	{
		id: 'jr_w',
		title: 'ＪＲ西日本',
		img: jr_w.src,
		value: JRTicketBackGround.JR_W,
	},
	{
		id: 'jr_s',
		title: 'ＪＲ四国',
		img: jr_s.src,
		value: JRTicketBackGround.JR_S,
	},
	{
		id: 'jr_k',
		title: 'ＪＲ九州',
		img: jr_k.src,
		value: JRTicketBackGround.JR_K,
	},
	{
		id: 'jr_empty',
		title: '背景無し',
		img: jr_k.src,
		value: JRTicketBackGround.JR_Empty,
	},
];

export const JRWideTicketBgSelector = ({ value, onChange }: Props) => {
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
