'use client';

import './globals.css';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { companyList, getCompanyById, getDefaultTicketId } from '@/utils/companies';
import { getTicketEditor } from '@/utils/ticketEditorRegistry';
import { AppContext } from './app';
import { useIsMobile } from '@/utils/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { TicketListView } from '@/components/InfrastructureCompo/ticketListView';

export default function HomePage() {
	const isMobile = useIsMobile();

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);
	const { showMobileCompanySelectMenu, setShowMobileCompanySelectMenu } = useContext(AppContext);
	const [menuHeight, setmenuHeight] = useState(0);

	const router = useRouter();
	const searchParams = useSearchParams();

	const selectedCompany = getCompanyById(selectedCompanyId);

	useEffect(() => {
		const comParam = searchParams.get('com');
		const ticketParam = searchParams.get('ticket');
		if (comParam !== null && !isNaN(Number(comParam))) {
			setSelectedCompanyId(Number(comParam));
		}
		if (ticketParam !== null && !isNaN(Number(ticketParam))) {
			setSelectedTicketId(Number(ticketParam));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (showMobileCompanySelectMenu) {
			//dirty!!!
			setmenuHeight((document.getElementsByClassName('ticket-select-menu-container')?.[0]?.clientHeight ?? 0) + 4);
		} else {
			setmenuHeight(0);
		}
	}, [showMobileCompanySelectMenu, isMobile, selectedCompanyId]);

	const TicketEditor = getTicketEditor(selectedCompanyId, selectedTicketId);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('com', String(selectedCompanyId));
		params.set('ticket', String(selectedTicketId));
		router.replace(`?${params.toString()}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCompanyId, selectedTicketId]);

	return (
		<div>
			<AnimatePresence>
				{showMobileCompanySelectMenu && (
					<motion.div
						initial={{ y: -40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -40, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						className="ticket-select-menu-container absolute left-0 right-0"
						style={{ top: isMobile ? '46px' : '50px' }}
					>
						<menu className="flex gap-2 flex-wrap bg-[#b9e3ff]">
							{companyList.map((company) => {
								return (
									<div
										className={
											`${isMobile ? 'rounded-[4px]' : 'rounded-[4px_4px_0_0]'}` +
											' company-menu-item' +
											(selectedCompanyId === company.id ? ' selected' : '') +
											(company.disabled ? ' disabled' : '')
										}
										key={company.abbr}
										onClick={() => {
											if (!company.disabled) {
												setSelectedCompanyId(company.id);
												setSelectedTicketId(getDefaultTicketId(company.id));
											}
										}}
									>
										<Image src={company.logo} alt={company.abbr} />
										<p>{company.name}</p>
									</div>
								);
							})}
						</menu>
						{(selectedCompany?.tickets?.length ?? 0) > 0 && (
							<menu className="px-2 flex gap-1 flex-wrap shadow-sm items-center bg-white sticky bottom-0">
								{selectedCompany?.tickets?.map((ticket) => {
									return (
										<div key={ticket.id} className="flex items-center">
											<div
												className={'ticket-menu-item' + (selectedTicketId === ticket.id ? ' selected' : '') + (ticket.disabled ? ' disabled' : '')}
												onClick={() => {
													if (!ticket.disabled) {
														setSelectedTicketId(ticket.id);
													}
												}}
											>
												{ticket.name}
											</div>
											<div className="border-r-1 border-r-[#ccc] h-5 w-1"></div>
										</div>
									);
								})}
							</menu>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div className="mb-[200px]" animate={{ marginTop: `${menuHeight}px` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
				<TicketEditor key={`${selectedCompanyId}-${selectedTicketId}`} />
			</motion.div>
			<footer className="">
				<TicketListView />
			</footer>
		</div>
	);
}
