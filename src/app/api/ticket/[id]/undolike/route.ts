import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
	try {
		const { id } = await context.params;
		const numericId = Number(id);
		if (!numericId) {
			return Response.json({ error: 'Invalid id' }, { status: 400 });
		}

		const ticket = await prisma.ticket.findUnique({
			where: { id: numericId },
		});

		if (!ticket) {
			return Response.json({ error: 'Ticket not found' }, { status: 404 });
		}

		const updated = await prisma.ticket.update({
			where: { id: numericId },
			data: {
				like: ticket.like > 0 ? ticket.like - 1 : 0,
			},
		});

		return Response.json(updated, { status: 200 });
	} catch (err: any) {
		console.error(err);
		return Response.json(
			{
				error: 'Internal Server Error',
				detail: err?.message,
			},
			{ status: 500 }
		);
	}
}
