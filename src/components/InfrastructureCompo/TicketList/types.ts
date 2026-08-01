import { TicketListItemProperty } from '@/utils/utils';

/** 列表项操作回调，由 Provider 统一注入到 Dock / Sheet */
export interface TicketListItemHandlers {
	onDelete: (item: TicketListItemProperty) => void;
	onSave: (item: TicketListItemProperty) => void;
	onUpload: (item: TicketListItemProperty) => void;
	onClick: (item: TicketListItemProperty) => void;
}

/** 列表级操作（导出、清空、添加当前编辑结果） */
export interface TicketListActions {
	onExportList: () => void;
	onClearList: () => void;
	onAddCurrentEdit?: () => void;
}
