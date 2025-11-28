'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import { useLocale } from '@/utils/hooks/useLocale';
import { encodeTicket, TicketListItemProperty } from '@/utils/utils';
import { Field, Form, Formik } from 'formik';
import './index.css';
import { TicketViewer } from '../InfrastructureCompo/ticketViewer';
import { getIP } from '@/utils/api';
import clsx from 'clsx';
import { DescriptionButton } from '../InfrastructureCompo/DescriptionButton';
import { useHint } from '../InfrastructureCompo/HintProvider';

interface Props {
	show: boolean;
	ticketInfo: TicketListItemProperty;
	onClose: () => void;
}

export const UploadTicketModal = ({ show, ticketInfo, onClose }: Props) => {
	const { t } = useLocale();
	const hint = useHint();

	const [isAgree, setIsAgree]: [boolean, any] = useState(false);
	const [buttonAvailable, setbuttonAvailable]: [boolean, any] = useState(false);
	const [initialValues, setinitialValues]: [any, any] = useState();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setinitialValues({
				name: '',
				editorName: localStorage.getItem('editorName') || '',
			});
		}
	}, []);
	
	useEffect(() => {
		setbuttonAvailable(isAgree);
	}, [isAgree]);

	const handleUpload = async (values: typeof initialValues) => {
		const ticketData = encodeTicket(ticketInfo.companyId, ticketInfo.ticketTypeId, ticketInfo.ticketData);
		if (ticketData.length > 2048) {
			hint('top', t('UploadTicketModal.tooLong'), 'red');
		} else {
			await fetch('/api/ticket', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: values.name,
					editorName: values.editorName,
					companyId: ticketInfo.companyId,
					ticketId: ticketInfo.ticketTypeId,
					data: ticketData,
					ip: await getIP(),
				}),
			})
				.then((e) => {
					//console.log(e);
					localStorage.setItem('editorName', values.editorName ?? '');
					hint('top', t('UploadTicketModal.done'));
					onClose?.();
				})
				.catch((e) => {
					//console.log(e);
					hint('top', 'Error: ' + e, 'red');
				})
				.finally(() => {
					if (isAgree) {
						setbuttonAvailable(true);
					}
				});
		}
	};

	return (
		<Modal title={t('UploadTicketModal.title')} isOpen={show} onClose={onClose}>
			<div className="flex flex-col"></div>
			<div>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					onSubmit={async (values, { resetForm }) => {
						if (!buttonAvailable) {
							return;
						}
						setbuttonAvailable(false);
						handleUpload(values);
					}}
				>
					{({ values }) => (
						<Form className="login-form">
							<TicketViewer
								width={500}
								height={-1}
								className="w-full m-auto"
								style={{ boxShadow: '0 0 3px 0px #858585' }}
								companyId={ticketInfo.companyId}
								ticketTypeId={ticketInfo.ticketTypeId}
								ticketData={ticketInfo.ticketData}
							/>

							<div className="text-[12px] flex flex-col gap-3">
								<p>{t('UploadTicketModal.tips.tip1')}</p>
								<span>{t('UploadTicketModal.tips.tip2')}</span>
								<span>
									{t('UploadTicketModal.tips.tip3')}
									<DescriptionButton
										title={
											<span className="flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
													<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
												</svg>
												{t('UploadTicketModal.tips.why')}
											</span>
										}
										modalTitle={t('UploadTicketModal.tips.why')}
										textColor="gray"
									>
										{t('UploadTicketModal.tips.whyText')}
									</DescriptionButton>
								</span>
							</div>

							<label className="login-form-item-container">
								<label className="login-form-checkbox-container">
									<input
										type="checkbox"
										name="agree"
										className="auto-login-checkbox"
										checked={isAgree}
										onChange={(e: any) => {
											setIsAgree(!isAgree);
										}}
									/>
									<span className="auto-login-label">{t('UploadTicketModal.agreeCheckbox')}</span>
								</label>
							</label>

							<label className="login-form-item-container">
								<Field id="name" name="name" className="login-input" placeholder={t('UploadTicketModal.name')} />
							</label>

							<label className="login-form-item-container">
								<Field type="editorName" id="editorName" name="editorName" className="login-input" placeholder={t('UploadTicketModal.editorName')} />
							</label>

							<div className="login-form-item-container">
								<button type="submit" className={clsx('retro-button login-button flex items-center justify-center gap-2', buttonAvailable ? '' : 'disabled')}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
										<path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
									</svg>
									投稿
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</Modal>
	);
};
