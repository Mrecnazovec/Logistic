import { NextResponse, type NextRequest } from 'next/server'
import { DASHBOARD_URL, PUBLIC_URL } from './config/url.config'
import { Tokens } from './services/auth/auth-token.service'

export async function proxy(request: NextRequest) {
	const accessToken = request.cookies.get(Tokens.ACCESS_TOKEN)?.value
	const { pathname } = request.nextUrl

	const isAuthPage = pathname.startsWith('/auth')
	const isDashboard = pathname.startsWith('/dashboard')

	if (isAuthPage && accessToken) {
		return NextResponse.redirect(new URL(DASHBOARD_URL.home(), request.url))
	}

	if (isDashboard && !accessToken) {
		return NextResponse.redirect(new URL(PUBLIC_URL.auth(), request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/auth/:path*'],
}
