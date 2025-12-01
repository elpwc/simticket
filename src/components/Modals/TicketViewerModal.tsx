'use client';

import { Modal } from '../InfrastructureCompo/Modal';
import { useLocale } from '@/utils/hooks/useLocale';
import { UploadedTicketInfo } from '@/utils/utils';
import './index.css';
import { TicketViewer } from '../InfrastructureCompo/ticketViewer';
import { useHint } from '../InfrastructureCompo/HintProvider';
import { CRWideTicketDrawParametersInitialValues } from '../TicketEditors/CRWideTicket/value';
import { UploadedWorkItemToolbar } from '../InfrastructureCompo/UploadedWorkItemToolbar';
import { useIsMobile } from '@/utils/hooks';

interface Props {
	show: boolean;
	ticketInfo: UploadedTicketInfo | null;
	onClose: () => void;
}

export const TicketViewerModal = ({ show, ticketInfo, onClose }: Props) => {
	const { t } = useLocale();
	const hint = useHint();
	const isMobile = useIsMobile();

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
					style={{ boxShadow: '0 0 3px 0px #858585' }}
					companyId={ticketInfo === null ? 0 : ticketInfo.companyId}
					ticketTypeId={ticketInfo === null ? 4 : ticketInfo.ticketId}
					ticketData={ticketInfo === null ? CRWideTicketDrawParametersInitialValues : ticketInfo.data}
				/>
				{ticketInfo !== null && <UploadedWorkItemToolbar uploadedTicketInfo={ticketInfo!} onLiked={() => {}} onUndoLiked={() => {}} />}
			</div>
		</Modal>
	);
};
