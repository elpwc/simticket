'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TicketListItemProperty } from '@/utils/utils';
import { useLocale } from '@/utils/hooks/useLocale';
import { TicketListActionsBar } from './TicketListActionsBar';
import { TicketListItemsRow } from './TicketListItemsRow';
import { TicketListActions, TicketListItemHandlers } from './types';

interface Props {
	items: TicketListItemProperty[];
	itemHandlers: TicketListItemHandlers;
	listActions: TicketListActions;
	showAddButton: boolean;
	/** 非编辑页默认折叠，减少占用 */
	defaultCollapsed: boolean;
}

const DOCK_COLLAPSED_HEIGHT = 40;

/**
 * 桌面端底部 Dock：可折叠横条 + 横向车票预览。
 * 通过 CSS 变量 --ticket-list-dock-height 通知 main 预留底部空间。
 */
export function TicketListDock({ items, itemHandlers, listActions, showAddButton, defaultCollapsed }: Props) {
	const { t } = useLocale();
	const dockRef = useRef<HTMLDivElement>(null);
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

	// 路由切换时同步默认折叠状态
	useEffect(() => {
		setIsCollapsed(defaultCollapsed);
	}, [defaultCollapsed]);

	// 将 Dock 实际高度写入 CSS 变量，供 .app-main 动态 padding-bottom
	useEffect(() => {
		const root = document.documentElement;
		const updateHeight = () => {
			const height = isCollapsed ? DOCK_COLLAPSED_HEIGHT : (dockRef.current?.offsetHeight ?? DOCK_COLLAPSED_HEIGHT);
			root.style.setProperty('--ticket-list-dock-height', `${height}px`);
		};
		updateHeight();
		const ro = dockRef.current ? new ResizeObserver(updateHeight) : null;
		if (dockRef.current && ro) ro.observe(dockRef.current);
		return () => {
			ro?.disconnect();
			root.style.setProperty('--ticket-list-dock-height', '0px');
		};
	}, [isCollapsed, items.length]);

	return (
		<motion.div
			ref={dockRef}
			animate={{
				y: isCollapsed ? `calc(100% - ${DOCK_COLLAPSED_HEIGHT}px)` : '0%',
				height: isCollapsed ? DOCK_COLLAPSED_HEIGHT : 'auto',
			}}
			transition={{ type: 'keyframes', duration: 0.2, damping: 15, stiffness: 240 }}
			className="fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.15)] border-t border-neutral-300 dark:border-neutral-700 overflow-hidden"
		>
			{isCollapsed && (
				<div
					className="h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 text-sm relative cursor-pointer"
					onClick={() => setIsCollapsed(false)}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => e.key === 'Enter' && setIsCollapsed(false)}
				>
					<span className="select-none">
						{t('ticketListView.listSummary')}
						{items.length}
					</span>
					<div className="absolute right-1 flex w-fit items-center">
						<span>{t('ticketListView.openListButtonText')}</span>
						<button
							type="button"
							className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
							onClick={(e) => {
								e.stopPropagation();
								setIsCollapsed(false);
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
							</svg>
						</button>
					</div>
				</div>
			)}

			{!isCollapsed && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex flex-col">
					<div className="flex items-center gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
						<TicketListItemsRow items={items} handlers={itemHandlers} />
					</div>

					<div className="flex justify-center items-center gap-3 p-1 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
						<div className="flex flex-wrap justify-center flex-1">
							<TicketListActionsBar
								showAddButton={showAddButton}
								onExportList={listActions.onExportList}
								onClearList={listActions.onClearList}
								onAddCurrentEdit={listActions.onAddCurrentEdit}
								className="border-0 bg-transparent p-0 gap-3"
							/>
						</div>
						<div className="flex w-fit shrink-0 items-center justify-end text-neutral-600 dark:text-neutral-300 text-sm pr-1">
							<span className="break-keep">{t('ticketListView.hideListButtonText')}</span>
							<button
								type="button"
								className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
								onClick={() => setIsCollapsed(true)}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
									<path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
								</svg>
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
}
