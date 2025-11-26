import { addLikeUploadedTicket, undoLikeUploadedTicket } from './api';

const STORAGE_KEY = 'likedTickets';

export const getLikedTickets = (): number[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
};

export const hasLiked = (id: number): boolean => {
	return getLikedTickets().includes(id);
};

export const addLiked = async (id: number) => {
	return await addLikeUploadedTicket(id).then((e) => {
		const list = getLikedTickets();
		if (!list.includes(id)) {
			list.push(id);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
		}
	});
};

export const undoLiked = async (id: number) => {
	return await undoLikeUploadedTicket(id).then((e) => {
		const list = getLikedTickets();
		const index = list.indexOf(id);
		if (index !== -1) {
			list.splice(index);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
		}
	});
};
