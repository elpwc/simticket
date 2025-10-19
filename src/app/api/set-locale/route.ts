// app/api/set-locale/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const locale = searchParams.get('locale') || 'zh';

	const res = NextResponse.redirect(new URL('/', req.url)); 
	res.cookies.set('locale', locale, {
		path: '/',
		maxAge: 60 * 60 * 24 * 30, // 30 天
	});
	return res;
}
