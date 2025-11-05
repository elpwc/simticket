import { AppContext } from '@/app/app';
import { TicketListItemProperty } from '@/utils/utils';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { TicketListViewItem } from './ticketListViewItem';
import { useLocale } from '@/utils/hooks/useLocale';
import { SaveListModal } from '../Modals/SaveListModal';

export const TicketListView = () => {
	const { t } = useLocale();

	const [saveListModalOpen, setSaveListModalOpen] = useState(false);

	const { ticketListItems, setTicketListItems }: { ticketListItems: TicketListItemProperty[]; setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>> } = useContext(AppContext);

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);
	const { editingTicketData, setEditingTicketData } = useContext(AppContext);

	return (
		<div>
			<div className="flex gap-2 overflow-x-auto">
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
					/>
				))}
			</div>
			<div>
				<button
					className="bg-blue-500 text-white"
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
					onClick={() => {
						setSaveListModalOpen(true);
					}}
				>
					{t('ticketListView.exportList')}
				</button>
				<button
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
		</div>
	);
};
