import cr_red_preview from '../../../assets/tickets_preview/cr_red.png';
import cr_blue_preview from '../../../assets/tickets_preview/cr_blue.png';
import cr_mag_blue_preview from '../../../assets/tickets_preview/cr_mag_blue.png';
import cr_mag_red_preview from '../../../assets/tickets_preview/cr_mag_red.png';
import cr_preview from '../../../assets/tickets_preview/cr.png';
import cr_mag_preview from '../../../assets/tickets_preview/cr_mag.png';
import './index.css';
import { CRTicketBackGround, TongPiaoStyle } from './type';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	value: TongPiaoStyle;
	onChange: (value: TongPiaoStyle) => void;
}

export const CRWideTicketTongpiaoTypeSelector = ({ value, onChange }: Props) => {
	const { t } = useLocale();

	return (
		<div className="flex flex-row gap-4 flex-wrap w-full">
			<label
				className={'CRWideTicketBgSelector-item flex-[50px] items-center !w-min' + (value === TongPiaoStyle.Old ? ' selected' : '')}
				key={TongPiaoStyle.Old}
				onClick={() => {
					onChange(TongPiaoStyle.Old);
				}}
			>
				<div className="flex flex-col items-center">
					<div className="border-[1px] w-[100px] bg-white">
						<div className="m-1 bg-red-200">
							<p className="w-full text-center font-bold">出發→到达</p>
							<p className="text-[10px]">{'(经由) (普快至到达)'}</p>
							<p className="w-full text-right">至 中转</p>
						</div>
					</div>
					{t('editor.cr.jisuanjikepiao2010.stationInfo.tongpiaoStyleOld')}
				</div>
			</label>
			<label
				className={'CRWideTicketBgSelector-item flex-[50px] items-center !w-min' + (value === TongPiaoStyle.New ? ' selected' : '')}
				key={TongPiaoStyle.New}
				onClick={() => {
					onChange(TongPiaoStyle.New);
				}}
			>
				<div className="flex flex-col items-center">
					<div className="border-[1px] w-[100px] bg-white">
						<div className="m-1 bg-red-200">
							<p className="w-full text-center font-bold">出發→中转</p>
							<p className="text-[6px]">{'　'}</p>
							<p className="w-full text-[10px]">
								<span className="text-[10px] font-bold">普客</span>经由<span className="text-[10px] font-bold">经</span>至<span className="text-[10px] font-bold">到达</span>
							</p>
							<p className="text-[6px]">{'　'}</p>
						</div>
					</div>
					{t('editor.cr.jisuanjikepiao2010.stationInfo.tongpiaoStyleNew')}
				</div>
			</label>
			{/* <label
				className={'CRWideTicketBgSelector-item flex-[50px] items-center !w-auto' + (value === TongPiaoStyle.None ? ' selected' : '')}
				key={TongPiaoStyle.None}
				onClick={() => {
					onChange(TongPiaoStyle.None);
				}}
			>
				<div className="flex flex-col items-center">
					<div className="border-[1px] w-[100px] bg-white">
						<div className="m-1 bg-red-200">

            <p className="w-full text-center font-bold">出發→到达</p>
							<p className="text-[10px]">{'　'}</p>
							<p className="w-full text-right">{'　'}</p>
						</div>
					</div>
					{t('editor.cr.jisuanjikepiao2010.stationInfo.tongpiaoStyleNone')}
				</div>
			</label> */}
		</div>
	);
};
