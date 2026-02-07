import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/seo.constants'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/dashboard/', '/auth/', '/api/', '/_next/'],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	}
}
