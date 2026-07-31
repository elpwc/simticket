'use client';

import { UploadedWorkItem } from '@/components/InfrastructureCompo/UploadedWorkItem';
import { getUploadedTicketById, getUploadedTickets, OrderType } from '@/utils/api';
import { useLocale } from '@/utils/hooks/useLocale';
import { UploadedTicketInfo } from '@/utils/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './style.css';
import PrettyDropdown from '@/components/InfrastructureCompo/PrettyDropdown';
import { companyList } from '@/utils/companies';
import Image from 'next/image';
import { TicketListView } from '@/components/InfrastructureCompo/ticketListView';
import { useIsMobile } from '@/utils/hooks';
import { useSearchParams } from 'next/navigation';
import { TicketViewerModal } from '@/components/Modals/TicketViewerModal';
import { CopyLinkModal } from '@/components/Modals/CopyLinkModal';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

const pageSize = 15;

function dedupeById(items: UploadedTicketInfo[]): UploadedTicketInfo[] {
	const seen = new Set<number>();
	return items.filter((item) => {
		if (seen.has(item.id)) return false;
		seen.add(item.id);
		return true;
	});
}

export default function Works() {
	const { t, locale } = useLocale();
	const isMobile = useIsMobile();
	const searchParams = useSearchParams();

	const [orderBy, setOrderBy] = useState<OrderType>(OrderType.views);
	const [asc, setAsc] = useState<boolean>(false);
	const [companyId, setCompanyId] = useState<number>(-1);
	const [ticketId, setTicketId] = useState<number>(-1);
	const [startStation, setStartStation] = useState<string>('');
	const [endStation, setEndStation] = useState<string>('');
	const [anyText, setAnyText] = useState<string>('');
	const [appliedSearch, setAppliedSearch] = useState({ from: '', to: '', text: '' });

	const [works, setWorks] = useState<UploadedTicketInfo[]>([]);
	const [latestWorks, setLatestWorks] = useState<UploadedTicketInfo[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [showTicketViewerModal, setShowTicketViewerModal] = useState<boolean>(false);
	const [urlParamTicketInfo, setUrlParamTicketInfo] = useState<UploadedTicketInfo | null>(null);
	const [showCopyLinkModal, setShowCopyLinkModal] = useState<boolean>(false);

	const filterKey = useMemo(
		() => JSON.stringify({ companyId, ticketId, orderBy, asc, appliedSearch }),
		[companyId, ticketId, orderBy, asc, appliedSearch]
	);

	const fetchPage = useCallback(
		async (pageIndex: number, mode: 'replace' | 'append'): Promise<{ hasMore: boolean }> => {
			const res = await getUploadedTickets(
				companyId,
				ticketId,
				orderBy,
				'',
				pageSize,
				asc,
				pageIndex,
				appliedSearch.from,
				appliedSearch.to,
				appliedSearch.text
			);

			const items = (res.items ?? []) as UploadedTicketInfo[];

			if (items.length === 0) {
				if (mode === 'replace') setWorks([]);
				setHasMore(false);
				return { hasMore: false };
			}

			setWorks((prev) => (mode === 'append' ? dedupeById([...prev, ...items]) : items));
			setHasMore(res.hasMore);
			return { hasMore: res.hasMore };
		},
		[companyId, ticketId, orderBy, asc, appliedSearch]
	);

	const loadLatest = useCallback(async () => {
		const res = await getUploadedTickets(
			companyId,
			ticketId,
			OrderType.createTime,
			'',
			10,
			asc,
			0,
			appliedSearch.from,
			appliedSearch.to,
			appliedSearch.text
		);
		setLatestWorks((res.items ?? []) as UploadedTicketInfo[]);
	}, [companyId, ticketId, asc, appliedSearch]);

	const isLoadingRef = useRef(false);

	const loadMore = useCallback(async () => {
		if (isLoadingRef.current || !hasMore) return;
		isLoadingRef.current = true;
		setIsLoading(true);
		try {
			const nextPage = page + 1;
			await fetchPage(nextPage, 'append');
			setPage(nextPage);
		} catch (e) {
			console.error(e);
		} finally {
			isLoadingRef.current = false;
			setIsLoading(false);
		}
	}, [page, hasMore, fetchPage]);

	const sentinelRef = useInfiniteScroll({ hasMore, isLoading, onLoadMore: loadMore });

	// Reset and load first page when filters change
	useEffect(() => {
		let cancelled = false;
		setPage(0);
		setHasMore(true);
		setIsLoading(true);
		isLoadingRef.current = true;

		fetchPage(0, 'replace').finally(() => {
			if (!cancelled) {
				isLoadingRef.current = false;
				setIsLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [filterKey, fetchPage]);

	useEffect(() => {
		loadLatest();
	}, [loadLatest]);

	useEffect(() => {
		const ticketIdParam = searchParams.get('ticketId');
		if (ticketIdParam !== null && !isNaN(Number(ticketIdParam))) {
			const id = Number(ticketIdParam);
			if (id >= 0) {
				const fetchData = async () => {
					const res = await getUploadedTicketById(id);
					if (res && res.length === 1) {
						setUrlParamTicketInfo(res[0] as UploadedTicketInfo);
						setShowTicketViewerModal(true);
					}
				};
				fetchData();
			}
		}
	}, [searchParams, locale]);

	const handleSearch = () => {
		setAppliedSearch({ from: startStation, to: endStation, text: anyText });
	};

	const handleReset = () => {
		setCompanyId(-1);
		setTicketId(-1);
		setStartStation('');
		setEndStation('');
		setAnyText('');
		setOrderBy(OrderType.createTime);
		setAsc(false);
		setAppliedSearch({ from: '', to: '', text: '' });
	};

	return (
		<div className="">
			<div className="h-fit w-full overflow-x-scroll bg-gray-900">
				<p className="text-white">{t('worksPage.latest.title')}</p>

				<div className="flex">
					{latestWorks.map((work: UploadedTicketInfo) => {
						return (
							<UploadedWorkItem
								key={work.id}
								uploadedTicketInfo={work}
								onLiked={() => {
									setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like + 1 } : item)));
									setLatestWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like + 1 } : item)));
								}}
								onUndoLiked={() => {
									setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like > 0 ? item.like - 1 : 0 } : item)));
									setLatestWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like > 0 ? item.like - 1 : 0 } : item)));
								}}
							/>
						);
					})}
				</div>
			</div>
			<div className="bg-white shadow-md rounded-2xl p-2 mb-4 flex flex-wrap gap-2">
				<div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-fit">
					<div className="flex flex-col md:w-[200px] w-full">
						<PrettyDropdown
							mainClassname="w-full"
							options={[
								{
									value: -1,
									getCaption: () => {
										return <span className="flex">{t('worksPage.filter.allCompany')}</span>;
									},
								},
								...companyList.map((company, index) => {
									return {
										value: index,
										getCaption: () => {
											return (
												<span className="flex gap-1">
													<Image style={{ height: 'auto', width: '20px' }} src={company.logo} alt={company.abbr} />
													{company.name}
												</span>
											);
										},
									};
								}),
							]}
							value={companyId}
							onChange={(i) => {
								setCompanyId(Number(i));
								setTicketId(-1);
							}}
						/>
					</div>

					<div className="flex flex-col md:w-[200px] w-full">
						<PrettyDropdown
							mainClassname="w-full"
							options={[
								{
									value: -1,
									getCaption: () => {
										return <span className="flex">{t('worksPage.filter.allTicketType')}</span>;
									},
								},
								...(companyList[companyId]?.tickets?.map((ticket, index) => {
									return {
										value: index,
										getCaption: () => {
											return <>{ticket.name}</>;
										},
									};
								}) || []),
							]}
							value={ticketId}
							onChange={(i) => {
								setTicketId(Number(i));
							}}
						/>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-1">
					<span className="text-sm text-gray-600">{t('worksPage.filter.order.label')}</span>

					<select
						value={orderBy}
						onChange={(e) => setOrderBy(e.target.value as OrderType)}
						className="border-1 border-[#cccccc] rounded-[4px] px-1 py-1 focus:ring-2 focus:ring-blue-400 outline-none transition"
					>
						<option value={OrderType.none}>{t('worksPage.filter.order.none')}</option>
						<option value={OrderType.createTime}>{t('worksPage.filter.order.createTime')}</option>
						<option value={OrderType.like}>{t('worksPage.filter.order.like')}</option>
						<option value={OrderType.views}>{t('worksPage.filter.order.views')}</option>
					</select>

					<div className="flex gap-1">
						<button
							onClick={() => setAsc(true)}
							className={`px-2 transition hover:bg-gray-100 active:scale-95 
								${asc ? 'bg-blue-200 border-blue-400' : ''}
							`}
						>
							↑ {t('worksPage.filter.order.asc')}
						</button>
						<button
							onClick={() => setAsc(false)}
							className={`px-2 transition hover:bg-gray-100 active:scale-95
								${!asc ? 'bg-blue-200 border-blue-400' : ''}
							`}
						>
							↓ {t('worksPage.filter.order.desc')}
						</button>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<div className="flex flex-row w-full md:w-[150px] items-center gap-1">
						<p className="break-keep">{t('worksPage.filter.search.from')}</p>
						<input value={startStation} onChange={(e) => setStartStation(e.target.value)} className="menu-input" style={{ borderColor: '#ccc' }} placeholder="from" />
					</div>

					<div className="flex flex-row w-full md:w-[150px] items-center gap-1">
						<p className="break-keep">{t('worksPage.filter.search.to')}</p>
						<input value={endStation} onChange={(e) => setEndStation(e.target.value)} className="menu-input" style={{ borderColor: '#ccc' }} placeholder="to" />
					</div>
					<div className="flex flex-row w-full md:w-[150px] items-center gap-1">
						<p className="break-keep">{t('worksPage.filter.search.searchText')}</p>
						<input value={anyText} onChange={(e) => setAnyText(e.target.value)} className="menu-input" style={{ borderColor: '#ccc' }} placeholder="any text" />
					</div>
					<button onClick={handleSearch} className="primary px-4">
						{t('worksPage.filter.search.search')}
					</button>

					<button onClick={handleReset} className="">
						{t('worksPage.filter.reset')}
					</button>
				</div>
			</div>

			<div className="flex flex-wrap pb-[500px]" style={{ justifyContent: isMobile ? 'center' : 'start' }}>
				{works.map((work: UploadedTicketInfo) => {
					return (
						<div className="h-item" key={work.id}>
							<UploadedWorkItem
								uploadedTicketInfo={work}
								onLiked={() => {
									setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like + 1 } : item)));
									setLatestWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like + 1 } : item)));
								}}
								onUndoLiked={() => {
									setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like > 0 ? item.like - 1 : 0 } : item)));
									setLatestWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like > 0 ? item.like - 1 : 0 } : item)));
								}}
							/>
						</div>
					);
				})}
			</div>
			<div ref={sentinelRef} className="horizonal-end">
				{isLoading ? 'loading...' : !hasMore && works.length > 0 ? '—' : ''}
			</div>
			<footer className="">
				<TicketListView showAddButton={false} />
			</footer>
			<TicketViewerModal
				show={showTicketViewerModal}
				ticketInfo={urlParamTicketInfo}
				onClose={() => setShowTicketViewerModal(false)}
				onShare={() => {
					setShowCopyLinkModal(true);
				}}
			/>
			<CopyLinkModal
				show={showCopyLinkModal}
				ticketInfo={{
					companyId: urlParamTicketInfo ? urlParamTicketInfo.companyId : 0,
					ticketTypeId: urlParamTicketInfo ? urlParamTicketInfo.ticketId : 0,
					ticketData: urlParamTicketInfo ? urlParamTicketInfo.data : {},
					id: '',
				}}
				onClose={() => {
					setShowCopyLinkModal(false);
				}}
				ticketId={urlParamTicketInfo ? urlParamTicketInfo.id : -1}
			/>
		</div>
	);
}
