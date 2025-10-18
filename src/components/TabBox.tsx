'use client';

import { JSX } from 'react';
import React from 'react';
import clsx from 'clsx';

type Props = {
	title: string | JSX.Element | null;
	className?: string;
	classNameTitle?: string;
	classNameOuter?: string;
	style?: React.CSSProperties;
	styleTitle?: React.CSSProperties;
	styleOuter?: React.CSSProperties;
	children?: React.ReactNode;
	id?: string;
	name?: string;
};

const TabBox: React.FC<Props> = ({ title, className, classNameTitle, classNameOuter, style, styleTitle, styleOuter, children, id, name }) => {
	return (
		<div id={id} data-name={name} style={styleOuter} className={clsx('relative border rounded-md p-4 pt-6 border-[#6fc5ff]', classNameOuter)}>
			<span style={styleTitle} className={clsx('absolute -top-3 left-3 bg-white px-2 text-sm font-semibold', classNameTitle)}>
				{title}
			</span>

			<div style={style} className={className}>
				{children}
			</div>
		</div>
	);
};

export default TabBox;
