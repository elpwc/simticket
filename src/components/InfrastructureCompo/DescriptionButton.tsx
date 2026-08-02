'use client';

import { ReactNode, useState } from 'react';
import { Modal } from './Modal';
import { useLocale } from '@/utils/hooks/useLocale';
import { useTheme } from '@/utils/hooks/useTheme';

interface Props {
	title?: string | ReactNode;
	modalTitle?: string | ReactNode;
	children: string | ReactNode;
	textColor?: string;
	/** 深色模式下的文字色；未传时使用更亮的默认色 */
	darkTextColor?: string;
}

export const DescriptionButton = ({ title, modalTitle = '', children, textColor = '#a81919', darkTextColor = '#f87171' }: Props) => {
	const { t } = useLocale();
	const { resolvedTheme } = useTheme();
	const [showDescModal, setShowDescModal] = useState(false);
	if (!title) {
		title = t('DescriptionButton.text');
	}
	const color = resolvedTheme === 'dark' ? darkTextColor : textColor;
	return (
		<>
			<button
				type="button"
				className="border-0 text-[12px] description-button"
				style={{ color }}
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
