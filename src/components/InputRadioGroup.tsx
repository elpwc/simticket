'use client';

import React, { useState } from 'react';

type Props = {
	name: string;
	value: string;
	onChange: (value: string) => void;
	list: string[];
};

const InputRadioGroup: React.FC<Props> = ({ name, value, onChange, list }) => {
	const [diyValue, setDiyValue] = useState('');

	return (
		<div className="flex gap-1 flex-wrap">
			{list.map((item, idx) => (
				<label key={idx} className="flex items-center">
					<input type="radio" name={name} checked={value === item} onChange={() => onChange(item)} />
					{item}
				</label>
			))}

			<label className="flex items-center">
				<input type="radio" name="seat3" checked={!list.includes(value)} onChange={() => onChange(diyValue)} />
				<input
					type="text"
					value={diyValue}
					placeholder="自定义"
					onChange={(e) => {
						const val = e.target.value;
						setDiyValue(val);
						if (!list.includes(value)) {
							onChange(val);
						}
					}}
					className="border px-1"
				/>
			</label>
		</div>
	);
};

export default InputRadioGroup;
