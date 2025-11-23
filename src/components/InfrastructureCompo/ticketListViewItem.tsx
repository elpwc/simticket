'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketViewer } from './ticketViewer';
import { useState } from 'react';
import { useIsMobile } from '@/utils/hooks';
import { useHint } from './HintProvider';
import { useLocale } from '@/utils/hooks/useLocale';
import { getTicketURL } from '@/utils/utils';

interface Props {
	width: number;
	height: number;
	className?: string;
	borderRadius?: string;
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
	onDelete?: () => void;
	onSave?: () => void;
	onUpload?: () => void;
}

export const TicketListViewItem = ({ width, height, className, borderRadius, companyId, ticketTypeId, ticketData, onDelete, onSave, onUpload }: Props) => {
	const { t } = useLocale();
	const isMobile = useIsMobile();
	const hint = useHint();

	const [hovered, setHovered] = useState(false);
	const showButtons = hovered || isMobile;

	return (
		<div
			className={`relative inline-block overflow-y-clip box-content py-1 ${className ?? ''}`}
			style={{ width, height, borderRadius }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className="flex w-full h-full justify-center">
				<TicketViewer
					width={width}
					height={height}
					className="w-full m-auto"
					style={{ boxShadow: '0 0 3px 0px #858585' }}
					borderRadius={borderRadius}
					companyId={companyId}
					ticketTypeId={ticketTypeId}
					ticketData={ticketData}
				/>
			</div>

			<AnimatePresence>
				{showButtons && (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.1 }} className="absolute top-1 right-1 z-20">
						<button
							title={'copy URL'}
							onClick={() => {
								navigator.clipboard
									.writeText(getTicketURL(companyId, ticketTypeId, ticketData))
									.then(() => hint('top', t('TicketListViewItem.copyLink.hint.success')))
									.catch((err) => hint('top', t('TicketListViewItem.copyLink.hint.fail'), 'red', 2000));
							}}
							className="text-xs text-black rounded-md px-1 py-1 shadow-sm transition"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
							</svg>
						</button>
						<button title={'delete'} onClick={onDelete} className="text-xs bg-red-600 hover:bg-red-700 text-white rounded-md px-1 py-1 shadow-sm transition">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
							</svg>
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showButtons && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.1 }}
						className="absolute bottom-0 left-0 w-full bg-white/60 backdrop-blur-sm flex justify-around py-1 text-sm"
					>
						<button
							className="w-full text-[10px] px-2 py-1 rounded hover:bg-gray-100 transition"
							onClick={() => {
								onSave?.();
							}}
						>
							保存
						</button>
						<button
							className="flex justify-center gap-1 w-full text-[10px] px-2 py-1 rounded hover:bg-gray-100 transition"
							onClick={() => {
								onUpload?.();
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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
	);
};
