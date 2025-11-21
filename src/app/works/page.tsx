'use client';

import { UploadedWorkItem } from '@/components/InfrastructureCompo/UploadedWorkItem';
import { useLocale } from '@/utils/hooks/useLocale';
import { useState } from 'react';

export default function Works() {
	const { t, locale } = useLocale();

	const [works, setWorks] = useState([]);

	return (
		<>
			<div>works</div>

			<input />
			<button>search</button>
			<div>
				<p>xxx 的搜索结果：</p>
				<a>返回</a>
			</div>
			<div>
				filter
				<select defaultValue="asd">
					<option value="asd">companyId</option>
				</select>
				<select defaultValue="asd">
					<option value="asd">ticketId</option>
				</select>
				<div>
					order by
					<select defaultValue="asd">
						<option value="asd">name</option>
						<option value="asd">like</option>
						<option value="asd">view</option>
					</select>
				</div>
				<div>
					<button>↑</button>
					<button>↓</button>
				</div>
			</div>

			<div>
				ticket view list
				<UploadedWorkItem />
				<UploadedWorkItem />
				<UploadedWorkItem />
				<UploadedWorkItem />
			</div>
		</>
	);
}
