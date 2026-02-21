import type { Metadata } from 'next'
import type { Locale } from '@/i18n/config'

const FALLBACK_SITE_URL = 'https://kad-one.com'

export const SITE_NAME = 'KAD'
export const SITE_DESCRIPTION =
	'Digital logistics platform for customers, carriers, and logistics teams: cargo posting and search, offers, order management, transport documents, agreements, ratings, payments, and realtime notifications.'

export const SITE_KEYWORDS = [
	'KAD',
	'KAD Logistic',
	'KAD Logistics',
	'logistics platform',
	'freight management',
	'transport management',
]

export const SITE_AUTHOR: NonNullable<Metadata['authors']> = [
	{ name: 'Aleksandr A. Salnikov', url: 'https://t.me/Sallexe_dev' },
]

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL

type LocalizedSeo = {
	description: string
	keywords: string[]
	ogLocale: string
}

const LOCALIZED_SEO: Record<Locale, LocalizedSeo> = {
	en: {
		description:
			'KAD is a digital logistics platform for customers, carriers, and logistics teams: cargo posting and search, offer and counter-offer workflows, order and transport document management, agreements, ratings, payment statuses, and realtime notifications in one dashboard.',
		keywords: [
			'KAD',
			'KAD Logistic',
			'logistics platform',
			'cargo transportation',
			'freight exchange',
			'freight marketplace',
			'cargo search',
			'carrier search',
			'transport management',
			'freight management',
			'order management',
			'transport documents',
			'offers and counter offers',
			'carrier rating',
			'logistics payments',
			'realtime notifications',
			'websocket',
		],
		ogLocale: 'en_US',
	},
	ru: {
		description:
			'KAD - цифровая логистическая платформа для клиентов, перевозчиков и логистов: публикация и поиск грузов, офферы и встречные предложения, управление заказами и перевозочными документами, договоренности, рейтинги, платежные статусы и realtime-уведомления в едином кабинете.',
		keywords: [
			'KAD',
			'KAD логистика',
			'логистика',
			'грузоперевозки',
			'автоперевозки',
			'международные перевозки',
			'поиск груза',
			'поиск перевозчика',
			'биржа грузов',
			'логистическая платформа',
			'цифровая логистика',
			'управление заказами',
			'документы перевозки',
			'договоренности',
			'офферы',
			'встречное предложение',
			'рейтинг перевозчика',
			'платежи в логистике',
			'realtime уведомления',
			'websocket',
		],
		ogLocale: 'ru_RU',
	},
	uz: {
		description:
			'KAD - mijozlar, tashuvchilar va logistlar uchun raqamli logistika platformasi: yuk joylash va qidirish, taklif va qarshi takliflar, buyurtmalar hamda hujjatlarni boshqarish, kelishuvlar, reytinglar, tolov holatlari va realtime bildirishnomalar.',
		keywords: [
			'KAD',
			'KAD Logistic',
			'logistika',
			'yuk tashish',
			'transport boshqaruvi',
			'yuk qidirish',
			'tashuvchi qidirish',
			'raqamli logistika',
			'buyurtma boshqaruvi',
			'tashish hujjatlari',
			'takliflar',
			'reyting',
			'logistika tolovlari',
			'realtime bildirishnomalar',
			'websocket',
		],
		ogLocale: 'uz_UZ',
	},
}

export const getLocalizedSeo = (locale: Locale): LocalizedSeo => {
	return LOCALIZED_SEO[locale] ?? LOCALIZED_SEO.ru
}

export const NO_INDEX_PAGE: Pick<Metadata, 'robots'> = {
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
}
