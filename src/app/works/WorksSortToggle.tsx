'use client';

import { OrderType } from '@/utils/api';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	orderBy: OrderType;
	onChange: (orderBy: OrderType) => void;
}

/**
 * 主列表排序切换：最新发布（createTime desc）与点赞最多（like desc）。
 * asc 固定为 false，由父组件 Works 维护。
 */
export function WorksSortToggle({ orderBy, onChange }: Props) {
	const { t } = useLocale();

	return (
		<div className="works-sort-toggle" role="group" aria-label={t('worksPage.sort.latest')}>
			<button
				type="button"
				className={'works-sort-toggle-btn' + (orderBy === OrderType.createTime ? ' selected' : '')}
				onClick={() => onChange(OrderType.createTime)}
			>
				{t('worksPage.sort.latest')}
			</button>
			<button
				type="button"
				className={'works-sort-toggle-btn' + (orderBy === OrderType.like ? ' selected' : '')}
				onClick={() => onChange(OrderType.like)}
			>
				{t('worksPage.sort.mostLiked')}
			</button>
		</div>
	);
}
