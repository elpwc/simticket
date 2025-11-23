export const getIP = async () => {
	return await fetch('/api/ip')
		.then((response) => response.json())
		.then((data) => {
			console.log('IP:', data);
			return data.ip;
		})
		.catch((e) => {
			console.error(e);
		});
};

export enum OrderType {
	none = '',
	views = 'views',
	like = 'like',
	createTime = 'createTime',
}

export const getUploadedTickets = async (companyId: number = -1, ticketTypeId: number = -1, orderBy: OrderType = OrderType.like, ip: string = '', limit: number = 20) => {
	const params = new URLSearchParams();
	if (companyId >= 0) params.append('companyId', String(companyId));
	if (ticketTypeId >= 0) params.append('ticketTypeId', String(ticketTypeId));
	if (orderBy !== OrderType.none) params.append('orderBy', orderBy);
	if (ip !== '') params.append('ip', ip);
	if (limit >= 0) params.append('limit', String(limit));

	return await fetch('/api/ticket' + (params.toString() ? `?${params.toString()}` : ''))
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			return data;
		})
		.catch((e) => {
			console.error(e);
		});
};

export const getUploadedTicketById = async (id: number) => {
	return await fetch('/api/ticket?ticketId=' + id.toString())
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			return data.ip;
		})
		.catch((e) => {
			console.error(e);
		});
};
