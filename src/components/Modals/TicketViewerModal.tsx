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
import { useEffect, useState } from 'react';
import { SaveImageModal } from './SaveImageModal';

interface Props {
	show: boolean;
	ticketInfo: UploadedTicketInfo | null;
	onClose: () => void;
	onShare?: () => void;
}

export const TicketViewerModal = ({ show, ticketInfo, onClose, onShare }: Props) => {
	const { t } = useLocale();
	const hint = useHint();
	const isMobile = useIsMobile();

	const [isFlipSide, setIsFlipSide] = useState(false);
	const [ticketViewerModalContentWidth, setTicketViewerModalContentWidth] = useState(-1);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);
	// for save modal default size
	const [saveModalDefaultSize, setSaveModalDefaultSize] = useState<[number, number]>([0, 0]);

	useEffect(() => {
		setTicketViewerModalContentWidth(document.getElementById('TicketViewerModal_content')?.clientWidth ?? -1);
	}, [window.innerWidth]);

	return (
		<Modal
			title={ticketInfo?.name === '' ? '作品閲覧' : ticketInfo?.name}
			isOpen={show}
			onClose={onClose}
			style={{ maxWidth: isMobile ? '100%' : '800px', width: isMobile ? '100%' : '80%' }}
			bodyStyle={{ padding: 0 }}
		>
			<div id="TicketViewerModal_content" className="flex flex-col">
				<TicketViewer
					width={ticketViewerModalContentWidth === -1 ? (isMobile ? 300 : 650) : ticketViewerModalContentWidth}
					height={-1}
					className="w-full m-auto md:p-10 p-0"
					companyId={ticketInfo === null ? 0 : ticketInfo.companyId}
					ticketTypeId={ticketInfo === null ? 4 : ticketInfo.ticketId}
					ticketData={ticketInfo === null ? CRWideTicketDrawParametersInitialValues : ticketInfo.data}
					isFlip={isFlipSide}
					//useTilt
					onCanvasSizeChanged={(w: number, h: number) => {
						setSaveModalDefaultSize([w, h]);
					}}
				/>
				<div className="flex ml-auto">
					<button
						className="ticketEditorTemplateToolBarItem flex items-center gap-1 primary green"
						onClick={() => {
							setShowSaveImageModal(true);
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
							<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
						</svg>
						{t('TicketEditorTemplate.saveButton')}
					</button>
					<button
						className="ticketEditorTemplateToolBarItem flex items-center gap-1"
						onClick={() => {
							setIsFlipSide((prev) => !prev);
						}}
					>
						{isFlipSide ? t('TicketEditorTemplate.reverse2') : t('TicketEditorTemplate.reverse')}
					</button>
					<button title={'copy URL'} onClick={onShare} className="text-xs rounded-md px-1 py-1 shadow-sm transition">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
						</svg>
					</button>
				</div>
				{ticketInfo !== null && <UploadedWorkItemToolbar uploadedTicketInfo={ticketInfo!} onLiked={() => {}} onUndoLiked={() => {}} />}
			</div>
			<SaveImageModal
				show={showSaveImageModal}
				ticketInfo={{
					companyId: ticketInfo?.companyId ?? 0,
					ticketTypeId: ticketInfo?.ticketId ?? 4,
					ticketData: ticketInfo?.data,
					id: '',
				}}
				saveFilename={`ticket_${ticketInfo?.data?.station1 ?? 'ticket'}-${ticketInfo?.data?.station2 ?? 'ticket'}`}
				onClose={() => {
					setShowSaveImageModal(false);
				}}
				defaultCanvasSize={saveModalDefaultSize}
			/>
		</Modal>
	);
};
