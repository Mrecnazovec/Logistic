import { ContactPrefEnum } from '../enums/ContactPref.enum'
import { ModerationStatusEnum } from '../enums/ModerationStatus.enum'
import { PriceCurrencyEnum } from '../enums/PriceCurrency.enum'
import { StatusEnum } from '../enums/Status.enum'
import { TransportTypeEnum } from '../enums/TransportType.enum'

export interface ICargoList {
	readonly id: number
	readonly uuid: string

	readonly product: string
	readonly description: string

	readonly origin_country: string
	readonly origin_city: string
	readonly origin_address: string

	readonly destination_country: string
	readonly destination_city: string
	readonly destination_address: string

	readonly load_date: string
	readonly delivery_date: string | null

	readonly transport_type: TransportTypeEnum

	readonly weight_kg: string
	readonly weight_t: number

	readonly price_value: string | null
	readonly price_currency: PriceCurrencyEnum
	readonly price_uzs: string

	readonly contact_pref: ContactPrefEnum
	readonly contact_value: string

	readonly is_hidden: boolean

	readonly company_name: string

	readonly moderation_status: ModerationStatusEnum
	readonly status: StatusEnum

	readonly age_minutes: number
	readonly created_at: string
	readonly refreshed_at: string

	readonly has_offers: boolean

	readonly path_km: number
	readonly route_km: number | null

	readonly price_per_km: number | null

	readonly origin_dist_km: number
}
