import type { components, operations } from './api'

type ApiSearchQuery = NonNullable<operations['search_cargos_list']['parameters']['query']>
type TransportType = components['schemas']['CargoPublishRequest']['transport_type']
type PriceCurrency = components['schemas']['CargoPublish']['price_currency']

type SearchExtras = Partial<{
	load_date: string
	transport_type: TransportType
	id: number
	uuid: string
	origin_country: string
	destination_country: string
	min_weight: number
	max_weight: number
	min_price: number
	max_price: number
	min_axles: number
	max_axles: number
	min_volume_m3: number
	max_volume_m3: number
	price_currency: PriceCurrency
	has_offers: boolean | string
	origin_lat: number
	origin_lng: number
	origin_radius_km: number
	dest_lat: number
	dest_lng: number
	dest_radius_km: number
	lat: number
	lng: number
	rating_min: number
	rating_max: number
	order: 'path_km' | '-path_km' | 'origin_dist_km' | '-origin_dist_km' | 'price_value' | '-price_value' | 'load_date' | '-load_date'
	country: string
}>

export type ISearch = ApiSearchQuery & SearchExtras
