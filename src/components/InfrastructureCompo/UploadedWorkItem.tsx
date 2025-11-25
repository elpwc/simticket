import { UploadedTicketInfo } from '@/utils/utils';
import { TicketViewer } from './ticketViewer';
import { addLiked, hasLiked, undoLiked } from '@/utils/localStorage';
import { useEffect, useState } from 'react';

interface Props {
	uploadedTicketInfo: UploadedTicketInfo;
	onLiked: () => void;
	onUndoLiked: () => void;
}

export const UploadedWorkItem = ({ uploadedTicketInfo, onLiked, onUndoLiked }: Props) => {
	const [doHasLiked, setDoHasLiked] = useState(hasLiked(uploadedTicketInfo.id));

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
			h-fit
			m-1 
			border border-gray-200
		"
		>
			<div
				className="overflow-hidden rounded-lg cursor-pointer h-fit"
				onClick={() => {
					// open modal
				}}
			>
				<TicketViewer width={280} height={-1} companyId={uploadedTicketInfo.companyId} ticketTypeId={uploadedTicketInfo.ticketId} ticketData={uploadedTicketInfo.data} />
			</div>

			<div className="flex justify-between items-center">
				<p className="font-semibold text-sm truncate">{uploadedTicketInfo.name}</p>

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
					onClick={() => {
						if (!doHasLiked) {
							addLiked(uploadedTicketInfo.id);
							setDoHasLiked(true);
							onLiked();
						} else {
							undoLiked(uploadedTicketInfo.id);
							setDoHasLiked(false);
							onUndoLiked();
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
			</div>

			<div className="flex justify-between text-[11px] text-gray-400">
				<p className="truncate max-w-[120px]">{uploadedTicketInfo.editorName}</p>
				<p>view {uploadedTicketInfo.views}</p>
			</div>
		</div>
	);
};
