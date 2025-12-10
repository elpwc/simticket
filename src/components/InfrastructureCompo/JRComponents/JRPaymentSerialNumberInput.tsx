import { useEffect, useState } from 'react';

export const JRPaymentSerialNumberInput = ({ defaultvalue, value, onChange }: { defaultvalue: string; value: string; onChange: (value: string) => void }) => {
	const [head, setHead] = useState('0');
	const [num1TextboxText, setNum1TextboxText] = useState('0000');
	const [num2TextboxText, setNum2TextboxText] = useState('01');

	useEffect(() => {
		if (defaultvalue.includes('-')) {
			const n1 = defaultvalue.split('-')[0];
			const n2 = defaultvalue.split('-')[1];
			if (n1.length >= 5 && n2.length <= 2) {
				setHead(n1[0]);
				setNum1TextboxText(n1.substring(1, 5));
				setNum2TextboxText(n2.substring(0, 2));
			}
		}
	}, []);
	return (
		<div className="flex items-center gap-1">
			{head}
			<div className="border-1 border-[#6d6d6d]">
				<input
					type="text"
					className="border-0 border-[#6d6d6d] border-r-1 w-[100px]"
					value={num1TextboxText}
					onChange={(e) => {
						setNum1TextboxText(e.target.value);
						const num1t = e.target.value;
						let n1 = 0;
						if (num1t.length <= 4 && num2TextboxText.length <= 2) {
							n1 = Number(num1t) || 0;
						} else {
							n1 = Number(num1t.substring(0, 4)) || 0;
						}
						setHead(Math.round(n1 % 7).toString());
						onChange(Math.round(n1 % 7).toString() + n1.toString().padStart(4, '0') + '-' + num2TextboxText);
					}}
				/>
				<input
					type="text"
					className="border-0  w-[60px]"
					value={num2TextboxText}
					onChange={(e) => {
						setNum2TextboxText(e.target.value);
						const num2t = e.target.value;
						let n1 = 0;
						if (num1TextboxText.length <= 4 && num2t.length <= 2) {
							n1 = Number(num1TextboxText) || 0;
						} else {
							n1 = Number(num1TextboxText.substring(0, 4)) || 0;
						}
						setHead(Math.round(n1 % 7).toString());
						onChange(Math.round(n1 % 7).toString() + n1.toString().padStart(4, '0') + '-' + num2t);
					}}
				/>
			</div>
		</div>
	);
};
