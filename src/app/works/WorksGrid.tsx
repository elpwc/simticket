'use client';

import { UploadedWorkItem } from '@/components/InfrastructureCompo/UploadedWorkItem';
import { useLocale } from '@/utils/hooks/useLocale';
import { UploadedTicketInfo } from '@/utils/utils';
import Link from 'next/link';
import { RefObject } from 'react';

interface Props {
	works: UploadedTicketInfo[];
	isLoading: boolean;
	hasMore: boolean;
	isInitialLoading: boolean;
	sentinelRef: RefObject<HTMLDivElement | null>;
	onLiked: (id: number) => void;
	onUndoLiked: (id: number) => void;
}

/**
 * 作品网格：sm 2 列 / lg 3 列 / xl 4 列，适配移动端单列浏览。
 */
export function WorksGrid({ works, isLoading, hasMore, isInitialLoading, sentinelRef, onLiked, onUndoLiked }: Props) {
	const { t } = useLocale();

	if (!isInitialLoading && works.length === 0) {
		return (
			<div className="works-empty">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-gray-300 dark:text-neutral-600 mb-3" viewBox="0 0 16 16" aria-hidden>
					<path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
				</svg>
				<p className="font-medium text-gray-700 dark:text-neutral-200">{t('worksPage.empty.title')}</p>
				<p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 max-w-xs text-center">{t('worksPage.empty.description')}</p>
				<Link href="/" className="primary mt-4 inline-block px-4 py-2 no-underline">
					{t('worksPage.empty.cta')}
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="works-grid pb-8">
				{works.map((work) => (
					<UploadedWorkItem
						key={work.id}
						className="works-grid-item"
						uploadedTicketInfo={work}
						onLiked={() => onLiked(work.id)}
						onUndoLiked={() => onUndoLiked(work.id)}
					/>
				))}
			</div>

			<div ref={sentinelRef} className="works-load-sentinel" aria-live="polite">
				{isInitialLoading || isLoading ? (
					<>
						<span className="works-spinner" aria-hidden />
						<span>{t('worksPage.loading')}</span>
					</>
				) : !hasMore && works.length > 0 ? (
					<span>{t('worksPage.noMore')}</span>
				) : null}
			</div>
		</>
	);
}
