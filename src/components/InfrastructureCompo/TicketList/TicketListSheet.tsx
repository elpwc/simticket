'use client';

import { TicketListItemProperty } from '@/utils/utils';
import { useLocale } from '@/utils/hooks/useLocale';
import { TicketListActionsBar } from './TicketListActionsBar';
import { TicketListItemsGrid } from './TicketListItemsGrid';
import { TicketListActions, TicketListItemHandlers } from './types';
import './TicketListSheet.css';

interface Props {
	open: boolean;
	onClose: () => void;
	items: TicketListItemProperty[];
	itemHandlers: TicketListItemHandlers;
	listActions: TicketListActions;
	showAddButton: boolean;
}

/**
 * 移动端 Bottom Sheet：不占页面常驻空间，点击 Header 徽章后弹出。
 * 独立 overlay 实现自底部滑入（不依赖 Modal 居中布局）。
 */
export function TicketListSheet({ open, onClose, items, itemHandlers, listActions, showAddButton }: Props) {
	const { t } = useLocale();

	if (!open) return null;

	return (
		<div
			className="ticket-list-sheet-overlay"
			onClick={onClose}
			role="presentation"
		>
			<div
				className="ticket-list-sheet-panel"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label={t('ticketListView.panelTitle')}
			>
				<div className="ticket-list-sheet-header">
					<h2 className="ticket-list-sheet-title">
						{t('ticketListView.panelTitle')} ({items.length})
					</h2>
					<button type="button" className="ticket-list-sheet-close" onClick={onClose} aria-label="Close">
						×
					</button>
				</div>

				<div className="ticket-list-sheet-body">
					<TicketListItemsGrid items={items} handlers={itemHandlers} />
				</div>

				<TicketListActionsBar
					showAddButton={showAddButton}
					onExportList={listActions.onExportList}
					onClearList={listActions.onClearList}
					onAddCurrentEdit={listActions.onAddCurrentEdit}
					className="ticket-list-sheet-footer"
				/>
			</div>
		</div>
	);
}
