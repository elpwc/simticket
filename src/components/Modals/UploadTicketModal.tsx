import { useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import TabBox from '../InfrastructureCompo/TabBox';
import clsx from 'clsx';
import { useLocale } from '@/utils/hooks/useLocale';
import { saveCanvasToLocal, TicketListItemProperty, TicketSizeType } from '@/utils/utils';

interface Props {
	show: boolean;
	ticketInfo: TicketListItemProperty;
	onClose: () => void;
	onUpload?: () => void;
}

export const UploadTicketModal = ({ show, ticketInfo, onClose, onUpload }: Props) => {
	const { t } = useLocale();

	const handleUpload = () => {};

	return (
		<Modal title={'upload ticket'} isOpen={show} onClose={onClose}>
			<div className="flex flex-col"></div>
		</Modal>
	);
};
