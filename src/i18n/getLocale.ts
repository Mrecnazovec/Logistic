import { defaultLocale, isLocale, type Locale } from './config'

type LocaleParams = {
	locale?: string | string[]
}

export const getLocale = async (
	params?: Promise<LocaleParams> | LocaleParams
): Promise<Locale> => {
	const resolvedParams = params ? await params : undefined
	const locale = Array.isArray(resolvedParams?.locale)
		? resolvedParams.locale[0]
		: resolvedParams?.locale

	return locale && isLocale(locale) ? locale : defaultLocale
}
