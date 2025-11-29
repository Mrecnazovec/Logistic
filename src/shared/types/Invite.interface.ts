import type { PriceCurrencyCode } from '@/shared/utils/currency'

export type InviteResponseActionsProps = {
	cargoId: number | null
	defaultPrice: number | string | null
	defaultCurrency: PriceCurrencyCode | '' | null
	onAccept: (payload: { cargo: number; price_value?: string; price_currency: PriceCurrencyCode }) => void
	onCounter: (payload: { cargo: number; price_value: string; price_currency: PriceCurrencyCode }) => void
	isLoadingAccept: boolean
	isLoadingCounter: boolean
	isProcessing: boolean
}
