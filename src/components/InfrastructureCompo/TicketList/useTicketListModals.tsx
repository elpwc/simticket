'use client';

import { useRef, useState } from 'react';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { SaveListModal } from '../../Modals/SaveListModal';
import { SaveImageModal } from '../../Modals/SaveImageModal';
import { UploadTicketModal } from '../../Modals/UploadTicketModal';
import { TicketListViewerModal } from '../../Modals/TicketListViewerModal';

/**
 * 打印列表相关的 Modal 状态（导出 A4、单张保存、投稿、预览）。
 * 与 Dock/Sheet 解耦，避免重复挂载。
 */
export function useTicketListModals() {
	const currentOperatingTicketItemRef = useRef<TicketListItemProperty | null>(null);

	const [saveListModalOpen, setSaveListModalOpen] = useState(false);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);
	const [showUploadTicketModal, setShowUploadTicketModal] = useState(false);
	const [showTicketListViewerModal, setShowTicketListViewerModal] = useState(false);
	const [selectedTicketForViewer, setSelectedTicketForViewer] = useState<TicketListItemProperty | null>(null);

	const openExportList = () => setSaveListModalOpen(true);

	const openItemSave = (item: TicketListItemProperty) => {
		currentOperatingTicketItemRef.current = item;
		setShowSaveImageModal(true);
	};

	const openItemUpload = (item: TicketListItemProperty) => {
		currentOperatingTicketItemRef.current = item;
		setShowUploadTicketModal(true);
	};

	const openItemViewer = (item: TicketListItemProperty) => {
		setSelectedTicketForViewer(item);
		setShowTicketListViewerModal(true);
	};

	const modals = (
		<>
			<SaveListModal show={saveListModalOpen} onClose={() => setSaveListModalOpen(false)} />
			<SaveImageModal
				show={showSaveImageModal}
				ticketInfo={currentOperatingTicketItemRef.current!}
				saveFilename=""
				onClose={() => setShowSaveImageModal(false)}
				defaultCanvasSize={get_CanvasOrImageSize_Of_Ticket_By_TicketType(
					currentOperatingTicketItemRef.current?.companyId ?? 0,
					currentOperatingTicketItemRef.current?.ticketTypeId ?? 0,
					TicketSizeType.CanvasSize,
					//@ts-expect-error wait to fix
					currentOperatingTicketItemRef.current?.ticketData.background
				)}
			/>
			<UploadTicketModal
				show={showUploadTicketModal}
				ticketInfo={{
					companyId: currentOperatingTicketItemRef.current?.companyId ?? 0,
					ticketTypeId: currentOperatingTicketItemRef.current?.ticketTypeId ?? 0,
					//@ts-expect-error wait to fix
					ticketData: currentOperatingTicketItemRef.current?.ticketData,
					id: currentOperatingTicketItemRef.current?.id ?? '',
				}}
				onClose={() => setShowUploadTicketModal(false)}
			/>
			<TicketListViewerModal
				show={showTicketListViewerModal}
				ticketInfo={selectedTicketForViewer!}
				onClose={() => setShowTicketListViewerModal(false)}
			/>
		</>
	);

	return {
		openExportList,
		openItemSave,
		openItemUpload,
		openItemViewer,
		modals,
	};
}
