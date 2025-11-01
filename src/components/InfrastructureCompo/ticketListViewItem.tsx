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
			className={`relative inline-block overflow-hidden ${className ?? ''}`}
			style={{ width, height, borderRadius }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<TicketViewer width={width} height={height} className="w-full h-full" borderRadius={borderRadius} companyId={companyId} ticketTypeId={ticketTypeId} ticketData={ticketData} />

			<AnimatePresence>
				{showButtons && (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute top-1 right-1 z-20">
						<button onClick={onDelete} className="text-xs bg-white/80 hover:bg-white text-gray-800 rounded-md px-2 py-1 shadow-sm transition">
							删除
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
						transition={{ duration: 0.25 }}
						className="absolute bottom-0 left-0 w-full bg-white/60 backdrop-blur-sm flex justify-around py-1 text-sm"
					>
						<button className="px-2 py-1 rounded hover:bg-gray-100 transition">导出</button>
						<button className="px-2 py-1 rounded hover:bg-gray-100 transition">发布</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
