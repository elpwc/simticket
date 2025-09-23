import React from 'react';
import './Toggle.css';

type ToggleSwitchProps = {
	value: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
	className?: string;
	size?: number;
	style?: React.CSSProperties;
	bgColor?: string;
};

const WIDTH = 18;
const BACKGROUND_COLOR = '#4a9bde';

const Toggle: React.FC<ToggleSwitchProps> = ({ value, onChange, disabled = false, className = '', size = 1, style = {}, bgColor = BACKGROUND_COLOR }) => {
	return (
		<label
			className={`toggle-switch ${disabled ? 'disabled' : ''} ${className}`}
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
};

export default Toggle;
