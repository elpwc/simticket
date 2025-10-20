import { ReactNode, useState } from 'react';
import { Modal } from './Modal';

interface Props {
	title?: string;
	modalTitle?: string;
	children: string | ReactNode;
}

export const DescriptionButton = ({ title = '※说明', modalTitle = '', children }: Props) => {
	const [showDescModal, setShowDescModal] = useState(false);
	return (
		<>
			<button
				className="border-0 text-[12px] text-[#a81919]"
				onClick={() => {
					console.log(showDescModal, 123);
					setShowDescModal(true);
				}}
			>
				{title}
			</button>
			<Modal
				title={modalTitle}
				isOpen={showDescModal}
				onClose={() => {
					console.log(showDescModal, 456);
					setShowDescModal(false);
				}}
			>
				{children}
			</Modal>
		</>
	);
};
