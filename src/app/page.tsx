'use client';

import CRWideTicket from '@/components/CRWideTicket';
import './globals.css';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { companyList } from '@/utils/companies';
import { AppContext } from './app';
import { useIsMobile } from '@/utils/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import UnderConstruction from '@/components/UnderConstruction';

export default function Home() {
	const isMobile = useIsMobile();

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);
	const { showMobileCompanySelectMenu, setShowMobileCompanySelectMenu } = useContext(AppContext);
	const [menuHeight, setmenuHeight] = useState(0);

	const router = useRouter();
	const searchParams = useSearchParams();

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
	}, [showMobileCompanySelectMenu, isMobile]);

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
						className="ticket-select-menu-container absolute top-[56px] left-0 right-0"
					>
						<menu className="flex gap-2 flex-wrap bg-[#b9e3ff]">
							{companyList.map((company, index) => {
								return (
									<div
										className={
											`${isMobile ? 'rounded-[4px]' : 'rounded-[4px_4px_0_0]'}` +
											' company-menu-item' +
											(selectedCompanyId === index ? ' selected' : '') +
											(company.disabled ? ' disabled' : '')
										}
										key={company.abbr}
										onClick={() => {
											if (!company.disabled) {
												setSelectedCompanyId(index);
												setSelectedTicketId(companyList[index].defaultSelectedTicketId ?? 0);
											}
										}}
									>
										<Image src={company.logo} alt={company.abbr} />
										<p>{company.name}</p>
									</div>
								);
							})}
						</menu>
						{(companyList[selectedCompanyId].tickets?.length ?? 0) > 0 && (
							<menu className="px-2 flex gap-1 flex-wrap shadow-sm items-center bg-white sticky bottom-0">
								{companyList[selectedCompanyId].tickets?.map((ticket, index) => {
									return (
										<>
											<div
												className={'ticket-menu-item' + (selectedTicketId === index ? ' selected' : '') + (ticket.disabled ? ' disabled' : '')}
												key={index}
												onClick={() => {
													if (!ticket.disabled) {
														setSelectedTicketId(index);
													}
												}}
											>
												{ticket.name}
											</div>
											<div className="border-r-1 border-r-[#ccc] h-5 w-1"></div>
										</>
									);
								})}
							</menu>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div animate={{ marginTop: `${menuHeight}px` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
				{(() => {
					switch (selectedCompanyId) {
						case 0: //CR
							switch (selectedTicketId) {
								case 0:
								case 1:
								case 2:
								case 3:
									return <UnderConstruction />;
								case 4:
									return <CRWideTicket />;
								default:
									return <UnderConstruction />;
							}
						case 1: // JR
							switch (selectedTicketId) {
								case 0:
								case 1:
								case 2:
								default:
									return <UnderConstruction />;
							}
						case 2: // JNR
							switch (selectedTicketId) {
								case 0:
								default:
									return <UnderConstruction />;
							}
						case 3: // TR
							switch (selectedTicketId) {
								case 0:
								case 1:
								case 2:
								default:
									return <UnderConstruction />;
							}
						case 4: // THSR
						case 5: // VNR
						case 6: // KR
						default:
							return <CRWideTicket />;
					}
				})()}
			</motion.div>
		</div>
	);
}
