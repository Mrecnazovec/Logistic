import { IPaginatedCargoListList } from '@/shared/types/PaginatedList.interface'
import { ContactPrefEnum } from '../shared/enums/ContactPref.enum'
import { ModerationStatusEnum } from '../shared/enums/ModerationStatus.enum'
import { PriceCurrencyEnum } from '../shared/enums/PriceCurrency.enum'
import { StatusEnum } from '../shared/enums/Status.enum'
import { TransportTypeEnum } from '../shared/enums/TransportType.enum'

export const fakeCargoList: IPaginatedCargoListList = {
	count: 20,
	next: null,
	previous: null,
	results: Array.from({ length: 20 }).map((_, i) => {
		const origins = [
			{ city: 'Ташкент', country: 'Узбекистан' },
			{ city: 'Москва', country: 'Россия' },
			{ city: 'Астана', country: 'Казахстан' },
			{ city: 'Самарканд', country: 'Узбекистан' },
			{ city: 'Минск', country: 'Беларусь' },
		]

		const destinations = [
			{ city: 'Бишкек', country: 'Киргизия' },
			{ city: 'Алматы', country: 'Казахстан' },
			{ city: 'Душанбе', country: 'Таджикистан' },
			{ city: 'Новосибирск', country: 'Россия' },
			{ city: 'Ереван', country: 'Армения' },
		]

		const origin = origins[i % origins.length]
		const destination = destinations[i % destinations.length]

		const now = new Date()
		const created_at = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000) // каждый час назад
		const refreshed_at = new Date(created_at.getTime() + 5 * 60 * 1000)

		return {
			id: i + 1,
			product: 'Стройматериалы',
			description: 'Доставка стройматериалов по СНГ',
			origin_country: origin.country,
			origin_city: origin.city,
			origin_address: 'Центральный склад',
			destination_country: destination.country,
			destination_city: destination.city,
			destination_address: 'Промзона 3',
			load_date: now.toISOString(),
			delivery_date: null,
			transport_type: Object.values(TransportTypeEnum)[i % 5],
			weight_kg: `${(10 + i) * 1000}`,
			weight_t: 10 + i,
			price_value: `${(1500 + i * 200).toFixed(0)}`,
			price_currency: i % 2 === 0 ? PriceCurrencyEnum.USD : PriceCurrencyEnum.UZS,
			contact_pref: ContactPrefEnum.PHONE,
			contact_value: `+998 (90) 123-45-${String(10 + i).padStart(2, '0')}`,
			is_hidden: false,
			company_name: `ООО "Логистик-${i + 1}"`,
			moderation_status: ModerationStatusEnum.APPROVED,
			status: StatusEnum.POSTED,
			age_minutes: (i + 1) * 30,
			created_at: created_at.toISOString(),
			refreshed_at: refreshed_at.toISOString(),
			has_offers: i % 3 === 0,
			path_km: 500 + i * 40,
			route_km: 500 + i * 40,
			price_per_km: Math.round((1500 + i * 200) / (500 + i * 40)),
			origin_dist_km: 10 + i * 3,
		}
	}),
}
