'use client';

import { UploadedWorkItem } from '@/components/InfrastructureCompo/UploadedWorkItem';
import { getUploadedTickets, OrderType } from '@/utils/api';
import { useLocale } from '@/utils/hooks/useLocale';
import { UploadedTicketInfo } from '@/utils/utils';
import { useEffect, useState } from 'react';
import './style.css';

export default function Works() {
	const { t, locale } = useLocale();

	const [orderBy, setOrderBy] = useState<OrderType>(OrderType.createTime);
	const [asc, setAsc] = useState<boolean>(false);
	const [companyId, setCompanyId] = useState<number>(-1);
	const [ticketId, setTicketId] = useState<number>(-1);
	const [startStation, setStartStation] = useState<string>('');
	const [endStation, setEndStation] = useState<string>('');
	const [anyText, setAnyText] = useState<string>('');

	const [works, setWorks] = useState<UploadedTicketInfo[]>([]);

	const load = () => {
		getUploadedTickets(companyId, ticketId, orderBy, '', 10, asc).then((e) => {
			setWorks(e);
		});
	};

	useEffect(() => {
		load();
	}, [orderBy, asc, companyId, ticketId]);

	return (
		<div className="p-4 md:p-8 max-w-screen-xl mx-auto">
			<div className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-6">
				<div className="flex flex-wrap gap-4 mb-4">
					<div className="flex flex-col w-full md:w-auto">
						<p className="w-max">公司</p>
						<input value={companyId} onChange={(e) => setCompanyId(Number(e.target.value))} className="menu-input" placeholder="companyId" />
					</div>

					<div className="flex flex-col w-full md:w-auto">
						<p className="w-max">票种</p>
						<input value={ticketId} onChange={(e) => setTicketId(Number(e.target.value))} className="menu-input" placeholder="ticketId" />
					</div>

					<div className="flex flex-col w-full md:w-auto">
						<p className="w-max">出发</p>
						<input value={startStation} onChange={(e) => setStartStation(e.target.value)} className="menu-input" placeholder="from" />
					</div>

					<div className="flex flex-col w-full md:w-auto">
						<p className="w-max">到达</p>
						<input value={endStation} onChange={(e) => setEndStation(e.target.value)} className="menu-input" placeholder="to" />
					</div>
					<div className="flex flex-col w-full md:w-auto">
						<p className="w-max">搜索</p>
						<input value={anyText} onChange={(e) => setAnyText(e.target.value)} className="menu-input" placeholder="any text" />
					</div>
				</div>

				{/*  ORDER */}
				<div className="flex flex-wrap items-center gap-4 mb-4">
					<label className="text-sm text-gray-600">order by</label>

					<select value={orderBy} onChange={(e) => setOrderBy(e.target.value as OrderType)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition">
						<option value={OrderType.none}>不排序</option>
						<option value={OrderType.createTime}>最新</option>
						<option value={OrderType.like}>like</option>
						<option value={OrderType.views}>浏览量</option>
					</select>

					<div className="flex gap-2">
						<button
							onClick={() => setAsc(true)}
							className={`px-3 py-2 rounded-lg border transition hover:bg-gray-100 active:scale-95 
								${asc ? 'bg-blue-200 border-blue-400' : ''}
							`}
						>
							↑ 升序
						</button>
						<button
							onClick={() => setAsc(false)}
							className={`px-3 py-2 rounded-lg border transition hover:bg-gray-100 active:scale-95
								${!asc ? 'bg-blue-200 border-blue-400' : ''}
							`}
						>
							↓ 降序
						</button>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 mt-4">
					<button onClick={load} className="px-5 py-2 rounded-xl bg-blue-500 text-white shadow hover:bg-blue-600 active:scale-95 transition">
						应用筛选
					</button>

					<button
						onClick={() => {
							setCompanyId(-1);
							setTicketId(-1);
							setStartStation('');
							setEndStation('');
							setOrderBy(OrderType.createTime);
							setAsc(false);
							load();
						}}
						className="px-5 py-2 rounded-xl bg-gray-200 shadow hover:bg-gray-300 active:scale-95 transition"
					>
						重置
					</button>
				</div>
			</div>

			<div>
				<div className="flex flex-wrap gap-4 justify-start">
					{works.map((work: UploadedTicketInfo) => {
						return (
							<UploadedWorkItem
								key={work.id}
								uploadedTicketInfo={work}
								onLiked={() => {
									setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like + 1 } : item)));
								}}
								onUndoLiked={() => {
									setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, like: item.like > 0 ? item.like - 1 : 0 } : item)));
								}}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
