'use client';

import { AppContext } from '@/app/app';
import { useCompactTicketListLayout } from '@/utils/hooks';
import { TicketListItemProperty } from '@/utils/utils';
import { CRWideTicketDrawParameters } from '../../TicketEditors/CRWideTicket/type';
import { JRWideTicketDrawParameters } from '../../TicketEditors/JRWideTicket/type';
import { usePathname } from 'next/navigation';
import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TicketListDock } from './TicketListDock';
import { TicketListSheet } from './TicketListSheet';
import { TicketListUIProvider } from './TicketListUIContext';
import { useTicketListModals } from './useTicketListModals';

interface Props {
	children: ReactNode;
}

/**
 * 打印列表全局 Provider：
 * - 窄屏（≤767px）：Header 徽章 + Bottom Sheet，不占常驻底部空间
 * - 宽屏：底部 Dock，编辑页默认展开、其他页默认折叠
 * - Modal（导出/保存/预览）全局唯一挂载
 */
export function TicketListProvider({ children }: Props) {
	const pathname = usePathname();
	const isCompactLayout = useCompactTicketListLayout();
	const showAddButton = pathname === '/';

	const {
		ticketListItems,
		setTicketListItems,
		selectedCompanyId,
		selectedTicketId,
		editingTicketData,
	}: {
		ticketListItems: TicketListItemProperty[];
		setTicketListItems: React.Dispatch<React.SetStateAction<TicketListItemProperty[]>>;
		selectedCompanyId: number;
		selectedTicketId: number;
		editingTicketData: unknown;
	} = useContext(AppContext);

	const [sheetOpen, setSheetOpen] = useState(false);
	const { openExportList, openItemSave, openItemUpload, openItemViewer, modals } = useTicketListModals();

	// 窄屏下确保不残留 Dock 的 CSS 变量
	useEffect(() => {
		if (isCompactLayout) {
			document.documentElement.style.setProperty('--ticket-list-dock-height', '0px');
		}
	}, [isCompactLayout]);

	const handleAddCurrentEdit = useCallback(() => {
		setTicketListItems((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				companyId: selectedCompanyId,
				ticketTypeId: selectedTicketId,
				ticketData: structuredClone(editingTicketData) as CRWideTicketDrawParameters | JRWideTicketDrawParameters,
			},
		]);
	}, [setTicketListItems, selectedCompanyId, selectedTicketId, editingTicketData]);

	const handleClearList = useCallback(() => {
		setTicketListItems([]);
	}, [setTicketListItems]);

	const itemHandlers = useMemo(
		() => ({
			onDelete: (item: TicketListItemProperty) => {
				setTicketListItems((items) => items.filter((ci) => ci.id !== item.id));
			},
			onSave: openItemSave,
			onUpload: openItemUpload,
			onClick: openItemViewer,
		}),
		[setTicketListItems, openItemSave, openItemUpload, openItemViewer]
	);

	const listActions = useMemo(
		() => ({
			onExportList: openExportList,
			onClearList: handleClearList,
			onAddCurrentEdit: showAddButton ? handleAddCurrentEdit : undefined,
		}),
		[openExportList, handleClearList, handleAddCurrentEdit, showAddButton]
	);

	const uiContextValue = useMemo(
		() => ({
			count: ticketListItems.length,
			isCompactLayout,
			openPanel: () => setSheetOpen(true),
		}),
		[ticketListItems.length, isCompactLayout]
	);

	return (
		<TicketListUIProvider value={uiContextValue}>
			{children}

			{!isCompactLayout && (
				<TicketListDock
					items={ticketListItems}
					itemHandlers={itemHandlers}
					listActions={listActions}
					showAddButton={showAddButton}
					defaultCollapsed={pathname !== '/'}
				/>
			)}

			{isCompactLayout && (
				<TicketListSheet
					open={sheetOpen}
					onClose={() => setSheetOpen(false)}
					items={ticketListItems}
					itemHandlers={itemHandlers}
					listActions={listActions}
					showAddButton={showAddButton}
				/>
			)}

			{modals}
		</TicketListUIProvider>
	);
}
