'use client';

import Hongpiao from '@/components/Hongpiao';
import './globals.css';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { companyList } from '@/utils/companies';
import { AppContext } from './app';
import { useIsMobile } from '@/utils/hooks';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
	const isMobile = useIsMobile();

	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);
	const { showMobileCompanySelectMenu, setShowMobileCompanySelectMenu } = useContext(AppContext);
	const [menuHeight, setmenuHeight] = useState(0);

	useEffect(() => {
		if (showMobileCompanySelectMenu) {
      //dirty!!!
			setmenuHeight((document.getElementsByClassName('ticket-select-menu-container')?.[0]?.clientHeight ?? 0) + 4);
		} else {
			setmenuHeight(0);
		}
	}, [showMobileCompanySelectMenu, isMobile]);

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
												setSelectedTicketId(0);
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
				<Hongpiao />
			</motion.div>
		</div>
	);
}
