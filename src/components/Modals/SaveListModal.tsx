import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import clsx from 'clsx';
import { useLocale } from '@/utils/hooks/useLocale';
import { get_CanvasOrImageSize_Of_Ticket_By_TicketType, saveCanvasToLocal, TicketListItemProperty, TicketSizeType } from '@/utils/utils';
import { AppContext } from '@/app/app';
import { TicketViewer } from '../InfrastructureCompo/ticketViewer';
import { drawTicket } from '@/utils/drawTicket';
import { useIsMobile } from '@/utils/hooks';

interface Props {
	show: boolean;
	onClose: () => void;
}

const A4_SIZE = [210, 297];

export const SaveListModal = ({ show, onClose }: Props) => {
	const { t } = useLocale();
	const isMobile = useIsMobile();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const flipCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const [selectedTicketListItems, setSelectedTicketListItems] = useState<string[]>([]);

	const {
		ticketListItems,
		setTicketListItems,
	}: {
		ticketListItems: TicketListItemProperty[];
		setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>>;
	} = useContext(AppContext);

	const draw = (canvas: HTMLCanvasElement | null, isFlip: boolean) => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const w = canvas.width;
		const h = canvas.height;
		const edge = 0.025;
		ctx.clearRect(0, 0, w, h);

		let i = 0;
		/** 绘制的票面的放大倍数（基于 CANVAS_SIZE） */
		const scale = 5;
		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 2; x++) {
				if (i >= selectedTicketListItems.length) break;
				const ticketId = selectedTicketListItems[i];
				const currentTicketListItem = ticketListItems.find((t) => t.id === ticketId);
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

				const tmpCanvas = document.createElement('canvas');
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
					() => {},
					() => {},
					isFlip,
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
		draw(canvasRef.current, false);
		draw(flipCanvasRef.current, true);
	}, [show, ticketListItems, selectedTicketListItems]);

	// 下方列表中删除项目时，删除已选中item中的被删除项目
	// 解决当选中时关闭modal，又在对list操作时恰好删除了被选中的项目，打开後印刷纸内出现空白的问题
	useEffect(() => {
		setSelectedTicketListItems((prev) => prev.filter((id) => ticketListItems.some((item) => item.id === id)));
	}, [ticketListItems]);

	// auto select
	// useEffect(() => {
	// 	setSelectedTicketListItems(ticketListItems.slice(0, 8).map((ticketListItem) => ticketListItem.id));
	// }, [show]);

	return (
		<Modal classname="" style={{ maxWidth: 'fit-content' }} title={t('SaveListModal.title')} isOpen={show} onClose={onClose}>
			<div className={clsx('flex gap-6 justify-center items-start p-4', isMobile ? 'flex-col' : 'flex-col')}>
				<div className="flex w-full flex-wrap gap-5 justify-around items-center bg-gray-50 rounded-lg shadow-inner p-4 min-w-[320px]">
					<div>
						<span className="font-semibold text-gray-700 mb-2">{t('SaveListModal.printPreview')}</span>
						<canvas ref={canvasRef} className="border border-gray-400 bg-white max-w-[280px]" width={A4_SIZE[0]} height={A4_SIZE[1]} />
					</div>
					<div>
						<span className="font-semibold text-gray-700 mt-4 mb-2">{t('SaveListModal.printPreviewFlip')}</span>
						<canvas ref={flipCanvasRef} className="border border-gray-400 bg-white max-w-[280px]" width={A4_SIZE[0]} height={A4_SIZE[1]} />
					</div>
				</div>

				<div className="flex flex-col w-full items-start bg-gray-50 rounded-lg shadow-inner p-4 min-w-[320px] max-h-[480px]">
					<span className="font-semibold text-gray-700 mb-2">{t('SaveListModal.selectTicketToSave')}</span>
					<div className="flex flex-wrap gap-1 p-2 w-full min-h-[120px] border border-gray-300 rounded-md bg-gray-100 overflow-y-auto">
						{ticketListItems.length === 0 ? (
							<p className="w-full text-center text-gray-500 py-6 text-[16px]">空</p>
						) : (
							ticketListItems.map((ticket) => (
								<div
									key={ticket.id}
									onClick={() => setSelectedTicketListItems((prev) => (prev.includes(ticket.id) ? prev.filter((id) => id !== ticket.id) : [...prev, ticket.id]))}
									className={clsx(
										'cursor-pointer p-[2px] border-2 rounded-md transition-all duration-150 bg-white hover:bg-gray-200',
										selectedTicketListItems.includes(ticket.id) ? 'border-blue-500 bg-blue-100' : 'border-transparent'
									)}
								>
									<TicketViewer width={100} height={70} companyId={ticket.companyId} ticketTypeId={ticket.ticketTypeId} ticketData={ticket.ticketData} />
								</div>
							))
						)}
					</div>
				</div>
			</div>

			<div className="flex justify-end gap-3 border-t border-gray-300 pt-3 mt-3">
				<button
					onClick={() => {
						// save A4
						// front
						const tmpCanvas = document.createElement('canvas');
						tmpCanvas.width = A4_SIZE[0] * 10;
						tmpCanvas.height = A4_SIZE[1] * 10;
						draw(tmpCanvas, false);
						setTimeout(() => saveCanvasToLocal(tmpCanvas, 'result', /* onSave */ () => {}), 1000);
					}}
					className="large primary"
				>
					{t('SaveListModal.saveFront')}
				</button>

				<button
					onClick={() => {
						// save A4
						// flip
						const tmpCanvas = document.createElement('canvas');
						tmpCanvas.width = A4_SIZE[0] * 10;
						tmpCanvas.height = A4_SIZE[1] * 10;
						draw(tmpCanvas, true);
						setTimeout(() => saveCanvasToLocal(tmpCanvas, 'result_flip', /* onSave */ () => {}), 1000);
					}}
					className="large primary"
				>
					{t('SaveListModal.saveFlipside')}
				</button>

				<button onClick={onClose} className="large alert">
					{t('SaveListModal.close')}
				</button>
			</div>
		</Modal>
	);
};
