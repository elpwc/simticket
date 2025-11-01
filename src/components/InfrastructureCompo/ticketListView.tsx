import { AppContext } from "@/app/app";
import { TicketListItemProperty } from "@/utils/utils";
import { useContext } from "react";
import { TicketListViewItem } from "./ticketListViewItem";



export const TicketListView = () => {
  const { ticketListItems, setTicketListItems } = useContext(AppContext);

  return <div>
    {ticketListItems.map((item: TicketListItemProperty, index: number) => (
      <TicketListViewItem key={index} width={200} height={-1} companyId={item.companyId} ticketTypeId={item.ticketTypeId} ticketData={item.ticketData} onDelete={() => {
        const newList = [...ticketListItems];
        newList.splice(index, 1);
        setTicketListItems(newList);
      }} />
    ))}
  </div>;
}