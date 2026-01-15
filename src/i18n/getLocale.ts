import { cookies, headers } from 'next/headers'
import { defaultLocale, localeCookie, locales, type Locale } from './config'

const getLocaleFromAcceptLanguage = (acceptLanguage: string | null): Locale | null => {
	if (!acceptLanguage) return null
	const preferences = acceptLanguage
		.split(',')
		.map((part) => part.split(';')[0]?.trim().toLowerCase())
		.filter(Boolean)

	for (const preference of preferences) {
		if (locales.includes(preference as Locale)) {
			return preference as Locale
		}
		const base = preference.split('-')[0]
		if (locales.includes(base as Locale)) {
			return base as Locale
		}
	}

	return null
}

export const getLocale = async (): Promise<Locale> => {
	const requestHeaders = await headers()
	const localeFromHeader = requestHeaders.get('x-locale')
	if (locales.includes(localeFromHeader as Locale)) {
		return localeFromHeader as Locale
	}
	const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(requestHeaders.get('accept-language'))
	if (localeFromAcceptLanguage) {
		return localeFromAcceptLanguage
	}
	const cookieStore = await cookies()
	const localeFromCookie = cookieStore.get(localeCookie)?.value
	return locales.includes(localeFromCookie as Locale) ? (localeFromCookie as Locale) : defaultLocale
}
