'use client';

import { useLocale } from '@/utils/hooks/useLocale';
import clsx from 'clsx';

interface Props {
	year?: number;
	month?: number;
	day?: number;
	end_year?: number;
	end_month?: number;
	end_day?: number;
	className?: string;
}

const ElementAddedDate = ({ year, month, day, end_year, end_month, end_day, className }: Props) => {
	const { t } = useLocale();
	let title = t('editor.common.ElementAddedDate.thisElement');
	if (year && month && day) {
		title += t('editor.common.ElementAddedDate.titlestartymd', { year: year, month: month, day: day });
	} else if (year && month) {
		title += t('editor.common.ElementAddedDate.titlestartym', { year: year, month: month });
	} else if (year) {
		title += t('editor.common.ElementAddedDate.titlestarty', { year: year });
	}
	if (end_year && end_month && end_day) {
		title += title.length === 0 ? '' : ',' + t('editor.common.ElementAddedDate.titleendymd', { end_year: end_year, end_month: end_month, end_day: end_day });
	} else if (end_year && end_month) {
		title += title.length === 0 ? '' : ',' + t('editor.common.ElementAddedDate.titleendym', { end_year: end_year, end_month: end_month });
	} else if (end_year) {
		title += title.length === 0 ? '' : ',' + t('editor.common.ElementAddedDate.titleendy', { end_year: end_year });
	}
	let caption = '';
	if (year && end_year) {
		caption = t('editor.common.ElementAddedDate.captionstarttoend', { year: year, end_year: end_year });
	} else if (year) {
		caption = t('editor.common.ElementAddedDate.captionstart', { year: year });
	} else if (end_year) {
		caption = t('editor.common.ElementAddedDate.captionend', { end_year: end_year });
	}
	return (
		<div className={clsx(className, 'flex flex-col gap-2 rounded-[4px] bg-[#3088cf] text-[10px] text-white px-1 w-fit h-min border border-[#1b6aaa]')} title={title}>
			<p>{caption}</p>
		</div>
	);
};

export default ElementAddedDate;
