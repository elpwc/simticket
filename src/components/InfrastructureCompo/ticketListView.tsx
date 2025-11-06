import { AppContext } from '@/app/app';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { TicketListViewItem } from './ticketListViewItem';
import { useLocale } from '@/utils/hooks/useLocale';
import { SaveListModal } from '../Modals/SaveListModal';
import { SaveImageModal } from '../Modals/SaveImageModal';

export const TicketListView = () => {
	const { t } = useLocale();
	// object to save
	const currentOperatingTicketItemRef = useRef<TicketListItemProperty | null>(null);

	const [saveListModalOpen, setSaveListModalOpen] = useState(false);
	const [showSaveImageModal, setShowSaveImageModal] = useState(false);

	const { ticketListItems, setTicketListItems }: { ticketListItems: TicketListItemProperty[]; setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>> } = useContext(AppContext);

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);
	const { editingTicketData, setEditingTicketData } = useContext(AppContext);

	return (
		<div>
			<div className="flex gap-2 overflow-x-auto justify-center">
				{ticketListItems.map((item: TicketListItemProperty, index: number) => (
					<TicketListViewItem
						key={`${item.id}`}
						width={200}
						height={-1}
						companyId={item.companyId}
						ticketTypeId={item.ticketTypeId}
						ticketData={item.ticketData}
						onDelete={() => {
							setTicketListItems((currentItems) =>
								currentItems.filter((ci) => {
									return ci.id !== item.id;
								})
							);
						}}
						onSave={() => {
							currentOperatingTicketItemRef.current = item;
							setShowSaveImageModal(true);
						}}
					/>
				))}
			</div>
			<div>
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
				className='primary green'
					onClick={() => {
						setSaveListModalOpen(true);
					}}
				>
					{t('ticketListView.exportList')}
				</button>
				<button
				className='alert'
					onClick={() => {
						setTicketListItems([]);
					}}
				>
					{t('ticketListView.clearListButton')}
				</button>
			</div>
			<SaveListModal
				show={saveListModalOpen}
				onClose={() => {
					setSaveListModalOpen(false);
				}}
			/>
			<SaveImageModal
				show={showSaveImageModal}
				ticketInfo={currentOperatingTicketItemRef.current!}
				saveFilename={''}
				onClose={() => {
					setShowSaveImageModal(false);
				}}
				defaultCanvasSize={get_CanvasOrImageSize_Of_Ticket_By_TicketType(
					currentOperatingTicketItemRef.current?.companyId ?? 0,
					currentOperatingTicketItemRef.current?.ticketData ?? 0,
					TicketSizeType.CanvasSize,
					currentOperatingTicketItemRef.current?.ticketData.background ?? 0
				)}
			/>
		</div>
	);
};
