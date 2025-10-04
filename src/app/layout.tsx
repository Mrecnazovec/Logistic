import type { Metadata } from 'next'
import { Raleway, Manrope, Inter } from 'next/font/google'
import './globals.css'
import { NO_INDEX_PAGE, SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from '@/constants/seo.constants'
import { Providers } from './provider'

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${raleway.variable} ${manrope.variable} ${inter.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
