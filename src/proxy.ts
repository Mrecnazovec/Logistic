import { NextResponse, type NextRequest } from 'next/server'
import { addLocaleToPath, getLocaleFromPath, stripLocaleFromPath } from './i18n/paths'
import { defaultLocale, isLocale, type Locale } from './i18n/config'

const PUBLIC_FILE = /\.(.*)$/
const IGNORED_PATHS = ['/monitoring', '/_next', '/api']
const ACCESS_TOKEN_COOKIE = 'accessToken'

const shouldIgnorePath = (pathname: string) => {
	return IGNORED_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) || PUBLIC_FILE.test(pathname)
}

const isAuthPath = (pathname: string) => {
	return pathname === '/auth' || pathname === '/auth/register'
}

const isDashboardPath = (pathname: string) => {
	return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
}

const isPublicDashboardInvitePath = (pathname: string) => {
	return (
		pathname.startsWith('/dashboard/desk/invite/') ||
		pathname.startsWith('/dashboard/order/invite/')
	)
}

const getLocaleFromHeader = (request: NextRequest): Locale | undefined => {
	const header = request.headers.get('accept-language')
	if (!header) return undefined
	const preferences = header
		.split(',')
		.map((part) => part.split(';')[0]?.trim())
		.filter(Boolean) as string[]

	for (const preference of preferences) {
		if (isLocale(preference)) return preference
		const base = preference.split('-')[0]
		if (base && isLocale(base)) return base
	}

	return undefined
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (shouldIgnorePath(pathname)) {
		return NextResponse.next()
	}

	if (!getLocaleFromPath(pathname)) {
		const referer = request.headers.get('referer')
		const refererLocale = referer ? getLocaleFromPath(new URL(referer).pathname) : null
		const activeLocale = refererLocale ?? getLocaleFromHeader(request) ?? defaultLocale
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = addLocaleToPath(pathname, isLocale(activeLocale) ? activeLocale : defaultLocale)
		return NextResponse.redirect(redirectUrl)
	}

	const locale = getLocaleFromPath(pathname) ?? defaultLocale
	const localizedPath = stripLocaleFromPath(pathname)
	const hasAccessToken = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value)

	if (hasAccessToken && isAuthPath(localizedPath)) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = addLocaleToPath('/dashboard', locale)
		redirectUrl.search = ''
		return NextResponse.redirect(redirectUrl)
	}

	if (!hasAccessToken && isDashboardPath(localizedPath) && !isPublicDashboardInvitePath(localizedPath)) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = addLocaleToPath('/auth', locale)
		redirectUrl.search = ''
		redirectUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
		return NextResponse.redirect(redirectUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next).*)'],
}
