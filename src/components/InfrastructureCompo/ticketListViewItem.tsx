'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TicketViewer } from './ticketViewer';
import { Dispatch, SetStateAction, useContext, useState, type MouseEvent } from 'react';
import { useIsMobile } from '@/utils/hooks';
import { useHint } from './HintProvider';
import { useLocale } from '@/utils/hooks/useLocale';
import { getTicketURL, TicketListItemProperty } from '@/utils/utils';
import { AppContext } from '@/app/app';
import { Modal } from './Modal';
import { useRouter } from 'next/navigation';
import './ticketListViewItem.css';

interface Props {
	width: number;
	height: number;
	className?: string;
	borderRadius?: string;
	ticketInfo: TicketListItemProperty;
	onDelete?: () => void;
	onSave?: () => void;
	onUpload?: () => void;
	onClick?: () => void;
	/**
	 * overlay：按钮悬浮在票面上（桌面 Dock，hover 显示）
	 * compact：按钮在票面下方紧凑排列（移动 Sheet，始终显示）
	 */
	layout?: 'overlay' | 'compact';
	/** @deprecated 请使用 layout="compact" */
	overlayOnHoverOnly?: boolean;
}

const ICON_SIZE = 16;
const COMPACT_ICON_SIZE = 12;

export const TicketListViewItem = ({
	width,
	height,
	className,
	borderRadius,
	ticketInfo,
	onDelete,
	onSave,
	onUpload,
	onClick,
	layout: layoutProp,
	overlayOnHoverOnly = false,
}: Props) => {
	const layout = layoutProp ?? (overlayOnHoverOnly ? 'compact' : 'overlay');

	const { t } = useLocale();
	const isMobile = useIsMobile();
	const hint = useHint();
	const router = useRouter();

	const [hovered, setHovered] = useState(false);
	// overlay 模式：桌面 hover 或移动 UA 时显示；compact 模式：始终显示
	const showOverlayButtons = layout === 'overlay' && (hovered || !!isMobile);

	const [showEditComfirmDialog, setShowEditComfirmDialog] = useState(false);

	const { editingTicketData, setEditingTicketData } = useContext(AppContext);
	const { setCopyEditingTicketDataToDrawParameters } = useContext(AppContext);

	const {
		ticketListItems,
		setTicketListItems,
	}: {
		ticketListItems: TicketListItemProperty[];
		setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>>;
	} = useContext(AppContext);

	const handleEdit = () => {
		setShowEditComfirmDialog(true);
	};
	const { selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
	const { selectedTicketId, setSelectedTicketId } = useContext(AppContext);

	/** 将列表中的车票载入编辑页：与 copy 标志同批次更新，避免 remount 时被 getInitialValues 覆盖 */
	const loadTicketIntoEditor = () => {
		const data = structuredClone(ticketInfo.ticketData);
		setEditingTicketData(data);
		setSelectedCompanyId(ticketInfo.companyId);
		setSelectedTicketId(ticketInfo.ticketTypeId);
		setCopyEditingTicketDataToDrawParameters(true);
		setShowEditComfirmDialog(false);
		router.push(`/?com=${ticketInfo.companyId}&ticket=${ticketInfo.ticketTypeId}&id=${ticketInfo.id}`);
	};

	const stopProp = (e: MouseEvent, fn?: () => void) => {
		e.stopPropagation();
		fn?.();
	};

	const handleCopyLink = () => {
		navigator.clipboard
			.writeText(getTicketURL(ticketInfo.companyId, ticketInfo.ticketTypeId, ticketInfo.ticketData))
			.then(() => hint('top', t('TicketListViewItem.copyLink.hint.success')))
			.catch(() => hint('top', t('TicketListViewItem.copyLink.hint.fail'), 'red', 2000));
	};

	const preview = (
		<TicketViewer
			width={width}
			height={height}
			className="w-full m-auto"
			style={{ boxShadow: '0 0 3px 0px #858585' }}
			borderRadius={borderRadius}
			companyId={ticketInfo.companyId}
			ticketTypeId={ticketInfo.ticketTypeId}
			ticketData={ticketInfo.ticketData}
		/>
	);

	return (
		<>
			{layout === 'compact' ? (
				<div className={`ticket-list-view-item-compact ${className ?? ''}`} style={{ width }}>
					<div className="ticket-list-view-item-compact__preview" onClick={onClick}>
						{preview}
					</div>
					<div className="ticket-list-view-item-compact__toolbar">
						<button
							type="button"
							title="save to local"
							className="ticket-list-view-item-compact__btn"
							onClick={(e) => stopProp(e, onSave)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width={COMPACT_ICON_SIZE} height={COMPACT_ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
								<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
								<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
							</svg>
						</button>
						<button type="button" title="copy URL" className="ticket-list-view-item-compact__btn" onClick={(e) => stopProp(e, handleCopyLink)}>
							<svg xmlns="http://www.w3.org/2000/svg" width={COMPACT_ICON_SIZE} height={COMPACT_ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
								<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
							</svg>
						</button>
						<button
							type="button"
							title="delete"
							className="ticket-list-view-item-compact__btn ticket-list-view-item-compact__btn--danger"
							onClick={(e) => stopProp(e, onDelete)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width={COMPACT_ICON_SIZE} height={COMPACT_ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
							</svg>
						</button>
						<span className="ticket-list-view-item-compact__divider" aria-hidden />
						<button type="button" className="ticket-list-view-item-compact__btn ticket-list-view-item-compact__btn-label" onClick={(e) => stopProp(e, handleEdit)}>
							編集
						</button>
						<button type="button" className="ticket-list-view-item-compact__btn ticket-list-view-item-compact__btn-label" onClick={(e) => stopProp(e, onUpload)}>
							投稿
						</button>
					</div>
				</div>
			) : (
				<div
					className={`relative inline-block overflow-y-clip box-content py-1 ${className ?? ''}`}
					style={{ width, height, borderRadius }}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<div className="flex w-full h-full justify-center cursor-pointer" onClick={onClick}>
						{preview}
					</div>

					<AnimatePresence>
						{showOverlayButtons && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.1 }}
								className="absolute top-1 right-1 z-20 flex gap-0.5"
							>
								<button type="button" title="save to local" onClick={(e) => stopProp(e, onSave)} className="text-xs text-black rounded-md px-1 py-1 shadow-sm transition">
									<svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
										<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
										<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
									</svg>
								</button>
								<button type="button" title="copy URL" onClick={(e) => stopProp(e, handleCopyLink)} className="text-xs text-black rounded-md px-1 py-1 shadow-sm transition">
									<svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
										<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
									</svg>
								</button>
								<button type="button" title="delete" onClick={(e) => stopProp(e, onDelete)} className="text-xs bg-red-600 hover:bg-red-700 text-white rounded-md px-1 py-1 shadow-sm transition">
									<svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
										<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
									</svg>
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{showOverlayButtons && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.1 }}
								className="absolute bottom-0 left-0 w-full bg-white/60 backdrop-blur-sm flex justify-around py-1 text-sm"
							>
								<button type="button" className="w-full text-[10px] px-2 py-1 rounded hover:bg-gray-100 transition" onClick={(e) => stopProp(e, handleEdit)}>
									編集
								</button>
								<button type="button" className="flex justify-center gap-1 w-full text-[10px] px-2 py-1 rounded hover:bg-gray-100 transition" onClick={(e) => stopProp(e, onUpload)}>
									<svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} fill="currentColor" viewBox="0 0 16 16">
										<path
											fillRule="evenodd"
											d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0m-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0"
										/>
									</svg>
									投稿
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			<Modal
				isOpen={showEditComfirmDialog}
				showCancelButton
				showCancel2Button
				showOkButton
				showCloseButton
				cancelText={t('TicketListViewItem.editConfirmDialog.cancel')}
				cancel2Text={t('TicketListViewItem.editConfirmDialog.cancel2')}
				okText={t('TicketListViewItem.editConfirmDialog.ok')}
				onCancel={() => {
					setShowEditComfirmDialog(false);
				}}
				onCancel2={() => {
					loadTicketIntoEditor();
				}}
				onOk={() => {
					setTicketListItems((prev: TicketListItemProperty[]) => [
						...prev,
						{
							id: crypto.randomUUID(),
							companyId: selectedCompanyId,
							ticketTypeId: selectedTicketId,
							ticketData: structuredClone(editingTicketData),
						},
					]);
					loadTicketIntoEditor();
				}}
				onClose={() => {
					setShowEditComfirmDialog(false);
				}}
			>
				<p>{t('TicketListViewItem.editConfirmDialog.text')}</p>
			</Modal>
		</>
	);
};
