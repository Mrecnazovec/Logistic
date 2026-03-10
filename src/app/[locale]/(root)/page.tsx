import type { Metadata } from 'next'
import { HomePage } from './HomePage'
import { defaultLocale, locales, type Locale } from '@/i18n/config'
import { addLocaleToPath } from '@/i18n/paths'

const metadataBase = new URL(process.env.APP_URL ?? 'https://kad-one.com')
const languages = locales.reduce<Record<string, string>>((acc, lang) => {
	acc[lang] = addLocaleToPath('/', lang)
	return acc
}, {})

const homeSeo: Record<Locale, { title: string; description: string; keywords: string[] }> = {
	ru: {
		title: 'Логистическая платформа для управления перевозками',
		description:
			'Единая экосистема для мониторинга перевозок, складских операций и грузопотоков — от заявки до доставки.',
		keywords: ['логистика', 'перевозки', 'грузоперевозки', 'управление', 'платформа'],
	},
	en: {
		title: 'Logistics platform for transportation management',
		description:
			'A unified ecosystem to monitor transportation, warehouse operations, and cargo flows from request to delivery.',
		keywords: ['logistics', 'transportation', 'freight', 'management', 'platform'],
	},
	uz: {
		title: 'Logistika platformasi: tashishlarni boshqarish',
		description:
			'Yuk tashish, ombor operatsiyalari va yuk oqimlarini boshqarish uchun yagona ekotizim.',
		keywords: ['logistika', 'tashish', 'yuk', 'boshqaruv', 'platforma'],
	},
}

export async function generateMetadata(): Promise<Metadata> {
	// Keep `/` SEO preview in Russian by default.
	const locale: Locale = defaultLocale
	const { title, description, keywords } = homeSeo[locale]

	return {
		metadataBase,
		title,
		description,
		keywords,
		alternates: {
			canonical: addLocaleToPath('/', locale),
			languages,
		},
		openGraph: {
			type: 'website',
			locale,
			url: addLocaleToPath('/', locale),
			title,
			description,
		},
	}
}

export default function Page() {
	return <HomePage />
}
