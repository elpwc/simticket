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

interface Props {
	show: boolean;
	ticketInfo: TicketListItemProperty;
	onClose: () => void;
}

export const UploadTicketModal = ({ show, ticketInfo, onClose }: Props) => {
	const { t } = useLocale();

	const defaultValues = {
		name: '',
		editorName: '',
	};

	const [isAgree, setIsAgree]: [boolean, any] = useState(false);
	const [buttonAvailable, setbuttonAvailable]: [boolean, any] = useState(false);
	const [initialValues, setinitialValues]: [any, any] = useState(defaultValues);

	useEffect(() => {
		setbuttonAvailable(isAgree);
	}, [isAgree]);

	const handleUpload = async (values: typeof defaultValues) => {
		await fetch('/api/ticket', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: values.name,
				editorName: values.editorName,
				companyId: ticketInfo.companyId,
				ticketId: ticketInfo.ticketTypeId,
				data: encodeTicket(ticketInfo.companyId, ticketInfo.ticketTypeId, ticketInfo.ticketData),
				ip: await getIP(),
			}),
		})
			.then((e) => {
				console.log(e);
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setbuttonAvailable(true);
			});
	};

	return (
		<Modal title={t('UploadTicketModal.title')} isOpen={show} onClose={onClose}>
			<div className="flex flex-col"></div>
			<div>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					onSubmit={async (values, { resetForm }) => {
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
								<span>
									{t('UploadTicketModal.tips.tip2')}
									<DescriptionButton title="为什么？">为什么</DescriptionButton>
								</span>
								<span>
									{t('UploadTicketModal.tips.tip3')}
									<DescriptionButton title="为什么？">为什么</DescriptionButton>
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
								<button type="submit" className={clsx('retro-button login-button', buttonAvailable ? '' : 'disabled')}>
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
