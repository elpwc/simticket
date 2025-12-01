'use client';

import { Modal } from '../InfrastructureCompo/Modal';
import { useLocale } from '@/utils/hooks/useLocale';
import { getTicketURL, getUploadedTicketURL, UploadedTicketInfo } from '@/utils/utils';
import './index.css';
import { TicketViewer } from '../InfrastructureCompo/ticketViewer';
import { useHint } from '../InfrastructureCompo/HintProvider';
import { CRWideTicketDrawParametersInitialValues } from '../TicketEditors/CRWideTicket/value';
import { UploadedWorkItemToolbar } from '../InfrastructureCompo/UploadedWorkItemToolbar';
import { useIsMobile } from '@/utils/hooks';
import { useState } from 'react';

interface Props {
	show: boolean;
	ticketInfo: UploadedTicketInfo | null;
	onClose: () => void;
}

export const TicketViewerModal = ({ show, ticketInfo, onClose }: Props) => {
	const { t } = useLocale();
	const hint = useHint();
	const isMobile = useIsMobile();

	const [isFlipSide, setIsFlipSide] = useState(false);

	return (
		<Modal
			title={ticketInfo?.name === '' ? '作品閲覧' : ticketInfo?.name}
			isOpen={show}
			onClose={onClose}
			style={{ maxWidth: isMobile ? '100%' : '800px', width: isMobile ? '100%' : '80%' }}
			bodyStyle={{ padding: 0 }}
		>
			<div className="flex flex-col">
				<TicketViewer
					width={isMobile ? 500 : 1000}
					height={-1}
					className="w-full m-auto md:p-10 p-0"
					companyId={ticketInfo === null ? 0 : ticketInfo.companyId}
					ticketTypeId={ticketInfo === null ? 4 : ticketInfo.ticketId}
					ticketData={ticketInfo === null ? CRWideTicketDrawParametersInitialValues : ticketInfo.data}
					isFlip={isFlipSide}
				/>
				<div className="flex ml-auto">
					<button
						className="ticketEditorTemplateToolBarItem flex items-center gap-1"
						onClick={() => {
							setIsFlipSide((prev) => !prev);
						}}
					>
						{isFlipSide ? t('TicketEditorTemplate.reverse2') : t('TicketEditorTemplate.reverse')}
					</button>
					<button
						title={'copy URL'}
						onClick={() => {
							navigator.clipboard
								.writeText(getUploadedTicketURL(ticketInfo?.ticketId || 0))
								.then(() => hint('top', t('TicketListViewItem.copyLink.hint.success')))
								.catch((err) => hint('top', t('TicketListViewItem.copyLink.hint.fail'), 'red', 2000));
						}}
						className="text-xs rounded-md px-1 py-1 shadow-sm transition"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
						</svg>
					</button>
				</div>
				{ticketInfo !== null && <UploadedWorkItemToolbar uploadedTicketInfo={ticketInfo!} onLiked={() => {}} onUndoLiked={() => {}} />}
			</div>
		</Modal>
	);
};
