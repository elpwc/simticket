'use client';

import React, { useState } from 'react';
import './PrettyInputRadioGroup.css';

export type Option = {
	value: string;
	title: React.ReactNode;
};

type Props = {
	value: string;
	onChange: (value: string) => void;
	list: Option[];
	placeholder?: string;
	showInputBox?: boolean;
};

const PrettyInputRadioGroup: React.FC<Props> = ({ value, onChange, list, placeholder = '空(自定义)', showInputBox = true }) => {
	const [diyValue, setDiyValue] = useState('');

	const handleSelect = (val: string) => {
		onChange(val);
	};

	const isCustomActive = !list.some((item) => item.value === value);

	return (
		<div className="radio-group">
			{list.map((item, idx) => {
				const isActive = value === item.value;
				return (
					<button key={idx} className={`radio-btn ${isActive ? 'active' : ''}`} onClick={() => handleSelect(item.value)}>
						{item.title}
					</button>
				);
			})}

			{showInputBox && (
				<input
					type="text"
					className={`radio-diy-input ${isCustomActive ? 'active' : ''}`}
					placeholder={placeholder}
					value={diyValue}
					onClick={() => handleSelect(diyValue)}
					onChange={(e) => {
						const val = e.target.value;
						setDiyValue(val);
						if (isCustomActive) onChange(val);
					}}
				/>
			)}
		</div>
	);
};

export default PrettyInputRadioGroup;
