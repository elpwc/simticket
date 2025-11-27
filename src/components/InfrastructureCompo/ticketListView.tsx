import { AppContext } from '@/app/app';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { TicketListViewItem } from './ticketListViewItem';
import { useLocale } from '@/utils/hooks/useLocale';
import { SaveListModal } from '../Modals/SaveListModal';
import { SaveImageModal } from '../Modals/SaveImageModal';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/utils/hooks';
import { UploadTicketModal } from '../Modals/UploadTicketModal';

interface Props {
	showAddButton?: boolean;
}

export const TicketListView = ({ showAddButton = true }: Props) => {
	const { t } = useLocale();
	const isMobile = useIsMobile();
	// object to save
	const currentOperatingTicketItemRef = useRef<TicketListItemProperty | null>(null);

	const [saveListModalOpen, setSaveListModalOpen] = useState(false);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);
	const [showUploadTicketModal, setShowUploadTicketModal] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	const {
		ticketListItems,
		setTicketListItems,
	}: {
		ticketListItems: TicketListItemProperty[];
		setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>>;
	} = useContext(AppContext);

	const { selectedCompanyId, selectedTicketId, editingTicketData } = useContext(AppContext);

	return (
		<div>
			<motion.div
				animate={{
					y: collapsed ? 'calc(100% - 40px)' : '0%',
					height: collapsed ? 40 : 'auto',
				}}
				transition={{ type: 'keyframes', duration: 0.2, damping: 15, stiffness: 240 }}
				className="fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.15)] border-t border-neutral-300 dark:border-neutral-700 overflow-hidden"
			>
				{/* 折叠後下方footer */}
				{collapsed && (
					<div className="h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 text-sm relative" onClick={() => setCollapsed(false)}>
						<span className="select-none">{t('ticketListView.listSummary') + ticketListItems.length.toString()}</span>
						<div className="absolute right-1 flex w-fit items-center">
							<span>{t('ticketListView.openListButtonText')}</span>
							<button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition" onClick={() => setCollapsed(false)}>
								<span className="text-lg leading-none">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
									</svg>
								</span>
							</button>
						</div>
					</div>
				)}

				{!collapsed && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col">
						<div className="flex items-center gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
							{ticketListItems.length === 0 ? (
								<div className="text-neutral-500 text-sm italic mx-auto">{t('ticketListView.emptyList') ?? 'No tickets yet.'}</div>
							) : (
								ticketListItems.map((item: TicketListItemProperty) => (
									<motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-shrink-0">
										<TicketListViewItem
											width={160}
											height={-1}
											ticketInfo={item}
											onDelete={() => {
												setTicketListItems((items) => items.filter((ci) => ci.id !== item.id));
											}}
											onSave={() => {
												currentOperatingTicketItemRef.current = item;
												setShowSaveImageModal(true);
											}}
											onUpload={() => {
												currentOperatingTicketItemRef.current = item;
												setShowUploadTicketModal(true);
											}}
										/>
									</motion.div>
								))
							)}
						</div>

						<div className="flex justify-center items-center gap-3 p-1 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
							<div className="flex flex-wrap justify-center w-full">
								{showAddButton && (
									<button
										className="primary flex items-center"
										onClick={() => {
											setTicketListItems((prev: TicketListItemProperty[]) => [
												...prev,
												{
													id: crypto.randomUUID(),
													companyId: selectedCompanyId,
													ticketTypeId: selectedTicketId,
													ticketData: structuredClone(editingTicketData),
												},
											]);
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
										</svg>
										{isMobile ? t('ticketListView.addResultToListButtonShort') : t('ticketListView.addResultToListButton')}
									</button>
								)}

								<button
									className="primary green flex items-center gap-1"
									onClick={() => {
										setSaveListModalOpen(true);
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
										<path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
									</svg>
									{isMobile ? t('ticketListView.exportListShort') : t('ticketListView.exportList')}
								</button>
								<button
									className="alert"
									onClick={() => {
										setTicketListItems([]);
									}}
								>
									{t('ticketListView.clearListButton')}
								</button>
							</div>
							<div className="flex w-fit items-center justify-end text-neutral-600 dark:text-neutral-300 text-sm">
								<span className="break-keep">{t('ticketListView.hideListButtonText')}</span>
								<button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition" onClick={() => setCollapsed(true)}>
									<span className="text-lg leading-none">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
										</svg>
									</span>
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</motion.div>
			<SaveListModal show={saveListModalOpen} onClose={() => setSaveListModalOpen(false)} />
			<SaveImageModal
				show={showSaveImageModal}
				ticketInfo={currentOperatingTicketItemRef.current!}
				saveFilename={''}
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
				onClose={() => {
					setShowUploadTicketModal(false);
				}}
			/>
		</div>
	);
};
