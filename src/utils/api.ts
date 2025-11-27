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

export const getUploadedTickets = async (
	companyId: number = -1,
	ticketTypeId: number = -1,
	orderBy: OrderType = OrderType.like,
	ip: string = '',
	limit: number = 20,
	asc: boolean = false,
	page: number = 0
) => {
	const params = new URLSearchParams();
	if (companyId >= 0) params.append('companyId', String(companyId));
	if (ticketTypeId >= 0) params.append('ticketId', String(ticketTypeId));
	if (orderBy !== OrderType.none) params.append('orderBy', orderBy);
	if (ip !== '') params.append('ip', ip);
	if (limit >= 0) params.append('limit', String(limit));
	if (asc) params.append('asc', asc ? 'asc' : 'desc');
	if (page) params.append('page', page.toString());

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

export const addLikeUploadedTicket = async (id: number) => {
	return await fetch(`/api/ticket/${id}/like`, {
		method: 'POST',
	});
};
export const undoLikeUploadedTicket = async (id: number) => {
	return await fetch(`/api/ticket/${id}/undolike`, {
		method: 'POST',
	});
};

export const addViewsUploadedTicket = async (id: number) => {
	return await fetch(`/api/ticket/${id}/views`, {
		method: 'POST',
	});
};
