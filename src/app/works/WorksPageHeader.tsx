'use client';

import { OrderType } from '@/utils/api';
import { useLocale } from '@/utils/hooks/useLocale';
import { WorksSortToggle } from './WorksSortToggle';

interface Props {
	orderBy: OrderType;
	onOrderByChange: (orderBy: OrderType) => void;
	isMobile: boolean;
	filterExpanded: boolean;
	onFilterToggle: () => void;
	resultCountText: string | null;
	isInitialLoading: boolean;
}

/** 页面标题、排序切换与（移动端）筛选折叠按钮 */
export function WorksPageHeader({ orderBy, onOrderByChange, isMobile, filterExpanded, onFilterToggle, resultCountText, isInitialLoading }: Props) {
	const { t } = useLocale();

	return (
		<header className="works-page-header mb-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<WorksSortToggle orderBy={orderBy} onChange={onOrderByChange} />
					{isMobile && (
						<button type="button" className="works-filter-toggle-btn" onClick={onFilterToggle} aria-expanded={filterExpanded}>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
								<path d="M1.5 1.5A.5.5 0 0 1 2 0h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
							</svg>
							{filterExpanded ? t('worksPage.filter.toggleClose') : t('worksPage.filter.toggle')}
						</button>
					)}
				</div>
				{!isInitialLoading && resultCountText && <span className="text-sm text-gray-500 dark:text-neutral-400 tabular-nums">{resultCountText}</span>}
			</div>
		</header>
	);
}
