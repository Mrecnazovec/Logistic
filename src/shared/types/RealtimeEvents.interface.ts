export type Offer = {
	id: number
	cargo: number
	cargo_uuid: string
	cargo_title: string
	customer_company: string
	customer_id: number
	customer_full_name: string
	origin_city: string
	origin_country: string
	load_date: string
	destination_city: string
	destination_country: string
	delivery_date: string
	transport_type: string
	transport_type_display: string
	weight_t: number
	carrier_company: string
	carrier_full_name: string
	logistic_id: number
	logistic_company: string
	logistic_full_name: string
	phone: string
	email: string
	route_km: number
	price_value: string
	price_currency: string
	payment_method: string
	payment_method_display: string
	price_per_km: string
	accepted_by_customer: boolean
	accepted_by_carrier: boolean
	accepted_by_logistic: boolean
	is_active: boolean
	status_display: string
	is_handshake: boolean
	source_status: string
	response_status: string
	message: string
	created_at: string
	invite_token: string | null
}


export type Order = {
	id: number
	cargo: number
	cargo_id: number
	customer: number
	customer_id: number
	customer_company: string
	customer_name: string
	carrier: number
	carrier_id: number
	carrier_company: string
	carrier_name: string
	logistic_company: string
	logistic_name: string
	roles: {
		customer: OrderRole
		logistic: OrderRole | null
		carrier: OrderRole
	}
	status: string
	driver_status: string
	currency: string
	currency_display: string
	price_total: string
	route_distance_km: string
	price_per_km: number
	origin_city: string
	origin_address: string
	load_date: string
	destination_city: string
	destination_address: string
	delivery_date: string
	documents_count: number
	rated: {
		by_customer: Record<string, unknown>
		by_carrier: Record<string, unknown>
		by_logistic: Record<string, unknown>
	}
	created_at: string
	share_token: string
}

export type OrderRole = {
	id: number
	name: string
	company: string
	login: string
	phone: string
	role: string
}
