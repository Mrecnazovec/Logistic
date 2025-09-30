import { InitiatorEnum } from '../enums/Initiator.enum'
import { PriceCurrencyEnum } from '../enums/PriceCurrency.enum'

export interface IOfferAcceptResponse {
	detail: string
	accepted_by_customer: boolean
	accepted_by_carrier: boolean
}

export interface IOfferCounter {
	price_value: string
	price_currency?: PriceCurrencyEnum
	message?: string
}

export interface OfferCreateDto {
	cargo: number
	price_value?: string | null
	price_currency?: PriceCurrencyEnum
	message?: string
}

export interface IOfferDetail {
	readonly id: number

	price_value?: string | null
	price_currency?: PriceCurrencyEnum
	message?: string

	readonly accepted_by_customer: boolean
	readonly accepted_by_carrier: boolean
	readonly initiator: InitiatorEnum

	readonly is_active: boolean

	readonly created_at: string
	readonly updated_at: string

	cargo: number

	readonly carrier: number
}

export type PatchedOfferDetailDto = Partial<IOfferDetail>

export interface IOfferInvite {
	cargo: number
	carrier_id: number

	price_value?: string | null
	price_currency?: PriceCurrencyEnum

	message?: string
}

export interface IOfferRejectResponse {
	detail: string
}

export interface IOfferShort {
	readonly id: number

	readonly cargo: number
	readonly cargo_origin: string
	readonly cargo_destination: string
	readonly cargo_customer_id: number

	readonly price_value: string | null
	readonly price_currency: PriceCurrencyEnum

	readonly message: string

	readonly accepted_by_customer: boolean
	readonly accepted_by_carrier: boolean

	readonly is_active: boolean

	readonly created_at: string
}
