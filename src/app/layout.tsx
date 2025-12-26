import type { Metadata } from 'next'
import { Raleway, Manrope, Inter } from 'next/font/google'
import './globals.css'
import { NO_INDEX_PAGE, SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from '@/constants/seo.constants'
import { Providers } from './provider'
import { cookies } from 'next/headers'
import { I18nProvider } from '@/i18n/I18nProvider'
import { defaultLocale, locales, localeCookie, type Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

const raleway = Raleway({
	variable: '--font-raleway',
	subsets: ['latin'],
})

const manrope = Manrope({
	variable: '--font-manrope',
	subsets: ['latin'],
})

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	authors: SITE_AUTHOR,
	keywords: SITE_KEYWORDS,
	...NO_INDEX_PAGE,
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = await cookies()
	const localeFromCookie = cookieStore.get(localeCookie)?.value
	const locale = locales.includes(localeFromCookie as Locale) ? (localeFromCookie as Locale) : defaultLocale
	const messages = getMessages(locale)

	return (
		<html lang={locale}>
			<body className={`${raleway.variable} ${manrope.variable} ${inter.variable} antialiased`}>
				<I18nProvider locale={locale} messages={messages}>
					<Providers>{children}</Providers>
				</I18nProvider>
			</body>
		</html>
	)
}
