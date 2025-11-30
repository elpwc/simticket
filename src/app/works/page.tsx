'use client';

import { UploadedWorkItem } from '@/components/InfrastructureCompo/UploadedWorkItem';
import { getUploadedTickets, OrderType } from '@/utils/api';
import { useLocale } from '@/utils/hooks/useLocale';
import { UploadedTicketInfo } from '@/utils/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import './style.css';
import PrettyDropdown from '@/components/InfrastructureCompo/PrettyDropdown';
import { companyList } from '@/utils/companies';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';
import { TicketListView } from '@/components/InfrastructureCompo/ticketListView';
import { useIsMobile } from '@/utils/hooks';

export default function Works() {
	const { t, locale } = useLocale();
	const isMobile = useIsMobile();

	const infiniteScrollRef = useRef(null);

	const resetInfiniteScrollPage = () => {
		if (typeof window !== 'undefined') {
			if (infiniteScrollRef.current) {
				//@ts-expect-error outer library
				infiniteScrollRef.current.pageLoaded = 0;
			}
		}
	};

	const [orderBy, setOrderBy] = useState<OrderType>(OrderType.views);
	const [asc, setAsc] = useState<boolean>(false);
	const [companyId, setCompanyId] = useState<number>(-1);
	const [ticketId, setTicketId] = useState<number>(-1);
	const [startStation, setStartStation] = useState<string>('');
	const [endStation, setEndStation] = useState<string>('');
	const [anyText, setAnyText] = useState<string>('');

	const [works, setWorks] = useState<UploadedTicketInfo[]>([]);
	const [latestWorks, setLatestWorks] = useState<UploadedTicketInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const pageSize = 10;

	const load = useCallback(async () => {
		if (typeof window !== 'undefined') {
			getUploadedTickets(companyId, ticketId, orderBy, '', pageSize, asc, 0, startStation, endStation, anyText).then((e) => {
				resetInfiniteScrollPage();
				setHasMore(true);
				setWorks(e);
			});
		}
	}, [companyId, ticketId, orderBy, anyText, asc]);

	const loadLatest = useCallback(async () => {
		getUploadedTickets(companyId, ticketId, OrderType.createTime, '', 10, asc, 0, startStation, endStation, anyText).then((e) => {
			setLatestWorks(e);
		});
	}, [companyId, ticketId, asc]);

	const loadMore = async (nextPageIndex: number) => {
		if (typeof window === 'undefined') return;
		if (isLoading || !hasMore) return;
		setIsLoading(true);
		try {
			const res = await getUploadedTickets(companyId, ticketId, orderBy, anyText, pageSize, asc, nextPageIndex, startStation, endStation, anyText);
			if (!res || res.length === 0) {
				setHasMore(false);
			} else {
				setWorks((prev) => [...prev, ...res]);
				if (res.length < pageSize) setHasMore(false);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, [orderBy, asc, companyId, ticketId]);

	useEffect(() => {
		loadLatest();
	}, [companyId, ticketId]);

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
									getCaption: (isShownOnTop?: boolean, isSelected?: boolean) => {
										return <span className="flex">{t('worksPage.filter.allCompany')}</span>;
									},
								},
								...companyList.map((company, index) => {
									return {
										value: index,
										getCaption: (isShownOnTop?: boolean, isSelected?: boolean) => {
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
									getCaption: (isShownOnTop?: boolean, isSelected?: boolean) => {
										return <span className="flex">{t('worksPage.filter.allTicketType')}</span>;
									},
								},
								...(companyList[companyId]?.tickets?.map((ticket, index) => {
									return {
										value: index,
										getCaption: (isShownOnTop?: boolean, isSelected?: boolean) => {
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
					<div className="flex flex-row w-full md:w-auto items-center gap-1">
						<p className="break-keep">{t('worksPage.filter.search.from')}</p>
						<input value={startStation} onChange={(e) => setStartStation(e.target.value)} className="menu-input w-full" placeholder="from" />
					</div>

					<div className="flex flex-row w-full md:w-auto items-center gap-1">
						<p className="break-keep">{t('worksPage.filter.search.to')}</p>
						<input value={endStation} onChange={(e) => setEndStation(e.target.value)} className="menu-input" placeholder="to" />
					</div>
					<div className="flex flex-row w-full md:w-auto items-center gap-1">
						<p className="break-keep">{t('worksPage.filter.search.searchText')}</p>
						<input value={anyText} onChange={(e) => setAnyText(e.target.value)} className="menu-input" placeholder="any text" />
					</div>
					<button onClick={load} className="primary px-4">
						{t('worksPage.filter.search.search')}
					</button>

					<button
						onClick={() => {
							setCompanyId(-1);
							setTicketId(-1);
							setStartStation('');
							setEndStation('');
							setAnyText('');
							setOrderBy(OrderType.createTime);
							setAsc(false);
							load();
						}}
						className=""
					>
						{t('worksPage.filter.reset')}
					</button>
				</div>
			</div>

			<InfiniteScroll
				ref={infiniteScrollRef}
				pageStart={0}
				loadMore={loadMore}
				hasMore={hasMore}
				loader={<div className="horizonal-end">loading...</div>}
				useWindow={true}
				className="flex flex-wrap pb-[500px]"
				style={{ justifyContent: isMobile ? 'center' : 'start' }}
			>
				{works.map((work: UploadedTicketInfo) => {
					return (
						<div className="h-item" key={work.id}>
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
						</div>
					);
				})}
			</InfiniteScroll>
			<footer className="">
				<TicketListView showAddButton={false} />
			</footer>
		</div>
	);
}
