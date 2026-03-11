import { I18nProvider } from '@/i18n/I18nProvider'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { addLocaleToPath } from '@/i18n/paths'
import { SITE_NAME, SITE_URL, getLocalizedSeo } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type LayoutProps = {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

const languageAlternates = locales.reduce<Record<string, string>>((acc, locale) => {
	acc[locale] = addLocaleToPath('/', locale)
	return acc
}, {})

const resolveLocale = async (params: LayoutProps['params']): Promise<Locale> => {
	const { locale } = await params
	if (!isLocale(locale)) {
		notFound()
	}
	return locale
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
	const locale = await resolveLocale(params)
	const seo = getLocalizedSeo(locale)
	const canonical = addLocaleToPath('/', locale)

	return {
		alternates: {
			canonical,
			languages: languageAlternates,
		},
		openGraph: {
			url: new URL(canonical, SITE_URL).toString(),
			locale: seo.ogLocale,
			title: SITE_NAME,
			description: seo.description,
		},
		twitter: {
			title: SITE_NAME,
			description: seo.description,
		},
	}
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
	const locale = await resolveLocale(params)
	const messages = getMessages(locale)

	return (
		<I18nProvider locale={locale} messages={messages}>
			{children}
		</I18nProvider>
	)
}
