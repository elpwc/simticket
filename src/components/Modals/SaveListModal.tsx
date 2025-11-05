import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import clsx from 'clsx';
import { useLocale } from '@/utils/hooks/useLocale';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, saveCanvasToLocal, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { AppContext } from '@/app/app';
import { TicketViewer } from '../InfrastructureCompo/ticketViewer';
import './style.css';
import { drawTicket } from '@/utils/drawTicket';
import { useIsMobile } from '@/utils/hooks';

interface Props {
	show: boolean;
	onClose: () => void;
}

export const SAVE_IMAGE_SIZES = [
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.small', desc: '~100KB', scale: 1 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.normal', desc: '~500KB', scale: 2 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.HD', desc: '~3MB', scale: 5 },
	{ title: 'SaveImageModal.SAVE_IMAGE_SIZES.UHD', desc: '~10MB', scale: 10 },
];

const A4_SIZE = [210, 297];

export const SaveListModal = ({ show, onClose }: Props) => {
	const { t } = useLocale();
	const isMobile = useIsMobile();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [selectedTicketListItems, setSelectedTicketListItems] = useState<string[]>([]);

	const { ticketListItems, setTicketListItems }: { ticketListItems: TicketListItemProperty[]; setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>> } = useContext(AppContext);

	const draw = (canvas: HTMLCanvasElement | null) => {
		if (!canvas) {
			return;
		}

		const ctx = canvas?.getContext('2d');

		if (!ctx) {
			return;
		}
		const w = canvas?.width;
		const h = canvas?.height;

		const edge = 0.025;

		ctx.clearRect(0, 0, w, h);
		let i = 0;
		/** 绘制的票面的放大倍数（基于 CANVAS_SIZE） */
		const scale = 5;
		const tmpCanvas = document.createElement('canvas');
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 2; x++) {
				if (i >= selectedTicketListItems.length) {
					break;
				}
				const idx = i;
				const ticketId = selectedTicketListItems[idx];
				const currentTicketListItem = ticketListItems.find((ticketListItem) => ticketListItem.id === ticketId);
				if (!currentTicketListItem) {
					i++;
					continue;
				}
				const canvasSize = get_CanvasOrImageSize_Of_Ticket_By_TicketType(
					currentTicketListItem.companyId || 0,
					currentTicketListItem.ticketTypeId,
					TicketSizeType.CanvasSize,
					currentTicketListItem.ticketData.background || false
				);
				tmpCanvas.width = canvasSize[0] * scale;
				tmpCanvas.height = canvasSize[1] * scale;
				const tmpCtx = tmpCanvas.getContext('2d')!;
				tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

				drawTicket(
					tmpCanvas,
					tmpCtx,
					currentTicketListItem.companyId,
					currentTicketListItem.ticketTypeId,
					currentTicketListItem.ticketData,
					tmpCanvas.width,
					tmpCanvas.height,
					(newValue) => {},
					(newValue) => {},
					() => {
						const ticketAreaWidth = w / 2;
						const ticketAreaHeight = h / 4;
						const ticketA4SizeScale = get_CanvasOrImageSize_Of_Ticket_By_TicketType(
							currentTicketListItem.companyId || 0,
							currentTicketListItem.ticketTypeId,
							TicketSizeType.A4Size,
							currentTicketListItem.ticketData.background || false
						);
						ctx.drawImage(tmpCanvas, edge * w + ticketAreaWidth * x, edge * h + ticketAreaHeight * y, w * ticketA4SizeScale[0], h * ticketA4SizeScale[1]);
					}
				);

				i++;
			}
		}
	};

	useEffect(() => {
		draw(canvasRef.current);
	}, [show, ticketListItems, selectedTicketListItems]);

	// 下方列表中删除项目时，删除已选中item中的被删除项目
	// 解决当选中时关闭modal，又在对list操作时恰好删除了被选中的项目，打开後印刷纸内出现空白的问题
	useEffect(() => {
		setSelectedTicketListItems((prev) => prev.filter((item) => ticketListItems.map((ticketListItem) => ticketListItem.id).includes(item)));
	}, [ticketListItems]);

	// auto select
	// useEffect(() => {
	// 	setSelectedTicketListItems(ticketListItems.slice(0, 8).map((ticketListItem) => ticketListItem.id));
	// }, [show]);

	return (
		<Modal
			classname=""
			style={{ maxWidth: 'fit-content' }}
			title={t('SaveListModal.title')}
			isOpen={show}
			onClose={onClose}
			showOkButton
			okText="保存"
			showCancelButton
			onOk={() => {
				// save A4

				const tmpPrintCanvas = document.createElement('canvas');
				/** 绘制的票面的放大倍数（基于 CANVAS_SIZE） */
				const scale = 10;

				tmpPrintCanvas.width = A4_SIZE[0] * scale;
				tmpPrintCanvas.height = A4_SIZE[1] * scale;
				const tmpPrintCtx = tmpPrintCanvas.getContext('2d')!;
				tmpPrintCtx.clearRect(0, 0, tmpPrintCanvas.width, tmpPrintCanvas.height);

				draw(tmpPrintCanvas);

				setTimeout(() => {
					saveCanvasToLocal(tmpPrintCanvas, 'result', /* onSave */ () => {});
				}, 1000);
			}}
		>
			<div className={clsx('flex gap-4')} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
				<div className="flex flex-col justify-center items-center">
					<p>{t('SaveListModal.printPreview')}</p>
					<canvas ref={canvasRef} className="border-1 max-w-[300px]" width={A4_SIZE[0]} height={A4_SIZE[1]} />
				</div>
				<div>
					<p>{t('SaveListModal.selectTicketToSave')}</p>
					<div
						className="flex flex-row flex-wrap min-w-[300px] min-h-[100px] p-[1px] gap-[1px] w-full h-full overflow-y-auto"
						style={{ backgroundColor: 'gray', borderTop: 'solid 2px #444444', borderLeft: 'solid 2px #444444', borderRight: 'solid 2px #d1d1d1', borderBottom: 'solid 2px #d1d1d1' }}
					>
						{ticketListItems.length === 0 ? (
							<p className="w-full m-auto align-middle py-2 px-4 text-[16px] text-white">空</p>
						) : (
							ticketListItems.map((ticketListItem) => (
								<div
									key={ticketListItem.id}
									onClick={() => {
										if (selectedTicketListItems.includes(ticketListItem.id)) {
											setSelectedTicketListItems((prev) => prev.filter((selectedTicketListItem) => selectedTicketListItem !== ticketListItem.id));
										} else {
											setSelectedTicketListItems([...selectedTicketListItems, ticketListItem.id]);
										}
									}}
									className={clsx(
										'cursor-pointer p-1 w-fit h-fit saveListModal-ticketListItem',
										selectedTicketListItems.includes(ticketListItem.id) && 'saveListModal-ticketListItem-selected'
									)}
								>
									<TicketViewer width={100} height={70} companyId={ticketListItem.companyId} ticketTypeId={ticketListItem.ticketTypeId} ticketData={ticketListItem.ticketData} />
								</div>
							))
						)}
						{}
					</div>
				</div>
			</div>
		</Modal>
	);
};
