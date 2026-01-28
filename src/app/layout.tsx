import type { Metadata } from 'next'
import Script from 'next/script'
import { Raleway, Manrope, Inter, Urbanist } from 'next/font/google'
import './globals.css'
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from '@/constants/seo.constants'
import { Providers } from './provider'
import { I18nProvider } from '@/i18n/I18nProvider'
import { getMessages } from '@/i18n/messages'
import { getLocale } from '@/i18n/getLocale'

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

const urbanist = Urbanist({
	variable: '--font-urbanist',
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
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = getMessages(locale)

	return (
		<html lang={locale}>
			<head>
				<Script id="yandex-metrika">
					{`(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
   			})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106490012', 'ym');

    		ym(106490012, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}
				</Script>
				<noscript>
					<div>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="https://mc.yandex.ru/watch/106490012" style={{ position: 'absolute', left: '-9999px' }} alt="" />
					</div>
				</noscript>
				<Script async src="https://www.googletagmanager.com/gtag/js?id=G-FHD577EN97" />
				<Script id="google-analytics">
					{`window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-FHD577EN97');`}
				</Script>
			</head>
			<body className={`${raleway.variable} ${manrope.variable} ${inter.variable} ${urbanist.variable} antialiased scroll-smooth`}>
				<I18nProvider locale={locale} messages={messages}>
					<Providers>{children}</Providers>
				</I18nProvider>
			</body>
		</html>
	)
}
