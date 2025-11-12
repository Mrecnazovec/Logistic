import { ContactPrefEnum } from '@/shared/enums/ContactPref.enum'
import { ModerationStatusEnum } from '@/shared/enums/ModerationStatus.enum'
import { PriceCurrencyEnum } from '@/shared/enums/PriceCurrency.enum'
import { StatusEnum } from '@/shared/enums/Status.enum'
import { TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import { IPaginatedCargoListList, IPaginatedUserRatingList } from '@/shared/types/PaginatedList.interface'
import { IRatingTableRow } from '@/shared/types/RatingTableRow.interface'

const origins = [
	{ city: 'Tashkent', country: 'Uzbekistan', address: 'Navoi street 18' },
	{ city: 'Almaty', country: 'Kazakhstan', address: 'Orbit road 44' },
	{ city: 'Bishkek', country: 'Kyrgyzstan', address: 'Ibraimov avenue 5' },
	{ city: 'Dushanbe', country: 'Tajikistan', address: 'Somoni avenue 11' },
	{ city: 'Samarkand', country: 'Uzbekistan', address: 'Registan street 2' },
]

const destinations = [
	{ city: 'Moscow', country: 'Russia', address: 'Tverskaya 10' },
	{ city: 'Astana', country: 'Kazakhstan', address: 'Mangilik El 19' },
	{ city: 'Dubai', country: 'UAE', address: 'Sheikh Zayed rd 51' },
	{ city: 'Istanbul', country: 'Turkey', address: 'Halaskargazi 23' },
	{ city: 'Riga', country: 'Latvia', address: 'Elizabetes 87' },
]

const transportTypes = [TransportTypeEnum.TENT, TransportTypeEnum.REEFER, TransportTypeEnum.MEGA, TransportTypeEnum.DUMP, TransportTypeEnum.PICKUP]

const priceCurrencies = [PriceCurrencyEnum.USD, PriceCurrencyEnum.EUR, PriceCurrencyEnum.USD, PriceCurrencyEnum.UZS, PriceCurrencyEnum.USD]

const products = ['Consumer electronics', 'Fresh fruit', 'Pharma supplies', 'Building materials', 'Textile rolls']

const companies = ['Steppe Logistics', 'Nomad Freight', 'Atlas Cargo', 'Transit Line', 'Velocity Trade']

const statuses = [StatusEnum.COMPLETED, StatusEnum.CANCELLED]

const moderationStatuses = [
	ModerationStatusEnum.APPROVED,
	ModerationStatusEnum.PENDING,
	ModerationStatusEnum.APPROVED,
	ModerationStatusEnum.REJECTED,
	ModerationStatusEnum.APPROVED,
]

const fakeUuid = (index: number) => `00000000-0000-4000-8000-${String(100000000000 + index).padStart(12, '0')}`

export const fakeCargoList: IPaginatedCargoListList = {
	count: 12,
	next: null,
	previous: null,
	results: Array.from({ length: 12 }).map((_, index) => {
		const origin = origins[index % origins.length]
		const destination = destinations[index % destinations.length]
		const transport = transportTypes[index % transportTypes.length]
		const priceCurrency = priceCurrencies[index % priceCurrencies.length]
		const product = products[index % products.length]
		const company = companies[index % companies.length]

		const now = new Date()
		const createdAt = new Date(now.getTime() - (index + 1) * 60 * 60 * 1000)
		const refreshedAt = new Date(createdAt.getTime() + 30 * 60 * 1000)
		const loadDate = new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000)
		const deliveryDate = index % 3 === 0 ? new Date(loadDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : null

		const weightTons = 18 + index
		const weightKg = weightTons * 1000
		const routeKm = 450 + index * 30
		const priceValue = 1600 + index * 180
		const pricePerKm = Math.round(priceValue / routeKm)
		const contactValue = `+998 90 123 4${(10 + index).toString().padStart(2, '0')}`

		return {
			id: index + 1,
			uuid: fakeUuid(index),
			product,
			description: `${product} ready for dispatch with standard insurance.`,
			origin_country: origin.country,
			origin_city: origin.city,
			origin_address: origin.address,
			destination_country: destination.country,
			destination_city: destination.city,
			destination_address: destination.address,
			load_date: loadDate.toISOString(),
			delivery_date: deliveryDate,
			transport_type: transport,
			weight_kg: weightKg.toString(),
			weight_t: weightTons,
			price_value: priceValue.toString(),
			price_currency: priceCurrency,
			price_uzs: (priceValue * 12500).toString(),
			contact_pref: index % 2 === 0 ? ContactPrefEnum.PHONE : ContactPrefEnum.BOTH,
			contact_value: contactValue,
			is_hidden: false,
			company_name: company,
			moderation_status: moderationStatuses[index % moderationStatuses.length],
			status: statuses[(index % statuses.length)],
			age_minutes: (index + 1) * 20,
			created_at: createdAt.toISOString(),
			refreshed_at: refreshedAt.toISOString(),
			has_offers: index % 2 === 0,
			path_km: routeKm,
			route_km: routeKm,
			price_per_km: pricePerKm,
			origin_dist_km: 10 + index * 3,
		}
	}),
}

type FakePaginatedRatings = Omit<IPaginatedUserRatingList, 'results'> & {
	results: IRatingTableRow[]
}

const carriers = [
	{ company: "OOO 'Logistics Number One'", login: 'alex123' },
	{ company: 'Transit Plus LLC', login: 'irina77' },
	{ company: 'Nomad Highway', login: 'driver89' },
	{ company: 'Cargo Wings', login: 'rustam90' },
	{ company: 'Steppe Movers', login: 'michael22' },
]

const drivers = ['Зубрев Александр', 'Плаксина Ирина', 'Садыков Тимур', 'Абдуллаев Рустам', 'Миннибаев Илья']

export const fakeRatingsList: FakePaginatedRatings = {
	count: 10,
	next: null,
	previous: null,
	results: Array.from({ length: 10 }).map((_, index) => {
		const carrier = carriers[index % carriers.length]
		const driver = drivers[index % drivers.length]
		const now = new Date()

		const registeredAt = new Date(now.getFullYear(), 0, 28 - (index % 5)).toISOString()

		return {
			id: index + 1,
			rated_user: 5000 + index,
			rated_by: `dispatcher${index + 1}@logist.com`,
			order: 8000 + index,
			score: 4 + ((index % 3) + 1) / 10,
			comment: null,
			created_at: now.toISOString(),
			carrier_name: carrier.company,
			driver_name: driver,
			login: carrier.login,
			registered_at: registeredAt,
			orders_completed: 900 + index * 37,
		}
	}),
}
