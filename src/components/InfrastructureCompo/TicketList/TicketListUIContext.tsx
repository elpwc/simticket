'use client';

import { createContext, useContext } from 'react';

/** 供 Header Trigger 等跨组件调用：打开移动 Sheet、读取数量 */
export interface TicketListUIContextValue {
	count: number;
	isCompactLayout: boolean;
	openPanel: () => void;
}

const TicketListUIContext = createContext<TicketListUIContextValue | null>(null);

export const TicketListUIProvider = TicketListUIContext.Provider;

export function useTicketListUI(): TicketListUIContextValue {
	const ctx = useContext(TicketListUIContext);
	if (!ctx) {
		throw new Error('useTicketListUI must be used within TicketListProvider');
	}
	return ctx;
}
