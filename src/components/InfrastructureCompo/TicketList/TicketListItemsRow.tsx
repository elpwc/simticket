'use client';

import { motion } from 'framer-motion';
import { TicketListItemProperty } from '@/utils/utils';
import { TicketListViewItem } from '../ticketListViewItem';
import { TicketListItemHandlers } from './types';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	items: TicketListItemProperty[];
	handlers: TicketListItemHandlers;
	previewWidth?: number;
}

/** 桌面 Dock：横向滚动预览条 */
export function TicketListItemsRow({ items, handlers, previewWidth = 160 }: Props) {
	const { t } = useLocale();

	if (items.length === 0) {
		return <div className="text-neutral-500 text-sm italic mx-auto py-3">{t('ticketListView.emptyList')}</div>;
	}

	return (
		<>
			{items.map((item) => (
				<motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
					<TicketListViewItem
						width={previewWidth}
						height={-1}
						ticketInfo={item}
						onDelete={() => handlers.onDelete(item)}
						onSave={() => handlers.onSave(item)}
						onUpload={() => handlers.onUpload(item)}
						onClick={() => handlers.onClick(item)}
					/>
				</motion.div>
			))}
		</>
	);
}
