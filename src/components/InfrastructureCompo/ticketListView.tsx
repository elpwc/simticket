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
            key={`${item.companyId}-${item.ticketTypeId}-${index}`}
            width={200}
            height={-1}
            companyId={item.companyId}
            ticketTypeId={item.ticketTypeId}
            ticketData={item.ticketData}
            onDelete={() => {
              setTicketListItems((currentItems) => currentItems.filter((ci) => ci !== item));
            }}
          />
        ))}
      </div>
      <div>
        <button
          onClick={() => {
            setTicketListItems((prev: TicketListItemProperty[]) => [
              ...prev,
              {
                companyId: selectedCompanyId,
                ticketTypeId: selectedTicketId,
                ticketData: editingTicketData,
              },
            ]);
            console.log(ticketListItems, editingTicketData);
          }}
        >
          添加当前编辑结果到列表中
        </button>
        <button>全部导出</button>
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
