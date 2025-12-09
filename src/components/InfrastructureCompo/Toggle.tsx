'use client';

import React, { ReactNode } from 'react';
import './Toggle.css';

type ToggleSwitchProps = {
	value: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
	className?: string;
	size?: number;
	style?: React.CSSProperties;
	bgColor?: string;
	children?: string | ReactNode | null;
	isTitleOnLeftSide?: boolean;
};

const WIDTH = 18;
const BACKGROUND_COLOR = '#4a9bde';

const Toggle: React.FC<ToggleSwitchProps> = ({ value, onChange, disabled = false, className = '', size = 1, style = {}, bgColor = BACKGROUND_COLOR, children, isTitleOnLeftSide = false }) => {
	const hasTitle = !(children === undefined || children === null || children === '' || children === <></>);
	const titleNode = <>{children}</>;
	const toggleBox = (
		<label
			className={`toggle-switch ${className}`}
			style={{
				...style,
				['--width' as string]: `${WIDTH * 2 * size}px`,
				['--height' as string]: `${(WIDTH + 2) * size}px`,
				['--translateX' as string]: `${(WIDTH - 2) * size}px`,
				['--buttonWidth' as string]: `${WIDTH * size}px`,
				['--buttonHeight' as string]: `${WIDTH * size}px`,
				['--buttonLeft' as string]: `${1 * size}px`,
				['--buttonTop' as string]: `${1 * size}px`,
				['--bgColor' as string]: bgColor,
			}}
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<input
				type="checkbox"
				checked={value}
				onClick={(e) => {
					e.stopPropagation();
				}}
				onChange={(e) => {
					if (!disabled) {
						onChange(!value);
					}
				}}
				disabled={disabled}
			/>
			<span className="slider" />
		</label>
	);

	return hasTitle ? (
		<label className={'flex items-center select-none ' + (disabled ? 'toggle-disabled' : '')}>
			{isTitleOnLeftSide && titleNode}
			{toggleBox}
			{!isTitleOnLeftSide && titleNode}
		</label>
	) : (
		toggleBox
	);
};

export default Toggle;
