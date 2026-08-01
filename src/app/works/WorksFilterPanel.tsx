'use client';

import PrettyDropdown from '@/components/InfrastructureCompo/PrettyDropdown';
import { companyList, getCompanyById } from '@/utils/companies';
import { useLocale } from '@/utils/hooks/useLocale';
import Image from 'next/image';

interface Props {
	expanded: boolean;
	isMobile: boolean;
	companyId: number;
	ticketId: number;
	startStation: string;
	endStation: string;
	anyText: string;
	onCompanyChange: (id: number) => void;
	onTicketChange: (id: number) => void;
	onStartStationChange: (v: string) => void;
	onEndStationChange: (v: string) => void;
	onAnyTextChange: (v: string) => void;
	onSearch: () => void;
	onReset: () => void;
}

/**
 * 筛选面板：公司/票种/站名/关键词。
 * 输入态（startStation 等）与 appliedSearch 分离，点击「搜索」后才触发列表重载。
 */
export function WorksFilterPanel({
	expanded,
	isMobile,
	companyId,
	ticketId,
	startStation,
	endStation,
	anyText,
	onCompanyChange,
	onTicketChange,
	onStartStationChange,
	onEndStationChange,
	onAnyTextChange,
	onSearch,
	onReset,
}: Props) {
	const { t } = useLocale();

	if (isMobile && !expanded) {
		return null;
	}

	return (
		<section className={'works-filter-panel' + (expanded ? '' : ' works-filter-panel--collapsed')} aria-label={t('worksPage.filter.toggle')}>
			<div className="works-filter-panel-inner">
				<div className="works-filter-row">
					<div className="works-filter-field">
						<PrettyDropdown
							mainClassname="w-full"
							options={[
								{
									value: -1,
									getCaption: () => <span>{t('worksPage.filter.allCompany')}</span>,
								},
								...companyList.map((company) => ({
									value: company.id,
									getCaption: () => (
										<span className="flex gap-1 items-center">
											<Image style={{ height: 'auto', width: '20px' }} src={company.logo} alt={company.abbr} />
											{company.name}
										</span>
									),
								})),
							]}
							value={companyId}
							onChange={(i) => onCompanyChange(Number(i))}
						/>
					</div>

					<div className="works-filter-field">
						<PrettyDropdown
							mainClassname="w-full"
							options={[
								{
									value: -1,
									getCaption: () => <span>{t('worksPage.filter.allTicketType')}</span>,
								},
								...(getCompanyById(companyId)?.tickets?.map((ticket) => ({
									value: ticket.id,
									getCaption: () => <>{ticket.name}</>,
								})) || []),
							]}
							value={ticketId}
							onChange={(i) => onTicketChange(Number(i))}
						/>
					</div>
				</div>

				<div className="works-filter-row works-filter-row--search">
					<label className="works-filter-search-item">
						<span className="works-filter-label">{t('worksPage.filter.search.from')}</span>
						<input
							value={startStation}
							onChange={(e) => onStartStationChange(e.target.value)}
							className="menu-input"
							placeholder={t('worksPage.filter.placeholderFrom')}
						/>
					</label>
					<label className="works-filter-search-item">
						<span className="works-filter-label">{t('worksPage.filter.search.to')}</span>
						<input value={endStation} onChange={(e) => onEndStationChange(e.target.value)} className="menu-input" placeholder={t('worksPage.filter.placeholderTo')} />
					</label>
					<label className="works-filter-search-item">
						<span className="works-filter-label">{t('worksPage.filter.search.searchText')}</span>
						<input value={anyText} onChange={(e) => onAnyTextChange(e.target.value)} className="menu-input" placeholder={t('worksPage.filter.placeholderSearch')} />
					</label>
					<div className="works-filter-actions">
						<button type="button" onClick={onSearch} className="primary px-4">
							{t('worksPage.filter.search.search')}
						</button>
						<button type="button" onClick={onReset}>
							{t('worksPage.filter.reset')}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
