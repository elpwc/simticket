'use client';

import Link from 'next/link';
import './globals.css';
import { createContext, useState } from 'react';
import Image from 'next/image';
import { companyList } from '@/utils/companies';
import { useIsMobile } from '@/utils/hooks';

export const AppContext = createContext<any>(null);

export default function App({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isMobile = useIsMobile();

	const [selectedCompanyId, setSelectedCompanyId] = useState(0);
	const [selectedTicketId, setSelectedTicketId] = useState(companyList[selectedCompanyId].defaultSelectedTicketId ?? 0);
	const [showMobileCompanySelectMenu, setShowMobileCompanySelectMenu] = useState(true);

	return (
		<AppContext.Provider value={{ selectedCompanyId, setSelectedCompanyId, selectedTicketId, setSelectedTicketId, showMobileCompanySelectMenu, setShowMobileCompanySelectMenu }}>
			<header className="sticky top-0 h-[60px] z-[100]">
				<nav className="bg-[#007fd4] text-white flex gap-4 items-center justify-between">
					<section className="p-4 flex gap-4">
						<Link href="/">
							<div className="navitem">SimTicket</div>
						</Link>
						<Link href="/about">
							<div className="navitem">About</div>
						</Link>
					</section>
					<button
						className="mobile-company-select-button flex items-center gap-2"
						onClick={() => {
							setShowMobileCompanySelectMenu(!showMobileCompanySelectMenu);
						}}
					>
						<Image className="h-8 w-8" src={companyList[selectedCompanyId].logo} alt={companyList[selectedCompanyId].abbr} />
						<div className="flex flex-col items-center">
							<span className="w-max">{companyList[selectedCompanyId].name}</span>
							<span className="w-max">{companyList[selectedCompanyId].tickets?.[selectedTicketId].name}</span>
						</div>
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
		</AppContext.Provider>
	);
}
