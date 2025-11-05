'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketViewer } from './ticketViewer';
import { useState } from 'react';
import { useIsMobile } from '@/utils/hooks';

interface Props {
	width: number;
	height: number;
	className?: string;
	borderRadius?: string;
	companyId: number;
	ticketTypeId: number;
	ticketData?: any;
	onDelete?: () => void;
}

export const TicketListViewItem = ({ width, height, className, borderRadius, companyId, ticketTypeId, ticketData, onDelete }: Props) => {
	const isMobile = useIsMobile();

	const [hovered, setHovered] = useState(false);
	const showButtons = hovered || isMobile;

	return (
		<div
			className={`relative inline-block overflow-y-clip ${className ?? ''}`}
			style={{ width, height, borderRadius, border: 'solid 1px gray' }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<TicketViewer width={width} height={height} className="w-full h-full" borderRadius={borderRadius} companyId={companyId} ticketTypeId={ticketTypeId} ticketData={ticketData} />

			<AnimatePresence>
				{showButtons && (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.1 }} className="absolute top-1 right-1 z-20">
						<button onClick={onDelete} className="text-xs hover:bg-white text-black rounded-md px-1 py-1 shadow-sm transition">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
							</svg>
						</button>
						<button onClick={onDelete} className="text-xs hover:bg-white text-white rounded-md px-1 py-1 shadow-sm transition" style={{ backgroundColor: 'red' }}>
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
						<button className="w-full text-[10px] px-2 py-1 rounded hover:bg-gray-100 transition">保存</button>
						<button className="w-full text-[10px] px-2 py-1 rounded hover:bg-gray-100 transition">投稿</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
