'use client';

import { UploadedTicketInfo } from '@/utils/utils';
import { TicketViewer } from './ticketViewer';
import { UploadedWorkItemToolbar } from './UploadedWorkItemToolbar';
import { TicketViewerModal } from '../Modals/TicketViewerModal';
import { useState } from 'react';
import { addViewsUploadedTicket } from '@/utils/api';
import { CopyLinkModal } from '../Modals/CopyLinkModal';

interface Props {
	uploadedTicketInfo: UploadedTicketInfo;
	onLiked: () => void;
	onUndoLiked: () => void;
	onClick?: () => void;
	className?: string;
}

export const UploadedWorkItem = ({ uploadedTicketInfo, onLiked, onUndoLiked, onClick, className }: Props) => {
	const [showTicketViewerModal, setShowTicketViewerModal] = useState<boolean>(false);
	const [showCopyLinkModal, setShowCopyLinkModal] = useState<boolean>(false);

	const handleAddViews = () => {
		addViewsUploadedTicket(uploadedTicketInfo.id);
	};
	return (
		<>
			<div
				className={
					`bg-white rounded-[6px] shadow-sm hover:shadow-md transition hover:-translate-y-[2px] p-2 pb-0 w-full min-w-0 max-w-full overflow-hidden border border-gray-200 flex flex-col justify-between` +
					(className ? ` ${className}` : '')
				}
			>
				<div
					className="overflow-hidden rounded-lg cursor-pointer w-full max-w-full"
					onClick={() => {
						handleAddViews();
						setShowTicketViewerModal(true);
					}}
				>
					<TicketViewer
						width={280}
						height={-1}
						className="max-w-full h-auto"
						companyId={uploadedTicketInfo.companyId}
						ticketTypeId={uploadedTicketInfo.ticketId}
						ticketData={uploadedTicketInfo.data}
					/>
				</div>

				<UploadedWorkItemToolbar uploadedTicketInfo={uploadedTicketInfo} onLiked={onLiked} onUndoLiked={onUndoLiked} onClick={onClick} />
			</div>
			<TicketViewerModal show={showTicketViewerModal} ticketInfo={uploadedTicketInfo} onClose={() => setShowTicketViewerModal(false)} onShare={() => setShowCopyLinkModal(true)} />
			<CopyLinkModal
				show={showCopyLinkModal}
				ticketInfo={{
					companyId: uploadedTicketInfo.companyId,
					ticketTypeId: uploadedTicketInfo.ticketId,
					ticketData: uploadedTicketInfo.data,
					id: '',
				}}
				onClose={() => {
					setShowCopyLinkModal(false);
				}}
				ticketId={uploadedTicketInfo.id}
			/>
		</>
	);
};
