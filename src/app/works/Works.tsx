'use client';

import { getUploadedTicketById, getUploadedTickets, OrderType } from '@/utils/api';
import { useLocale } from '@/utils/hooks/useLocale';
import { UploadedTicketInfo } from '@/utils/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './style.css';
import { useIsMobile } from '@/utils/hooks';
import { useSearchParams } from 'next/navigation';
import { TicketViewerModal } from '@/components/Modals/TicketViewerModal';
import { CopyLinkModal } from '@/components/Modals/CopyLinkModal';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import { WorksPageHeader } from './WorksPageHeader';
import { WorksFilterPanel } from './WorksFilterPanel';
import { WorksGrid } from './WorksGrid';

const pageSize = 15;

function dedupeById(items: UploadedTicketInfo[]): UploadedTicketInfo[] {
	const seen = new Set<number>();
	return items.filter((item) => {
		if (seen.has(item.id)) return false;
		seen.add(item.id);
		return true;
	});
}

/**
 * Works 页：filterKey 驱动首屏加载，Intersection Observer 触发分页追加。
 */
export default function Works() {
	const { t, locale } = useLocale();
	const isMobile = useIsMobile();
	const isMobileDevice = isMobile ?? false;

	const [orderBy, setOrderBy] = useState<OrderType>(OrderType.createTime);
	const asc = false;
	const [companyId, setCompanyId] = useState<number>(-1);
	const [ticketId, setTicketId] = useState<number>(-1);
	const [startStation, setStartStation] = useState<string>('');
	const [endStation, setEndStation] = useState<string>('');
	const [anyText, setAnyText] = useState<string>('');
	const [appliedSearch, setAppliedSearch] = useState({ from: '', to: '', text: '' });
	const searchParams = useSearchParams();

	const [filterExpanded, setFilterExpanded] = useState(!(isMobile ?? false));

	const [works, setWorks] = useState<UploadedTicketInfo[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [showTicketViewerModal, setShowTicketViewerModal] = useState<boolean>(false);
	const [urlParamTicketInfo, setUrlParamTicketInfo] = useState<UploadedTicketInfo | null>(null);
	const [showCopyLinkModal, setShowCopyLinkModal] = useState<boolean>(false);

	// 移动端默认收起筛选；桌面端常显
	useEffect(() => {
		setFilterExpanded(!(isMobile ?? false));
	}, [isMobile]);

	const filterKey = useMemo(
		() => JSON.stringify({ companyId, ticketId, orderBy, asc, appliedSearch }),
		[companyId, ticketId, orderBy, appliedSearch]
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
		[companyId, ticketId, orderBy, appliedSearch]
	);

	const isLoadingRef = useRef(false);

	const loadMore = useCallback(async () => {
		if (isLoadingRef.current || !hasMore || isInitialLoading) return;
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
	}, [page, hasMore, fetchPage, isInitialLoading]);

	const sentinelRef = useInfiniteScroll({ hasMore, isLoading: isLoading || isInitialLoading, onLoadMore: loadMore });

	// 筛选 / 排序变化 → 重置分页并加载第 0 页
	useEffect(() => {
		let cancelled = false;
		setPage(0);
		setHasMore(true);
		setIsLoading(true);
		setIsInitialLoading(true);
		isLoadingRef.current = true;

		fetchPage(0, 'replace').finally(() => {
			if (!cancelled) {
				isLoadingRef.current = false;
				setIsLoading(false);
				setIsInitialLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [filterKey, fetchPage]);

	// URL ?ticketId= 打开分享作品预览
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

	const updateWorkLike = useCallback((id: number, delta: number) => {
		setWorks((prev) =>
			prev.map((item) => (item.id === id ? { ...item, like: Math.max(0, item.like + delta) } : item))
		);
	}, []);

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
		setAppliedSearch({ from: '', to: '', text: '' });
	};

	const resultCountText =
		works.length > 0
			? t('worksPage.resultCount').replace('{count}', hasMore ? `${works.length}+` : String(works.length))
			: !isInitialLoading
				? t('worksPage.resultCount').replace('{count}', '0')
				: null;

	return (
		<div className="works-page">
			<WorksPageHeader
				orderBy={orderBy}
				onOrderByChange={setOrderBy}
				isMobile={isMobileDevice}
				filterExpanded={filterExpanded}
				onFilterToggle={() => setFilterExpanded((v) => !v)}
				resultCountText={resultCountText}
				isInitialLoading={isInitialLoading}
			/>

			<WorksFilterPanel
				expanded={filterExpanded}
				isMobile={isMobileDevice}
				companyId={companyId}
				ticketId={ticketId}
				startStation={startStation}
				endStation={endStation}
				anyText={anyText}
				onCompanyChange={(id) => {
					setCompanyId(id);
					setTicketId(-1);
				}}
				onTicketChange={setTicketId}
				onStartStationChange={setStartStation}
				onEndStationChange={setEndStation}
				onAnyTextChange={setAnyText}
				onSearch={handleSearch}
				onReset={handleReset}
			/>

			<WorksGrid
				works={works}
				isLoading={isLoading}
				hasMore={hasMore}
				isInitialLoading={isInitialLoading}
				sentinelRef={sentinelRef}
				onLiked={(id) => updateWorkLike(id, 1)}
				onUndoLiked={(id) => updateWorkLike(id, -1)}
			/>

			<TicketViewerModal
				show={showTicketViewerModal}
				ticketInfo={urlParamTicketInfo}
				onClose={() => setShowTicketViewerModal(false)}
				onShare={() => setShowCopyLinkModal(true)}
			/>
			<CopyLinkModal
				show={showCopyLinkModal}
				ticketInfo={{
					companyId: urlParamTicketInfo ? urlParamTicketInfo.companyId : 0,
					ticketTypeId: urlParamTicketInfo ? urlParamTicketInfo.ticketId : 0,
					ticketData: urlParamTicketInfo ? urlParamTicketInfo.data : {},
					id: '',
				}}
				onClose={() => setShowCopyLinkModal(false)}
				ticketId={urlParamTicketInfo ? urlParamTicketInfo.id : -1}
			/>
		</div>
	);
}
