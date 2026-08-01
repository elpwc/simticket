'use client';

import { useTicketListUI } from './TicketListUIContext';
import { useLocale } from '@/utils/hooks/useLocale';

/**
 * Header 导航栏中的打印列表入口（仅窄屏布局显示）。
 * 有车票时显示数量徽章。
 */
export function TicketListTrigger() {
	const { t } = useLocale();
	const { count, isCompactLayout, openPanel } = useTicketListUI();

	if (!isCompactLayout) return null;

	return (
		<button
			type="button"
			className="navitem relative flex items-center gap-1 !overflow-visible border-0 bg-transparent text-inherit"
			onClick={openPanel}
			aria-label={t('ticketListView.triggerLabel')}
			title={t('ticketListView.triggerLabel')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
				<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
				<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
			</svg>
			{!count && <span className="hidden sm:inline text-xs">{t('ticketListView.triggerLabel')}</span>}
			{count > 0 && (
				<span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] font-bold leading-4 text-white bg-red-500 rounded-full text-center">
					{count > 99 ? '99+' : count}
				</span>
			)}
		</button>
	);
}
