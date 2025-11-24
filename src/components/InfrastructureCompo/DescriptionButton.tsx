import { ReactNode, useState } from 'react';
import { Modal } from './Modal';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	title?: string;
	modalTitle?: string;
	children: string | ReactNode;
}

export const DescriptionButton = ({ title, modalTitle = '', children }: Props) => {
	const { t } = useLocale();
	const [showDescModal, setShowDescModal] = useState(false);
	if (!title) {
		title = t('DescriptionButton.text');
	}
	return (
		<>
			<button
				type="button"
				className="border-0 text-[12px] text-[#a81919]"
				onClick={() => {
					setShowDescModal(true);
				}}
			>
				{title}
			</button>
			<Modal
				title={modalTitle}
				isOpen={showDescModal}
				className="text-[16px]"
				onClose={() => {
					setShowDescModal(false);
				}}
			>
				{children}
			</Modal>
		</>
	);
};
