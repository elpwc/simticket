import { TicketListItemProperty, UploadedTicketInfo } from '@/utils/utils';
import { TicketViewer } from './ticketViewer';
import { addLiked, hasLiked, undoLiked } from '@/utils/localStorage';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { AppContext } from '@/app/app';
import { CRWideTicketDrawParameters } from '../TicketEditors/CRWideTicket/type';
import { JRWideTicketDrawParameters } from '../TicketEditors/JRWideTicket/type';

interface Props {
	uploadedTicketInfo: UploadedTicketInfo;
	onLiked: () => void;
	onUndoLiked: () => void;
}

export const UploadedWorkItem = ({ uploadedTicketInfo, onLiked, onUndoLiked }: Props) => {
	const [doHasLiked, setDoHasLiked] = useState(hasLiked(uploadedTicketInfo.id));
	const [isLikeDisabled, setIsLikeDisabled] = useState(false);

	const {
		ticketListItems,
		setTicketListItems,
	}: {
		ticketListItems: TicketListItemProperty[];
		setTicketListItems: Dispatch<SetStateAction<TicketListItemProperty[]>>;
	} = useContext(AppContext);

	useEffect(() => {
		setTimeout(() => {
			setDoHasLiked(hasLiked(uploadedTicketInfo.id));
		}, 100);
	}, [uploadedTicketInfo.like]);

	const handleAddToList = () => {
		setTicketListItems((prev: TicketListItemProperty[]) => [
			...prev,
			{
				id: crypto.randomUUID(),
				companyId: uploadedTicketInfo.companyId,
				ticketTypeId: uploadedTicketInfo.ticketId,
				ticketData: structuredClone(uploadedTicketInfo.data) as CRWideTicketDrawParameters | JRWideTicketDrawParameters,
			},
		]);
	};

	return (
		<div
			className="
			bg-white 
			rounded-[6px] 
			shadow-sm 
			hover:shadow-md 
			transition 
			hover:-translate-y-[2px] 
			p-2 
			pb-0
			w-fit 
			md:w-fit 
			h-[initial]
			m-1 
			border border-gray-200
		"
		>
			<div className="overflow-hidden rounded-lg cursor-pointer h-fit" onClick={handleAddToList}>
				<TicketViewer width={280} height={-1} companyId={uploadedTicketInfo.companyId} ticketTypeId={uploadedTicketInfo.ticketId} ticketData={uploadedTicketInfo.data} />
			</div>

			<div className="flex justify-between items-center">
				<p className="font-semibold text-sm truncate">{uploadedTicketInfo.name}</p>

				<div className="flex">
					<button
						className="
					border-0
						flex items-center gap-1 
						text-gray-600 
						hover:text-red-500 
						transition 
						active:scale-90 
						cursor-pointer
					"
						onClick={async () => {
							if (!isLikeDisabled) {
								if (!doHasLiked) {
									setIsLikeDisabled(true);
									addLiked(uploadedTicketInfo.id)
										.then((e) => {
											setDoHasLiked(true);
											onLiked();
										})
										.finally(() => {
											setIsLikeDisabled(false);
										});
								} else {
									setIsLikeDisabled(true);
									undoLiked(uploadedTicketInfo.id)
										.then((e) => {
											setDoHasLiked(false);
											onUndoLiked();
										})
										.finally(() => {
											setIsLikeDisabled(false);
										});
								}
							}
						}}
						style={{
							color: doHasLiked ? '#fb2c36' : '#4a5565',
						}}
					>
						<span>{uploadedTicketInfo.like > 0 ? uploadedTicketInfo.like : '　'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
						</svg>
					</button>
					<button
						className="
						border-0
						flex items-center
						text-gray-600 
						hover:text-[#009688] 
						transition 
						active:scale-90 
						cursor-pointer
					"
						onClick={handleAddToList}
						style={{ margin: '2px 0', padding: '2px 2px' }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
						</svg>
						追加
					</button>
				</div>
			</div>

			<div className="flex justify-between text-[11px] text-gray-400">
				<p className="truncate max-w-[120px]">{uploadedTicketInfo.editorName}</p>
				<p>view {uploadedTicketInfo.views}</p>
			</div>
		</div>
	);
};
