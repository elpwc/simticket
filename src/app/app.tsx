'use client';

import Link from 'next/link';
import './globals.css';
import { createContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { companyList } from '@/utils/companies';
import { useIsMobile } from '@/utils/hooks';
import LangSwitcher from '@/components/InfrastructureCompo/LangSwitcher';
import { useLocale } from '@/utils/hooks/useLocale';
import { DevProgressModal } from '@/components/Modals/DevProgressModal';
import { TicketListItemProperty } from '@/utils/utils';
import { HintProvider } from '@/components/InfrastructureCompo/HintProvider';

export const AppContext = createContext<any>(null);

export default function App({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { t } = useLocale();
	const isMobile = useIsMobile();

	const [selectedCompanyId, setSelectedCompanyId] = useState(0);
	const [selectedTicketId, setSelectedTicketId] = useState(companyList[selectedCompanyId].defaultSelectedTicketId ?? 0);
	const [showMobileCompanySelectMenu, setShowMobileCompanySelectMenu] = useState(true);
	const [showDevProgressModal, setShowDevProgressModal] = useState(false);
	const [ticketListItems, setTicketListItems] = useState<TicketListItemProperty[]>([]);

	const [copyEditingTicketDataToDrawParameters, setCopyEditingTicketDataToDrawParameters] = useState(false);

	const [editingTicketData, setEditingTicketData] = useState<any>(null);

	useEffect(() => {
		setShowDevProgressModal(true);
	}, []);

	return (
		<AppContext.Provider
			value={{
				selectedCompanyId,
				setSelectedCompanyId,
				selectedTicketId,
				setSelectedTicketId,
				showMobileCompanySelectMenu,
				setShowMobileCompanySelectMenu,
				ticketListItems,
				setTicketListItems,
				editingTicketData,
				setEditingTicketData,
				copyEditingTicketDataToDrawParameters,
				setCopyEditingTicketDataToDrawParameters,
			}}
		>
			<HintProvider>
				<header className="sticky top-0 z-[100]" style={{ height: isMobile ? '46px' : '50px' }}>
					<nav className="bg-[#007fd4] text-white flex items-center justify-between">
						<section className="px-2 py-1 flex gap-1 max-h-[56px] items-center">
							<Link href="/">
								<div className="navitem">
									{isMobile ? (
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
											<path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
											<path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
										</svg>
									) : (
										'SimTicket'
									)}
								</div>
							</Link>
							<Link href="/about">
								<div className="navitem">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
									</svg>
									{t('app.menu.about')}
								</div>
							</Link>
							<Link href="/works">
								<div className="navitem">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
									</svg>
									{t('app.menu.post')}
								</div>
							</Link>
							<LangSwitcher />
						</section>
						<button
							className="mobile-company-select-button flex items-center gap-2"
							onClick={() => {
								setShowMobileCompanySelectMenu(!showMobileCompanySelectMenu);
							}}
						>
							<Image className="h-8 w-8" src={companyList[selectedCompanyId].logo} alt={companyList[selectedCompanyId].abbr} />
							{!isMobile && (
								<div className="flex flex-col items-center">
									<span className="w-max">{companyList[selectedCompanyId].name}</span>
									<span className="w-max">{companyList[selectedCompanyId].tickets?.[selectedTicketId].name}</span>
								</div>
							)}

							<span className="flex">
								{showMobileCompanySelectMenu ? (
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
										<path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
										<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
									</svg>
								)}
							</span>
						</button>
					</nav>
				</header>
				<main>{children}</main>
				<DevProgressModal
					show={showDevProgressModal}
					onClose={() => {
						setShowDevProgressModal(false);
					}}
				/>
			</HintProvider>
		</AppContext.Provider>
	);
}
