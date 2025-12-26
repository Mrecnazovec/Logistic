import { cookies } from 'next/headers'
import { defaultLocale, localeCookie, locales, type Locale } from './config'

export const getLocale = async (): Promise<Locale> => {
	const cookieStore = await cookies()
	const localeFromCookie = cookieStore.get(localeCookie)?.value
	return locales.includes(localeFromCookie as Locale) ? (localeFromCookie as Locale) : defaultLocale
}
