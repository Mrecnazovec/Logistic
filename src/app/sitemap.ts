import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/seo.constants'

export default function sitemap(): MetadataRoute.Sitemap {
	const languages = {
		ru: SITE_URL,
		en: `${SITE_URL}/en`,
		uz: `${SITE_URL}/uz`,
	}

	return [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
			alternates: {
				languages,
			},
		},
		{
			url: `${SITE_URL}/en`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
			alternates: {
				languages,
			},
		},
		{
			url: `${SITE_URL}/uz`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
			alternates: {
				languages,
			},
		},
	]
}
