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
}

export const UploadedWorkItem = ({ uploadedTicketInfo, onLiked, onUndoLiked, onClick }: Props) => {
	const [showTicketViewerModal, setShowTicketViewerModal] = useState<boolean>(false);
	const [showCopyLinkModal, setShowCopyLinkModal] = useState<boolean>(false);

	const handleAddViews = () => {
		addViewsUploadedTicket(uploadedTicketInfo.id);
	};
	return (
		<>
			<div
				className="
			bg-white 
			rounded-[6px] 
			shadow-sm 
			hover:shadow-md 
			transition 
			hover:-translate-y-[2px] 
			p-2 
			pb-0
			w-[300px] 
			h-[-webkit-fill-available]
			m-1 
			border border-gray-200
			flex flex-col justify-between
		"
			>
				<div
					className="overflow-hidden rounded-lg cursor-pointer h-fit"
					onClick={() => {
						handleAddViews();
						setShowTicketViewerModal(true);
					}}
				>
					<TicketViewer width={280} height={-1} companyId={uploadedTicketInfo.companyId} ticketTypeId={uploadedTicketInfo.ticketId} ticketData={uploadedTicketInfo.data} />
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
