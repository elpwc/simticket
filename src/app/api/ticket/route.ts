import prisma from '@/lib/prisma';
import { decodeTicket, PublicStatus } from '@/utils/utils';
import { NextRequest } from 'next/server';

/**
 * GET
 * limit: number
 * ip: string
 * publicStatus: PublicStatus
 * ticketId: number
 * companyId: number
 * orderBy: views/like
 */
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;
	const ip = searchParams.get('ip') || undefined;
	const publicStatus = searchParams.get('publicStatus');
	const ticketId = searchParams.get('ticketId');
	const companyId = searchParams.get('companyId');
	const orderBy = searchParams.get('orderBy'); // views | like
	const asc = searchParams.get('asc') === 'asc' ? 'asc' : 'desc'; // asc | desc
	const page = searchParams.get('page') ? Math.max(Number(searchParams.get('page')), 0) : 0;
	const from = searchParams.get('from');
	const to = searchParams.get('to');
	const search = searchParams.get('search');

	const skip = page * limit;

	let tickets = await prisma.ticket.findMany({
		where: {
			deleted: false,
			...(ip ? { ip } : {}),
			...(publicStatus !== null ? { publicStatus: Number(publicStatus) as PublicStatus } : {}),
			...(ticketId ? { id: Number(ticketId) } : {}),
			...(companyId ? { companyId: Number(companyId) } : {}),
			...(from ? { from: from } : {}),
			...(to ? { to: to } : {}),
		},
		orderBy: orderBy === 'views' ? { views: asc } : orderBy === 'like' ? { like: asc } : { createdAt: asc },
		skip,
		take: limit,

		select: {
			id: true,
			name: true,
			companyId: true,
			ticketId: true,
			data: true,
			editorName: true,
			like: true,
			views: true,
			createdAt: true,
		},
	});

	tickets = tickets
		.filter((item) => {
			if (search && search !== '') {
				const bytes = new TextEncoder().encode(search || '');
				const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
				const b64 = Buffer.from(binary, 'binary').toString('base64');
				return item.data.includes(b64);
			} else {
				return true;
			}
		})
		.map((item) => ({
			...item,
			data: decodeTicket(item.companyId, item.ticketId, item.data),
		}));

	return Response.json(tickets);
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
