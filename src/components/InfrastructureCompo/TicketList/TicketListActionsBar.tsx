'use client';

import { useLocale } from '@/utils/hooks/useLocale';
import { useIsMobile } from '@/utils/hooks';
import { TicketListActions } from './types';

interface Props extends TicketListActions {
	showAddButton: boolean;
	className?: string;
}

/** Dock / Sheet 共用的底部操作栏：添加当前编辑、导出 A4、清空 */
export function TicketListActionsBar({ showAddButton, onExportList, onClearList, onAddCurrentEdit, className = '' }: Props) {
	const { t } = useLocale();
	const isMobile = useIsMobile();

	return (
		<div className={`flex flex-wrap justify-center items-center gap-2 p-2 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 ${className}`}>
			{showAddButton && onAddCurrentEdit && (
				<button type="button" className="primary flex items-center gap-1" onClick={onAddCurrentEdit}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
					</svg>
					{isMobile ? t('ticketListView.addResultToListButtonShort') : t('ticketListView.addResultToListButton')}
				</button>
			)}

			<button type="button" className="primary green flex items-center gap-1" onClick={onExportList}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
					<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
				</svg>
				{isMobile ? t('ticketListView.exportListShort') : t('ticketListView.exportList')}
			</button>

			<button type="button" className="alert" onClick={onClearList}>
				{t('ticketListView.clearListButton')}
			</button>
		</div>
	);
}
