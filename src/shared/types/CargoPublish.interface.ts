import { ContactPrefEnum } from '../enums/ContactPref.enum'
import { PriceCurrencyEnum } from '../enums/PriceCurrency.enum'
import { TransportTypeEnum } from '../enums/TransportType.enum'

export interface ICargoPublish {
	readonly uuid: string

	product: string
	description?: string

	origin_country?: string
	origin_city: string
	origin_address: string

	destination_country?: string
	destination_city: string
	destination_address: string

	load_date: string
	delivery_date?: string | null

	transport_type: TransportTypeEnum

	weight_kg: string

	price_value?: string | null
	price_currency?: PriceCurrencyEnum

	contact_pref: ContactPrefEnum

	is_hidden?: boolean

	message?: string

	readonly route_km?: number | null
}

export type PatchedCargoPublishDto = Partial<ICargoPublish>
