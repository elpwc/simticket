'use client';

import { useLocale } from '@/utils/hooks/useLocale';
import clsx from 'clsx';

interface Props {
	year: number;
	month?: number;
	day?: number;
	className?: string;
}

const ElementAddedDate = ({ year, month, day, className }: Props) => {
	const { t } = useLocale();
	let title = '';
	if (month && day) {
		title = t('editor.common.ElementAddedDate.descymd', { year: year, month: month, day: day });
	} else if (month) {
		title = t('editor.common.ElementAddedDate.descym', { year: year, month: month });
	} else {
		title = t('editor.common.ElementAddedDate.descy', { year: year });
	}
	return (
		<div className={clsx(className, 'flex flex-col gap-2 rounded-[4px] bg-[#3088cf] text-[10px] text-white px-1 w-fit h-min border border-[#1b6aaa]')} title={title}>
			<p>{t('editor.common.ElementAddedDate.title', { year: year })}</p>
		</div>
	);
};

export default ElementAddedDate;
