import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/seo.constants'
import { locales } from '@/i18n/config'
import { addLocaleToPath } from '@/i18n/paths'

export default function robots(): MetadataRoute.Robots {
	const disallow = [
		'/api/',
		'/_next/',
		...locales.flatMap((locale) => [addLocaleToPath('/dashboard/', locale), addLocaleToPath('/auth/', locale)]),
	]

	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow,
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	}
}
