import { UploadedTicketInfo } from '@/utils/utils';
import { TicketViewer } from './ticketViewer';

interface Props {
	uploadedTicketInfo: UploadedTicketInfo;
}

export const UploadedWorkItem = ({ uploadedTicketInfo }: Props) => {
	return (
		<div
			className="
			bg-white 
			rounded-xl 
			shadow-sm 
			hover:shadow-md 
			transition 
			hover:-translate-y-[2px] 
			p-3 
			w-[260px] 
			md:w-[360px] 
			m-2 
			border border-gray-200
		"
		>
			<div className="mb-2 overflow-hidden rounded-lg">
				<TicketViewer width={360} height={-1} companyId={uploadedTicketInfo.companyId} ticketTypeId={uploadedTicketInfo.ticketId} ticketData={uploadedTicketInfo.data} />
			</div>

			<div className="flex justify-between items-center mb-1">
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
				>
					<span>{uploadedTicketInfo.like}</span>
					<span className="text-lg leading-none">♥</span>
				</button>
			</div>

			<div className="flex justify-between text-[11px] text-gray-400">
				<p className="truncate max-w-[120px]">{uploadedTicketInfo.editorName}</p>
				<p>view {uploadedTicketInfo.views}</p>
			</div>
		</div>
	);
};
