import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
	hasMore: boolean;
	isLoading: boolean;
	onLoadMore: () => void;
	rootMargin?: string;
}

export function useInfiniteScroll({ hasMore, isLoading, onLoadMore, rootMargin = '200px' }: UseInfiniteScrollOptions) {
	const sentinelRef = useRef<HTMLDivElement>(null);
	const onLoadMoreRef = useRef(onLoadMore);

	useEffect(() => {
		onLoadMoreRef.current = onLoadMore;
	}, [onLoadMore]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMore && !isLoading) {
					onLoadMoreRef.current();
				}
			},
			{ rootMargin }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMore, isLoading, rootMargin]);

	return sentinelRef;
}
