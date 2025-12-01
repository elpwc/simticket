'use client';

import { Modal } from '../InfrastructureCompo/Modal';
import { useLocale } from '@/utils/hooks/useLocale';
import { getTicketURL, getUploadedTicketURL, TicketListItemProperty } from '@/utils/utils';
import './index.css';
import clsx from 'clsx';
import { DescriptionButton } from '../InfrastructureCompo/DescriptionButton';
import { useHint } from '../InfrastructureCompo/HintProvider';

interface Props {
	show: boolean;
	ticketInfo: TicketListItemProperty;
	ticketId?: number;
	onClose: () => void;
	onSubmitButtonClick?: () => void;
}

export const CopyLinkModal = ({ show, ticketInfo, ticketId = -1, onClose, onSubmitButtonClick }: Props) => {
	const { t } = useLocale();
	const hint = useHint();

	return (
		<Modal title={t('CopyLinkModal.title')} isOpen={show} onClose={onClose}>
			<div className="flex flex-col gap-4 box-border">
				<label className="flex flex-col">
					<div className="flex justify-between items-center">
						{t('CopyLinkModal.editorLink')}
						<button
							onClick={() => {
								navigator.clipboard
									.writeText(getTicketURL(ticketInfo.companyId, ticketInfo.ticketTypeId, ticketInfo.ticketData))
									.then(() => hint('top', t('TicketListViewItem.copyLink.hint.success')))
									.catch((err) => hint('top', t('TicketListViewItem.copyLink.hint.fail'), 'red', 2000));
							}}
						>
							{t('CopyLinkModal.copy')}
						</button>
					</div>
					<textarea className="bg-gray-200 text-[12px] w-[95%] h-[100px] p-1" readOnly value={getTicketURL(ticketInfo.companyId, ticketInfo.ticketTypeId, ticketInfo.ticketData)} />
				</label>
				<label className="flex flex-col">
					<div className="flex justify-between items-center">
						{t('CopyLinkModal.viewerLink')}
						<div className="flex items-center">
							<button
								className={clsx(ticketId < 0 ? 'disabled' : '', 'bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition')}
								onClick={() => {
									if (ticketId < 0) return;
									const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${getUploadedTicketURL(ticketId)}`)}`;
									window.open(url, '_blank');
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
									<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
								</svg>
							</button>
							<button
								className={clsx(ticketId < 0 ? 'disabled' : '')}
								onClick={() => {
									if (ticketId < 0) return;
									navigator.clipboard
										.writeText(getUploadedTicketURL(ticketId))
										.then(() => hint('top', t('TicketListViewItem.copyLink.hint.success')))
										.catch((err) => hint('top', t('TicketListViewItem.copyLink.hint.fail'), 'red', 2000));
								}}
							>
								{t('CopyLinkModal.copy')}
							</button>
						</div>
					</div>
					{ticketId < 0 ? (
						<div className="border-1 rounded-[4px] p-2 border-gray-300 flex flex-col items-center">
							<p className="text-[14px]">
								{t('CopyLinkModal.noViewerLink')}
								<DescriptionButton
									title={
										<span className="flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
												<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
											</svg>
											{t('UploadTicketModal.tips.why')}
										</span>
									}
								>
									<p>
										{t('CopyLinkModal.noViewerLinkDescription')}
										<DescriptionButton
											title={
												<span className="flex items-center">
													<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
														<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
													</svg>
													{t('CopyLinkModal.whyDontUseViewerLink')}
												</span>
											}
										>
											{t('CopyLinkModal.whyDontUseViewerLinkDescription')}
										</DescriptionButton>
									</p>
								</DescriptionButton>
							</p>
							<button className="primary w-[200px]" onClick={onSubmitButtonClick}>
								{t('CopyLinkModal.submit')}
							</button>
						</div>
					) : (
						<input className="bg-gray-200 text-[12px] w-[95%] h-[30px] p-1" readOnly value={getUploadedTicketURL(ticketId)} />
					)}
				</label>
			</div>
		</Modal>
	);
};
