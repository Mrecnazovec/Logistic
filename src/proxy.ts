import { NextResponse, type NextRequest } from 'next/server'
import { DASHBOARD_URL, PUBLIC_URL } from './config/url.config'
import { addLocaleToPath, getLocaleFromPath, stripLocaleFromPath } from './i18n/paths'
import { defaultLocale, localeCookie, locales, type Locale } from './i18n/config'
import { Tokens } from './services/auth/auth-token.service'

const PUBLIC_FILE = /\.(.*)$/

const getLocaleFromHeader = (request: NextRequest): Locale | undefined => {
	const header = request.headers.get('accept-language')
	if (!header) return undefined
	const preferences = header
		.split(',')
		.map((part) => part.split(';')[0]?.trim())
		.filter(Boolean) as string[]

	for (const preference of preferences) {
		if (locales.includes(preference as Locale)) {
			return preference as Locale
		}
		const base = preference.split('-')[0]
		if (locales.includes(base as Locale)) {
			return base as Locale
		}
	}

	return undefined
}

export async function proxy(request: NextRequest) {
	const accessToken = request.cookies.get(Tokens.ACCESS_TOKEN)?.value
	const { pathname } = request.nextUrl

	if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
		return NextResponse.next()
	}

	const pathnameLocale = getLocaleFromPath(pathname) ?? undefined
	const cookieLocale = request.cookies.get(localeCookie)?.value as Locale | undefined
	const preferredLocale =
		(pathnameLocale as Locale | undefined) ??
		(locales.includes(cookieLocale as Locale) ? cookieLocale : undefined) ??
		getLocaleFromHeader(request) ??
		defaultLocale
	const activeLocale = preferredLocale ?? defaultLocale
	const normalizedPath = stripLocaleFromPath(pathname)
	const requestHeaders = new Headers(request.headers)
	requestHeaders.set('x-locale', activeLocale)

	const isAuthPage = normalizedPath.startsWith('/auth')
	const isDashboard = normalizedPath.startsWith('/dashboard')

	if (isAuthPage && accessToken) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = addLocaleToPath(DASHBOARD_URL.home(), activeLocale)
		const response = NextResponse.redirect(redirectUrl)
		response.cookies.set(localeCookie, activeLocale, { path: '/' })
		return response
	}

	if (isDashboard && !accessToken) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = addLocaleToPath(PUBLIC_URL.auth(), activeLocale)
		const response = NextResponse.redirect(redirectUrl)
		response.cookies.set(localeCookie, activeLocale, { path: '/' })
		return response
	}

	if (pathnameLocale === defaultLocale) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = normalizedPath
		const response = NextResponse.redirect(redirectUrl)
		response.cookies.set(localeCookie, activeLocale, { path: '/' })
		return response
	}

	if (!pathnameLocale && activeLocale !== defaultLocale) {
		const redirectUrl = request.nextUrl.clone()
		redirectUrl.pathname = addLocaleToPath(pathname, activeLocale)
		const response = NextResponse.redirect(redirectUrl)
		response.cookies.set(localeCookie, activeLocale, { path: '/' })
		return response
	}

	if (pathnameLocale && pathnameLocale !== defaultLocale) {
		const rewriteUrl = request.nextUrl.clone()
		rewriteUrl.pathname = normalizedPath
		const response = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
		response.cookies.set(localeCookie, activeLocale, { path: '/' })
		return response
	}

	const response = NextResponse.next({ request: { headers: requestHeaders } })
	response.cookies.set(localeCookie, activeLocale, { path: '/' })
	return response
}

export const config = {
	matcher: ['/((?!_next).*)'],
}
