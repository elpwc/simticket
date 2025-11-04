import { AppContext } from '@/app/app';
import { TicketListItemProperty } from '@/utils/utils';
import { Dispatch, SetStateAction, useContext } from 'react';
import { TicketListViewItem } from './ticketListViewItem';

export const TicketListView = () => {
	const { ticketListItems, setTicketListItems }: { ticketListItems: TicketListItemProperty[]; setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>> } = useContext(AppContext);

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);
	const { editingTicketData, setEditingTicketData } = useContext(AppContext);

	return (
		<div>
			<div>
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
					添加当前编辑结果到列表中
				</button>
				<button>导出列表为A4</button>
				<button
					onClick={() => {
						setTicketListItems([]);
					}}
				>
					清空列表
				</button>
			</div>
		</div>
	);
};
