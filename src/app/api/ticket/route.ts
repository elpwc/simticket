import prisma from '@/lib/prisma';
import { decodeTicket, PublicStatus } from '@/utils/utils';
import { NextRequest } from 'next/server';
import { Prisma } from '@/generated/prisma/client';

/**
 * GET
 * limit: number
 * ip: string
 * publicStatus: PublicStatus
 * id: number (primary key, single record lookup)
 * ticketTypeId: number (ticket type filter, maps to schema ticketId)
 * companyId: number
 * orderBy: views/like/createTime
 */
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;
	const ip = searchParams.get('ip') || undefined;
	const publicStatus = searchParams.get('publicStatus');
	const id = searchParams.get('id');
	const ticketTypeId = searchParams.get('ticketTypeId');
	const companyId = searchParams.get('companyId');
	const orderBy = searchParams.get('orderBy'); // views | like
	const ascOrder = searchParams.get('asc') === 'asc' ? ('asc' as const) : ('desc' as const);
	const page = searchParams.get('page') ? Math.max(Number(searchParams.get('page')), 0) : 0;
	const from = searchParams.get('from');
	const to = searchParams.get('to');
	const search = searchParams.get('search');

	const skip = page * limit;

	const orderByClause =
		orderBy === 'views' ? { views: ascOrder } : orderBy === 'like' ? { like: ascOrder } : { createdAt: ascOrder };

	const baseWhere: Prisma.ticketWhereInput = {
		deleted: false,
		...(ip ? { ip } : {}),
		...(publicStatus !== null && publicStatus !== '' ? { publicStatus: Number(publicStatus) as PublicStatus } : {}),
		...(id ? { id: Number(id) } : {}),
		...(ticketTypeId !== null && ticketTypeId !== '' ? { ticketId: Number(ticketTypeId) } : {}),
		...(companyId !== null && companyId !== '' ? { companyId: Number(companyId) } : {}),
		...(from ? { from } : {}),
		...(to ? { to } : {}),
	};

	const select = {
		id: true,
		name: true,
		companyId: true,
		ticketId: true,
		data: true,
		editorName: true,
		like: true,
		views: true,
		createdAt: true,
		from: true,
		to: true,
	} as const;

	type TicketRow = {
		id: number;
		name: string;
		companyId: number;
		ticketId: number;
		data: string;
		editorName: string;
		like: number;
		views: number;
		createdAt: Date;
		from: string;
		to: string;
	};

	const matchesSearch = (item: TicketRow, term: string): boolean => {
		if (item.name.includes(term) || item.editorName.includes(term) || item.from?.includes(term) || item.to?.includes(term)) {
			return true;
		}
		const bytes = new TextEncoder().encode(term);
		const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
		const b64 = Buffer.from(binary, 'binary').toString('base64');
		return item.data.includes(b64);
	};

	const mapTickets = (rows: TicketRow[]) =>
		rows.map((item) => ({
			...item,
			data: decodeTicket(item.companyId, item.ticketId, item.data),
		}));

	// Search requires in-memory filter (encoded data); loop DB batches to fill page
	if (search && search !== '') {
		const collected: TicketRow[] = [];
		let dbSkip = 0;
		const batchSize = limit * 3;
		const maxIterations = 30;
		let dbExhausted = false;

		for (let i = 0; i < maxIterations && collected.length < skip + limit; i++) {
			const batch = await prisma.ticket.findMany({
				where: baseWhere,
				orderBy: orderByClause,
				skip: dbSkip,
				take: batchSize,
				select,
			});

			if (batch.length === 0) {
				dbExhausted = true;
				break;
			}

			for (const item of batch) {
				if (matchesSearch(item, search)) {
					collected.push(item);
				}
			}

			dbSkip += batch.length;
			if (batch.length < batchSize) {
				dbExhausted = true;
				break;
			}
		}

		const pageItems = collected.slice(skip, skip + limit);
		const hasMore = !dbExhausted || collected.length > skip + limit;

		return Response.json({
			items: mapTickets(pageItems),
			hasMore,
		});
	}

	// No search: standard pagination
	const tickets = await prisma.ticket.findMany({
		where: baseWhere,
		orderBy: orderByClause,
		skip,
		take: limit,
		select,
	});

	return Response.json({
		items: mapTickets(tickets),
		hasMore: tickets.length >= limit,
	});
}

/**
 * POST
 * body:
 * name, companyId, ticketId, data, ip, editorName?
 */
export async function POST(req: NextRequest) {
	const body = await req.json();

	const createData: any = {
		name: body.name,
		companyId: body.companyId,
		ticketId: body.ticketId,
		data: body.data,
		ip: body.ip,
		editorName: body.editorName ?? '',
		publicStatus: body.publicStatus ?? PublicStatus.WaitForChecking,
		from: body.from,
		to: body.to,
	};

	const newTicket = await prisma.ticket.create({
		data: createData,
	});

	return Response.json(newTicket);
}

/**
 * PATCH
 * body.id
 */
export async function PATCH(req: NextRequest) {
	const body = await req.json();

	if (!body.id) {
		return new Response('Missing id', { status: 400 });
	}

	const updated = await prisma.ticket.update({
		where: { id: body.id },
		data: {
			...(body.name !== undefined ? { name: body.name } : {}),
			...(body.data !== undefined ? { data: body.data } : {}),
			...(body.publicStatus !== undefined ? { publicStatus: body.publicStatus } : {}),
			...(body.views !== undefined ? { views: body.views } : {}),
			...(body.like !== undefined ? { like: body.like } : {}),
			...(body.deleted !== undefined ? { deleted: body.deleted } : {}),
		},
	});

	return Response.json(updated);
}

/**
 * DELETE
 * body.id
 */
export async function DELETE(req: NextRequest) {
	const body = await req.json();

	if (!body.id) {
		return new Response('Missing id', { status: 400 });
	}

	const deleted = await prisma.ticket.update({
		where: { id: body.id },
		data: { deleted: true },
	});

	return Response.json(deleted);
}
