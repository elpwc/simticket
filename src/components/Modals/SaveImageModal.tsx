import { useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import Toggle from '../InfrastructureCompo/Toggle';
import TabBox from '../InfrastructureCompo/TabBox';
import clsx from 'clsx';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	show: boolean;
	defaultCanvasSize: [number, number];
	onClose: () => void;
	onSave: (scale: number, title: string) => void;
}

export const SAVE_IMAGE_SIZES = [
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.small', desc: '~100KB', scale: 1 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.normal', desc: '~500KB', scale: 2 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.HD', desc: '~3MB', scale: 5 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.UHD', desc: '~10MB', scale: 10 },
];

export const SaveImageModal = ({ show, defaultCanvasSize, onClose, onSave }: Props) => {
	const { t } = useLocale();
	const [width, setWidth] = useState(defaultCanvasSize[0]);
	const [height, setHeight] = useState(defaultCanvasSize[1]);
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
								onSave(SAVE_IMAGE_SIZE.scale, SAVE_IMAGE_SIZE.title);
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
						onSave(width / defaultCanvasSize[0], t('SaveImageModal.customizeSizeTab.buttonTitle'));
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
