'use client';

import { TicketListItemProperty } from '@/utils/utils';
import { TicketListViewItem } from '../ticketListViewItem';
import { TicketListItemHandlers } from './types';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	items: TicketListItemProperty[];
	handlers: TicketListItemHandlers;
	previewWidth?: number;
}

/** 移动 Sheet：两列网格，点击预览打开详情 Modal */
export function TicketListItemsGrid({ items, handlers, previewWidth = 120 }: Props) {
	const { t } = useLocale();

	if (items.length === 0) {
		return <div className="text-neutral-500 text-sm italic text-center py-8">{t('ticketListView.emptyList')}</div>;
	}

	return (
		<div className="grid grid-cols-2 gap-3 justify-items-center">
			{items.map((item) => (
				<div key={item.id} className="w-full flex justify-center">
					<TicketListViewItem
						width={previewWidth}
						height={-1}
						ticketInfo={item}
						layout="compact"
						onDelete={() => handlers.onDelete(item)}
						onSave={() => handlers.onSave(item)}
						onUpload={() => handlers.onUpload(item)}
						onClick={() => handlers.onClick(item)}
					/>
				</div>
			))}
		</div>
	);
}
