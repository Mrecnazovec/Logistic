import { defaultLocale, locales, type Locale } from './config'

const normalizePath = (pathname: string) => {
	if (!pathname) return '/'
	if (pathname === '/') return '/'
	return pathname.startsWith('/') ? pathname.replace(/\/+$/, '') : `/${pathname.replace(/\/+$/, '')}`
}

export const getLocaleFromPath = (pathname: string): Locale | null => {
	const normalized = normalizePath(pathname)
	const segments = normalized.split('/')
	const candidate = segments[1]
	return locales.includes(candidate as Locale) ? (candidate as Locale) : null
}

export const stripLocaleFromPath = (pathname: string) => {
	const locale = getLocaleFromPath(pathname)
	if (!locale) return normalizePath(pathname)
	const normalized = normalizePath(pathname)
	const rest = normalized.split('/').slice(2).join('/')
	return normalizePath(rest ? `/${rest}` : '/')
}

export const addLocaleToPath = (pathname: string, locale: Locale) => {
	const stripped = stripLocaleFromPath(pathname)
	if (locale === defaultLocale) {
		return stripped
	}
	const base = stripped === '/' ? '' : stripped
	return `/${locale}${base}`
}
