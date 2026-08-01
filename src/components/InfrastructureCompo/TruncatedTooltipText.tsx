'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface Props {
	text: string;
	className?: string;
}

/**
 * 文本溢出省略时，鼠标悬停以 fixed 气泡显示完整内容（避免被卡片 overflow 裁剪）。
 */
export function TruncatedTooltipText({ text, className = '' }: Props) {
	const textRef = useRef<HTMLParagraphElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);
	const [showTip, setShowTip] = useState(false);
	const [tipStyle, setTipStyle] = useState<CSSProperties>({});

	const updateTruncated = useCallback(() => {
		const el = textRef.current;
		if (!el) return;
		setIsTruncated(el.scrollWidth > el.clientWidth);
	}, []);

	useEffect(() => {
		updateTruncated();
		const el = textRef.current;
		if (!el) return;
		const ro = new ResizeObserver(updateTruncated);
		ro.observe(el);
		return () => ro.disconnect();
	}, [text, updateTruncated]);

	const handleMouseEnter = () => {
		if (!isTruncated || !textRef.current) return;
		const rect = textRef.current.getBoundingClientRect();
		setTipStyle({
			left: rect.left,
			top: rect.top - 8,
			transform: 'translateY(-100%)',
			maxWidth: Math.max(rect.width, 220),
		});
		setShowTip(true);
	};

	const handleMouseLeave = () => {
		setShowTip(false);
	};

	return (
		<>
			<p ref={textRef} className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				{text}
			</p>
			{showTip &&
				isTruncated &&
				typeof document !== 'undefined' &&
				createPortal(
					<div className="truncated-tooltip-bubble" style={tipStyle} role="tooltip">
						{text}
					</div>,
					document.body
				)}
		</>
	);
}
