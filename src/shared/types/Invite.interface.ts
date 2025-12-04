import { PriceCurrencyCode } from "@/lib/currency"

export type InviteResponseActionsProps = {
	offerId: number | null
	defaultPrice: number | string | null
	defaultCurrency: PriceCurrencyCode | '' | null
	onAccept: (offerId: number) => void
	onCounter: (payload: { offerId: number; data: { price_value: string; price_currency: PriceCurrencyCode } }) => void
	onReject: (offerId: number) => void
	isLoadingAccept: boolean
	isLoadingCounter: boolean
	isLoadingReject: boolean
	isProcessing: boolean
}
