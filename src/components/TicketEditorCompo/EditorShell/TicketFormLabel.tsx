'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface TicketFormLabelProps {
	/** 字段标题（单独放在左侧，不包裹控件） */
	label: ReactNode;
	children: ReactNode;
	className?: string;
	/** 可选：关联右侧控件的 id，仅在 label 为纯文本时生效 */
	htmlFor?: string;
}

/**
 * 编辑器表单字段行：标题与控件分离，避免整行 label 包裹导致点击空白误触控件。
 * Toggle / checkbox 等可放在标题侧或自行用 label 包裹；复杂标题节点不再外包一层 label，避免嵌套。
 */
export function TicketFormLabel({ label, children, className, htmlFor }: TicketFormLabelProps) {
	const isPlainLabel = typeof label === 'string' || typeof label === 'number';

	return (
		<div className={clsx('ticket-form-label', className)}>
			<div className="ticket-form-label__text">
				{isPlainLabel ? <label htmlFor={htmlFor}>{label}</label> : label}
			</div>
			<div className="ticket-form-label__control">{children}</div>
		</div>
	);
}
