export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
	const forwarded = req.headers.get('x-forwarded-for');
	const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';

	//console.log(ip);
	return Response.json({ ip });
}
