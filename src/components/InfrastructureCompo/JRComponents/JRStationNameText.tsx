import { CSSProperties } from 'react';
import { JRStationNameType } from '../../TicketEditors/JRWideTicket/type';
import clsx from 'clsx';

interface Props {
	className?: string;
	style?: CSSProperties;
	stationName: string;
	stationNameType?: JRStationNameType;
	stationAreaChar?: string;
}

export const JRStationNameText = ({ className, style, stationName, stationNameType = JRStationNameType.Normal, stationAreaChar = '' }: Props) => {
	let stationName1 = stationName,
		stationName2 = '',
		stationName3 = '';
	if (stationName.includes('/')) {
		const splitRes = stationName.split('/');
		stationName1 = splitRes[0];
		if (stationNameType === JRStationNameType.LeftLargeRightUpAndDown || stationNameType === JRStationNameType.LeftUpAndDownRightLarge) {
			stationName2 = splitRes[1];
			stationName3 = splitRes.slice(2, splitRes.length).join('/');
		} else {
			stationName2 = splitRes.slice(1, splitRes.length).join('/');
		}
	}

	let styleContainer = 'text-[16px]',
		style1 = '',
		style2 = '';

	switch (stationNameType) {
		case JRStationNameType.Normal:
			styleContainer = 'text-[16px]';
			style1 = '';
			style2 = '';
			break;
		case JRStationNameType.Small:
			styleContainer = 'text-[10px]';
			style1 = '';
			style2 = '';
			break;
		case JRStationNameType.UpAndDownAlignLeft:
			styleContainer = 'flex flex-col';
			style1 = 'text-[10px] text-left';
			style2 = 'text-[10px] text-left';
			break;
		case JRStationNameType.UpAlignLeftAndDownAlignRight:
			styleContainer = 'flex flex-col';
			style1 = 'text-[10px] text-left';
			style2 = 'text-[10px] text-right';
			break;
		case JRStationNameType.UpAlignLeftAndDownAlignCenter:
			styleContainer = 'flex flex-col';
			style1 = 'text-[10px] !text-left';
			style2 = 'text-[10px] !text-center';
			break;
		case JRStationNameType.LeftLargeAndRightSmall:
			styleContainer = '';
			style1 = 'text-[16px]';
			style2 = 'text-[10px]';
			break;
		case JRStationNameType.LeftSmallAndRightLarge:
			styleContainer = '';
			style1 = 'text-[10px]';
			style2 = 'text-[16px]';
			break;
		case JRStationNameType.LeftVerticalAndRightLarge:
			styleContainer = 'flex flex-row items-center';
			style1 = 'text-[10px] [writing-mode:vertical-lr]';
			style2 = 'text-[16px]';
			break;
		case JRStationNameType.LeftLargeAndRightVertical:
			styleContainer = 'flex flex-row items-center';
			style1 = 'text-[16px]';
			style2 = 'text-[10px] [writing-mode:vertical-lr]';
			break;
		case JRStationNameType.LeftLargeRightUpAndDown:
			styleContainer = 'flex flex-row';
			break;
		case JRStationNameType.LeftUpAndDownRightLarge:
			styleContainer = 'flex flex-row';
			break;
		default:
			break;
	}

	return (
		<div className={clsx(styleContainer, className)} style={{ ...style, fontFamily: 'DotFont', fontWeight: 'bold' }}>
			{stationAreaChar.length > 0 ? <span className="bg-black text-white text-[14px] p-[2px]">{stationAreaChar}</span> : <></>}
			{stationNameType === JRStationNameType.LeftLargeRightUpAndDown || stationNameType === JRStationNameType.LeftUpAndDownRightLarge ? (
				stationNameType === JRStationNameType.LeftLargeRightUpAndDown ? (
					<>
						<span className={'text-[16px]'}>{stationName1}</span>
						<div className="flex flex-col">
							<span className={'text-[10px]'}>{stationName2}</span>
							<span className={'text-[10px]'}>{stationName3}</span>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col">
							<span className={'text-[10px]'}>{stationName1}</span>
							<span className={'text-[10px]'}>{stationName2}</span>
						</div>
						<span className={'text-[16px]'}>{stationName3}</span>
					</>
				)
			) : (
				<>
					<span className={style1}>{stationName1}</span>
					<span className={style2}>{stationName2}</span>
				</>
			)}
		</div>
	);
};
