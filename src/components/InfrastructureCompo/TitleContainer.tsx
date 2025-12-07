'use client';

import { JSX, useEffect, useState } from 'react';
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
	addCheckbox?: boolean;
	isDefaultDisabled?: boolean;
	disabled?: boolean;
	onCheckboxChange?: (available: boolean) => void;
};

const TitleContainer: React.FC<Props> = ({
	title,
	className,
	classNameTitle,
	classNameOuter,
	style,
	styleTitle,
	styleOuter,
	children,
	id,
	name,
	addCheckbox,
	isDefaultDisabled = false,
	disabled,
	onCheckboxChange,
}) => {
	const [available, setAvailable] = useState(!isDefaultDisabled);

	useEffect(() => {
		setAvailable(!disabled);
	}, [disabled]);

	return (
		<div id={id} data-name={name} style={styleOuter} className={clsx('relative border rounded-md p-4 pt-6 mt-4 border-[#6fc5ff]', classNameOuter)}>
			<label style={styleTitle} className={clsx('absolute -top-3 left-3 bg-white px-2 text-sm font-semibold', addCheckbox ? 'select-none' : '', classNameTitle)}>
				{addCheckbox && (
					<input
						type="checkbox"
						checked={available}
						onChange={(e) => {
							onCheckboxChange?.(!available);
							setAvailable(!available);
						}}
					/>
				)}
				{title}
			</label>

			<div style={{ ...style, opacity: available ? 1 : 0.5, pointerEvents: available ? 'auto' : 'none' }} className={className}>
				{children}
			</div>
		</div>
	);
};

export default TitleContainer;
