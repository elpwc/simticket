import { AppContext } from '@/app/app';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { TicketListViewItem } from './ticketListViewItem';
import { useLocale } from '@/utils/hooks/useLocale';
import { SaveListModal } from '../Modals/SaveListModal';
import { SaveImageModal } from '../Modals/SaveImageModal';
import { motion } from 'framer-motion';

export const TicketListView = () => {
	const { t } = useLocale();
	// object to save
	const currentOperatingTicketItemRef = useRef<TicketListItemProperty | null>(null);

	const [saveListModalOpen, setSaveListModalOpen] = useState(false);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);
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
		<motion.div
			animate={{
				y: collapsed ? 'calc(100% - 40px)' : '0%',
				height: collapsed ? 40 : 'auto',
			}}
			transition={{ type: 'keyframes', duration: 0.2, damping: 15, stiffness: 240 }}
			className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.15)] border-t border-neutral-300 dark:border-neutral-700 overflow-hidden"
		>
			{/* 折叠後的细栏 */}
			{collapsed && (
				<div className="h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 text-sm relative" onClick={() => setCollapsed(false)}>
					<span className="select-none">{t('ticketListView.listSummary') + ticketListItems.length.toString()}</span>
					<button
						className="absolute right-4 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
						onClick={() => setCollapsed(false)}
					>
						<span className="text-lg leading-none">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
							</svg>
						</span>
					</button>
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
										companyId={item.companyId}
										ticketTypeId={item.ticketTypeId}
										ticketData={item.ticketData}
										onDelete={() => {
											setTicketListItems((items) => items.filter((ci) => ci.id !== item.id));
										}}
										onSave={() => {
											currentOperatingTicketItemRef.current = item;
											setShowSaveImageModal(true);
										}}
									/>
								</motion.div>
							))
						)}
					</div>

					<div className="flex justify-center items-center gap-3 p-1 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
						<div className="flex flex-wrap justify-center w-full">
							<button
								className="primary"
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
								{t('ticketListView.addResultToListButton')}
							</button>
							<button
								className="primary green"
								onClick={() => {
									setSaveListModalOpen(true);
								}}
							>
								{t('ticketListView.exportList')}
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
						<div className="flex justify-end">
							<button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition" onClick={() => setCollapsed(true)}>
								<span className="text-lg leading-none">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
									</svg>
								</span>
							</button>
						</div>
					</div>

					<SaveListModal show={saveListModalOpen} onClose={() => setSaveListModalOpen(false)} />
					<SaveImageModal
						show={showSaveImageModal}
						ticketInfo={currentOperatingTicketItemRef.current!}
						saveFilename={''}
						onClose={() => setShowSaveImageModal(false)}
						defaultCanvasSize={get_CanvasOrImageSize_Of_Ticket_By_TicketType(
							currentOperatingTicketItemRef.current?.companyId ?? 0,
							currentOperatingTicketItemRef.current?.ticketData ?? 0,
							TicketSizeType.CanvasSize,
							currentOperatingTicketItemRef.current?.ticketData.background ?? 0
						)}
					/>
				</motion.div>
			)}
		</motion.div>
	);
};
