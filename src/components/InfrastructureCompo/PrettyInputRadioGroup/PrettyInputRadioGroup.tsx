'use client';

import React, { CSSProperties, useState } from 'react';
import './PrettyInputRadioGroup.css';
import { useLocale } from '@/utils/hooks/useLocale';
import clsx from 'clsx';

export type Option = {
	value: string | any;
	title?: React.ReactNode;
};

type Props = {
	name?: string;
	value: string | any;
	onChange: (value: string | any) => void;
	list: Option[];
	placeholder?: string;
	doNotShowInputBox?: boolean;
	className?: string;
	style?: CSSProperties;
	itemStyle?: CSSProperties;
	inputStyle?: CSSProperties;
	/** ボタンじゃなくて、丸で表示  */
	showAsRadioButton?: boolean;
	showAsButtonGroup?: boolean;
};

const PrettyInputRadioGroup: React.FC<Props> = ({
	name,
	value,
	onChange,
	list,
	placeholder,
	doNotShowInputBox = false,
	className,
	style,
	itemStyle,
	inputStyle,
	showAsRadioButton = false,
	showAsButtonGroup = false,
}) => {
	const { t } = useLocale();
	const [diyValue, setDiyValue] = useState('');
	if (!placeholder || placeholder === '') {
		placeholder = t('InputRadioGroup.placeholder');
	}

	const handleSelect = (val: string) => {
		onChange(val);
	};

	const isCustomActive = !list.some((item) => item.value === value);

	const inputBox = (
		<input
			name={name || ''}
			type="text"
			className={`radio-diy-input ${isCustomActive ? 'active' : ''}`}
			style={{
				borderRadius: showAsButtonGroup ? '4px' : '0',
				margin: showAsButtonGroup ? '1px 1px' : '1px',
				...inputStyle,
			}}
			placeholder={placeholder}
			value={diyValue}
			onClick={() => handleSelect(diyValue)}
			onChange={(e) => {
				const val = e.target.value;
				setDiyValue(val);
				if (isCustomActive) onChange(val);
			}}
		/>
	);

	return (
		<div className={clsx('radio-group', className)} style={{ gap: showAsRadioButton ? '6px' : showAsButtonGroup ? '0' : '2px', ...style }}>
			{showAsRadioButton ? (
				<>
					{list.map((item, idx) => {
						const isActive = value === item.value;
						return (
							<label key={idx} style={{ display: 'flex', alignItems: 'center', ...itemStyle }}>
								<input
									type="radio"
									name={name || ''}
									checked={isActive}
									onChange={(value) => {
										handleSelect(item.value);
									}}
								/>
								{item.title || item.value}
							</label>
						);
					})}

					{!doNotShowInputBox && (
						<label style={{ display: 'flex', alignItems: 'center', ...itemStyle }}>
							<input
								type="radio"
								name={name || ''}
								checked={isCustomActive}
								onChange={(value) => {
									handleSelect(diyValue);
								}}
							/>
							{inputBox}
						</label>
					)}
				</>
			) : (
				<>
					{list.map((item, idx) => {
						const isActive = value === item.value;
						return (
							<button
								key={idx}
								name={name || ''}
								className={`radio-btn ${isActive ? 'active' : ''}`}
								style={{
									borderRadius: showAsButtonGroup ? (idx === 0 ? '4px 0 0 4px' : idx === list.length - 1 ? '0 4px 4px 0' : '0') : '0',
									borderRight: showAsButtonGroup && idx !== list.length - 1 ? 'none' : '1px solid #aaa',
									margin: showAsButtonGroup ? '1px 0px' : '1px',
									...itemStyle,
								}}
								onClick={() => handleSelect(item.value)}
							>
								{item.title || item.value}
							</button>
						);
					})}

					{!doNotShowInputBox && inputBox}
				</>
			)}
		</div>
	);
};

export default PrettyInputRadioGroup;
