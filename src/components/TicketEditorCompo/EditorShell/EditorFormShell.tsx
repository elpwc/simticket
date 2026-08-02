'use client';

import { Children, ReactNode, isValidElement, useState } from 'react';
import clsx from 'clsx';
import './EditorFormShell.css';

interface SectionProps {
	id: string;
	label: string;
	description?: string;
	children: ReactNode;
}

/** 标记一个表单分组；内容由 EditorFormShell 按 id 收集并切换展示 */
function EditorFormSection({ children }: SectionProps) {
	return <>{children}</>;
}

interface ShellProps {
	children: ReactNode;
	defaultSectionId?: string;
	/** 导航栏显示顺序（与 JSX 中 Section 书写顺序无关） */
	sectionOrder?: string[];
	className?: string;
}

/**
 * 编辑器表单壳：分组导航 + 单组展示，避免长表单一次性堆满屏。
 * 用法：用 EditorFormShell.Section 包裹各 TitleContainer 区块即可。
 */
function EditorFormShell({ children, defaultSectionId, sectionOrder, className }: ShellProps) {
	const sections: SectionProps[] = [];

	Children.forEach(children, (child) => {
		if (isValidElement(child) && child.type === EditorFormSection) {
			sections.push(child.props as SectionProps);
		}
	});

	if (sectionOrder?.length) {
		sections.sort((a, b) => {
			const ai = sectionOrder.indexOf(a.id);
			const bi = sectionOrder.indexOf(b.id);
			return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
		});
	}

	const [activeId, setActiveId] = useState(defaultSectionId ?? sections[0]?.id ?? '');
	const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];

	return (
		<div className={clsx('editor-form-shell', className)}>
			<nav className="editor-form-shell__nav" aria-label="Editor sections">
				<div className="editor-form-shell__nav-scroll">
					{sections.map((section) => (
						<button
							key={section.id}
							type="button"
							className={clsx('editor-form-shell__nav-item', activeId === section.id && 'editor-form-shell__nav-item--active')}
							onClick={() => setActiveId(section.id)}
							aria-current={activeId === section.id ? 'true' : undefined}
						>
							{section.label}
						</button>
					))}
				</div>
			</nav>

			{activeSection?.description && <p className="editor-form-shell__desc">{activeSection.description}</p>}

			<div className="editor-form-shell__panel" key={activeSection?.id}>
				{activeSection?.children}
			</div>
		</div>
	);
}

EditorFormShell.Section = EditorFormSection;

export { EditorFormShell, EditorFormSection };
export type { SectionProps as EditorFormSectionProps };
