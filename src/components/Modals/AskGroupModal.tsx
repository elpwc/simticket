import { Modal } from '../InfrastructureCompo/Modal';
import './modals.css';

interface Props {
	text: string;
	show: boolean;
	onClose: () => void;
	onOk?: () => void;
}

export const AskGroupModal = ({ text, show, onClose, onOk }: Props) => {
	return (
		<Modal isOpen={show} mobileMode="center" onClose={onClose} onOk={onOk} title={text} showOkButton showCancelButton>
			<></>
		</Modal>
	);
};
