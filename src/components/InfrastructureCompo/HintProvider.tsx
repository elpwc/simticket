'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HintMessage = {
	id: number;
	position: 'top' | 'bottom' | 'top-right' | 'bottom-right';
	text: string;
	color: string;
	timeout: number;
};

type HintContextType = {
	showHint: (pos: HintMessage['position'], text: string, color?: string, timeout?: number) => void;
};

const HintContext = createContext<HintContextType | null>(null);

export const HintProvider = ({ children }: { children: ReactNode }) => {
	const [hints, setHints] = useState<HintMessage[]>([]);
	let idCounter = 0;

	const showHint = (pos: HintMessage['position'], text: string, color: string = '#333', timeout: number = 1000) => {
		const id = ++idCounter;
		setHints((prev) => [...prev, { id, position: pos, text, color, timeout }]);

		// remove
		setTimeout(() => {
			setHints((prev) => prev.filter((h) => h.id !== id));
		}, timeout);
	};

	const variants = {
		top: { hidden: { y: -30, opacity: 0 }, visible: { y: 0, opacity: 1 } },
		bottom: { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } },
		'top-right': {
			hidden: { x: 30, y: -30, opacity: 0 },
			visible: { x: 0, y: 0, opacity: 1 },
		},
		'bottom-right': {
			hidden: { x: 30, y: 30, opacity: 0 },
			visible: { x: 0, y: 0, opacity: 1 },
		},
	};

	return (
		<HintContext.Provider value={{ showHint }}>
			{children}
			<div className="fixed inset-0 pointer-events-none z-[1145141919]">
				<AnimatePresence>
					{hints.map((h) => (
						<motion.div
							key={h.id}
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={variants[h.position]}
							transition={{ type: 'spring', stiffness: 300, damping: 25 }}
							style={{
								zIndex: 90000000,
								position: 'absolute',
								backgroundColor: h.color,
								color: '#fff',
								padding: '8px 16px',
								borderRadius: '8px',
								boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
								fontSize: '14px',
								fontWeight: 500,
								...(h.position === 'top' && { top: '16px', left: '50%', transform: 'translateX(-50%)' }),
								...(h.position === 'bottom' && { bottom: '16px', left: '50%', transform: 'translateX(-50%)' }),
								...(h.position === 'top-right' && { top: '16px', right: '16px' }),
								...(h.position === 'bottom-right' && { bottom: '16px', right: '16px' }),
							}}
						>
							{h.text}
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</HintContext.Provider>
	);
};

export const useHint = () => {
	const ctx = useContext(HintContext);
	if (!ctx) throw new Error('useHint must be used in <HintProvider>');
	return ctx.showHint;
};
