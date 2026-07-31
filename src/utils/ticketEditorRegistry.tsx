import { ComponentType } from 'react';
import CRWideTicket from '@/components/TicketEditors/CRWideTicket';
import JRWideTicket from '@/components/TicketEditors/JRWideTicket';
import { UnderConstruction } from '@/components/TicketEditorCompo/UnderConstruction';
import { getTicketType, TicketEditorKey } from './companies';

const ticketEditors: Record<TicketEditorKey, ComponentType> = {
	CRWideTicket,
	JRWideTicket,
};

export function getTicketEditor(companyId: number, ticketId: number): ComponentType {
	const editorKey = getTicketType(companyId, ticketId)?.editorKey;
	if (editorKey && editorKey in ticketEditors) {
		return ticketEditors[editorKey];
	}
	return UnderConstruction;
}
