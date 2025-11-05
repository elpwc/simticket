import { useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import TabBox from '../InfrastructureCompo/TabBox';
import clsx from 'clsx';
import { useLocale } from '@/utils/hooks/useLocale';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, saveCanvasToLocal, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { drawTicket } from '@/utils/drawTicket';

interface Props {
	show: boolean;
	ticketInfo: TicketListItemProperty;
	saveFilename: string;
	defaultCanvasSize: [number, number];
	onClose: () => void;
	onSaved?: () => void;
}

export const SAVE_IMAGE_SIZES = [
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.small', desc: '~100KB', scale: 1 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.normal', desc: '~500KB', scale: 2 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.HD', desc: '~3MB', scale: 5 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.UHD', desc: '~10MB', scale: 10 },
];

export const SaveImageModal = ({ show, ticketInfo, saveFilename, defaultCanvasSize, onClose, onSaved }: Props) => {
	const { t } = useLocale();
	const [width, setWidth] = useState(defaultCanvasSize[0]);
	const [height, setHeight] = useState(defaultCanvasSize[1]);

	const handleSave = (scale: number, title: string) => {
		const tmpCanvas = document.createElement('canvas');

		const canvasSize = get_CanvasOrImageSize_Of_Ticket_By_TicketType(ticketInfo.companyId || 0, ticketInfo.ticketTypeId, TicketSizeType.CanvasSize, ticketInfo.ticketData.background || false);
		tmpCanvas.width = canvasSize[0] * scale;
		tmpCanvas.height = canvasSize[1] * scale;
		const tmpCtx = tmpCanvas.getContext('2d')!;
		tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

		drawTicket(
			tmpCanvas,
			tmpCtx,
			ticketInfo.companyId,
			ticketInfo.ticketTypeId,
			ticketInfo.ticketData,
			tmpCanvas.width,
			tmpCanvas.height,
			(newValue) => {},
			(newValue) => {},
			() => {
				saveCanvasToLocal(tmpCanvas, saveFilename + '_' + title, /* onSave */ () => {});
				onSaved?.();
			}
		);
	};

	return (
		<Modal title={t('SaveImageModal.title')} isOpen={show} onClose={onClose}>
			<div className="flex flex-col">
				{SAVE_IMAGE_SIZES.map((SAVE_IMAGE_SIZE) => {
					return (
						<button
							key={SAVE_IMAGE_SIZE.title}
							className="flex justify-between"
							style={{ padding: '10px 10px' }}
							onClick={() => {
								handleSave(SAVE_IMAGE_SIZE.scale, SAVE_IMAGE_SIZE.title);
							}}
						>
							<span>{t(SAVE_IMAGE_SIZE.title)}</span>
							<span>{`${SAVE_IMAGE_SIZE.scale * defaultCanvasSize[0]} × ${SAVE_IMAGE_SIZE.scale * defaultCanvasSize[1]}`}</span>
							<span>{SAVE_IMAGE_SIZE.desc}</span>
						</button>
					);
				})}
			</div>
			<TabBox styleOuter={{ marginTop: '20px' }} title={t('SaveImageModal.customizeSizeTab.title')}>
				<div className="flex gap-2">
					<span>
						{t('SaveImageModal.customizeSizeTab.widthText')}
						<input
							value={width}
							style={{ width: '80px' }}
							onChange={(e) => {
								let num = Number(e.target.value);
								if (Number.isNaN(num)) {
									num = defaultCanvasSize[0];
								}
								setWidth(num);
								setHeight(Math.round((defaultCanvasSize[1] / defaultCanvasSize[0]) * num));
							}}
						/>
						px
					</span>
					<span>
						{t('SaveImageModal.customizeSizeTab.heightText')}
						<input
							value={height}
							style={{ width: '80px' }}
							onChange={(e) => {
								let num = Number(e.target.value);
								if (Number.isNaN(num)) {
									num = defaultCanvasSize[1];
								}
								setHeight(num);
								setWidth(Math.round((defaultCanvasSize[0] / defaultCanvasSize[1]) * num));
							}}
						/>
						px
					</span>
				</div>
				<button
					key={'自定义'}
					className={clsx('flex justify-between w-full', !Number.isNaN(width) && !Number.isNaN(height) && width > 0 && height > 0 ? '' : 'disabled')}
					style={{ padding: '10px 10px', marginTop: '12px' }}
					onClick={() => {
						handleSave(width / defaultCanvasSize[0], t('SaveImageModal.customizeSizeTab.buttonTitle'));
					}}
				>
					<span>{t('SaveImageModal.customizeSizeTab.buttonTitle')}</span>
					<span>{`${width} × ${height}`}</span>
					<span>{}</span>
				</button>
			</TabBox>
		</Modal>
	);
};
