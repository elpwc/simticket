'use client';

import React, { CSSProperties, useState } from 'react';
import './PrettyInputRadioGroup.css';
import { useLocale } from '@/utils/hooks/useLocale';
import clsx from 'clsx';

export type Option = {
	value: string | any;
	title: React.ReactNode;
};

type Props = {
	name?: string;
	value: string | any;
	onChange: (value: string | any) => void;
	list: Option[];
	placeholder?: string;
	showInputBox?: boolean;
	className?: string;
	style?: CSSProperties;
	itemStyle?: CSSProperties;
	inputStyle?: CSSProperties;
};

const PrettyInputRadioGroup: React.FC<Props> = ({ name, value, onChange, list, placeholder, showInputBox = true, className, style, itemStyle, inputStyle }) => {
	const { t } = useLocale();
	const [diyValue, setDiyValue] = useState('');
	if (!placeholder || placeholder === '') {
		placeholder = t('InputRadioGroup.placeholder');
	}

	const handleSelect = (val: string) => {
		onChange(val);
	};

	const isCustomActive = !list.some((item) => item.value === value);

	return (
		<div className={clsx('radio-group', className)} style={style}>
			{list.map((item, idx) => {
				const isActive = value === item.value;
				return (
					<button key={idx} name={name || ''} className={`radio-btn ${isActive ? 'active' : ''}`} style={itemStyle} onClick={() => handleSelect(item.value)}>
						{item.title}
					</button>
				);
			})}

			{showInputBox && (
				<input
					name={name || ''}
					type="text"
					className={`radio-diy-input ${isCustomActive ? 'active' : ''}`}
					style={inputStyle}
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
