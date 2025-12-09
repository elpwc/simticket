import { useEffect, useState } from 'react';

export const JRPaymentSerialNumberInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
	const [head, setHead] = useState('0');
	const [num1, setNum1] = useState('0000');
	const [num2, setNum2] = useState('01');

	useEffect(() => {
		let n1 = 0;
		if (num1.length <= 4 && num2.length <= 2) {
			n1 = Number(num1) || 0;
		} else {
			n1 = Number(num1.substring(0, 4)) || 0;
		}
		setHead(Math.round(n1 % 7).toString());
		onChange(head + n1.toString().padStart(4, '0') + '-' + num2);
	}, [num1, num2]);

	useEffect(() => {
		if (value.includes('-')) {
			const n1 = value.split('-')[0];
			const n2 = value.split('-')[1];
			if (n1.length >= 5 && n2.length <= 2) {
				setHead(n1[0]);
				setNum1(n1.substring(1, 5));
				setNum2(n2.substring(0, 2));
			}
		}
	}, [value]);
	return (
		<div className="flex items-center gap-1">
			{head}
			<div className="border-1 border-[#6d6d6d]">
				<input type="text" className="border-0 border-[#6d6d6d] border-r-1 w-[100px]" value={num1} onChange={(e) => setNum1(e.target.value)} />
				<input type="text" className="border-0  w-[60px]" value={num2} onChange={(e) => setNum2(e.target.value)} />
			</div>
		</div>
	);
};
