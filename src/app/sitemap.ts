import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/seo.constants'
import { locales } from '@/i18n/config'
import { addLocaleToPath } from '@/i18n/paths'

export default function sitemap(): MetadataRoute.Sitemap {
	const languages = locales.reduce<Record<string, string>>((acc, locale) => {
		acc[locale] = `${SITE_URL}${addLocaleToPath('/', locale)}`
		return acc
	}, {})

	return locales.map((locale) => ({
		url: `${SITE_URL}${addLocaleToPath('/', locale)}`,
		lastModified: new Date(),
		changeFrequency: 'daily',
		priority: locale === 'ru' ? 1 : 0.9,
		alternates: {
			languages,
		},
	}))
}
