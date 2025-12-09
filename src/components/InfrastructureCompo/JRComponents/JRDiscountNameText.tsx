import { CSSProperties } from 'react';
import clsx from 'clsx';

interface Props {
	className?: string;
	style?: CSSProperties;
	name: string;
}

export const JRDiscountNameText = ({ className, style, name }: Props) => {
	let type = 1; // 1 普通，2 上下段，3 上 四角 下
	let stationName1 = name === '' ? '割引無し' : name,
		stationName2 = '',
		stationName3 = '';
	if (name.includes('/')) {
		const splitRes = name.split('/');
		if (splitRes.length === 2) {
			// 上下段 type
			type = 2;
			stationName1 = splitRes[0];
			stationName2 = splitRes[1];
		} else {
			// 上 四角 下 type
			type = 3;
			stationName1 = splitRes[0];
			stationName2 = splitRes[1];
			stationName3 = splitRes.slice(2, splitRes.length).join('/');
		}
	}

	return (
		<div className={clsx(className)} style={{ ...style, fontFamily: 'DotFont', fontWeight: 'bold' }}>
			{type === 1 ? (
				<span className={'text-[16px] border-2 p-[2px]'}>{stationName1}</span>
			) : (
				<div className={clsx('flex flex-col p-[2px]', type === 2 ? 'border-2' : '')}>
					{type === 2 ? (
						<span className={'text-[10px]'}>{stationName1}</span>
					) : (
						<div className="flex items-center">
							<span className={'text-[14px]'}>{stationName1}</span>
							<span className={'text-[12px] border-2'}>{stationName3}</span>
						</div>
					)}
					<span className={'text-[8px]'}>{stationName2}</span>
				</div>
			)}
		</div>
	);
};
