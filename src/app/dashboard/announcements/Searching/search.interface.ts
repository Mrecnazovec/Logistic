import { PriceCurrencyEnum } from '@/shared/enums/PriceCurrency.enum'
import { TransportTypeEnum } from '@/shared/enums/TransportType.enum'

export interface ISearch {
	page?: number

	origin_city?: string
	destination_city?: string
	load_date?: string
	transport_type?: TransportTypeEnum
	id?: number
	min_weight?: number
	max_weight?: number
	min_price?: number
	max_price?: number
	price_currency?: PriceCurrencyEnum
	has_offers?: boolean
	origin_lat?: number
	origin_lng?: number
	origin_radius_km?: number
	dest_lat?: number
	dest_lng?: number
	dest_radius_km?: number
	order?: 'path_km' | '-path_km' | 'origin_dist_km' | '-origin_dist_km' | 'price_value' | '-price_value' | 'load_date' | '-load_date'
}
