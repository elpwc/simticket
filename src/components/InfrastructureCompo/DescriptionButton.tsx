'use client';

import { ReactNode, useState } from 'react';
import { Modal } from './Modal';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	title?: string | ReactNode;
	modalTitle?: string | ReactNode;
	children: string | ReactNode;
	textColor?: string;
}

export const DescriptionButton = ({ title, modalTitle = '', children, textColor = '#a81919' }: Props) => {
	const { t } = useLocale();
	const [showDescModal, setShowDescModal] = useState(false);
	if (!title) {
		title = t('DescriptionButton.text');
	}
	return (
		<>
			<button
				type="button"
				className="border-0 text-[12px]"
				style={{ color: textColor }}
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
