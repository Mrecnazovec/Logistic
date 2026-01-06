import { PriceCurrencyCode } from "@/lib/currency"
import { PaymentMethodEnum } from "@/shared/enums/PaymentMethod.enum"

export type InviteResponseActionsProps = {
	offerId: number | null
	defaultPrice: number | string | null
	defaultCurrency: PriceCurrencyCode | '' | null
	defaultPaymentMethod?: PaymentMethodEnum | '' | null
	onAccept: (offerId: number) => void
	onCounter: (payload: {
		offerId: number
		data: { price_value: string; price_currency: PriceCurrencyCode; payment_method: PaymentMethodEnum }
	}) => void
	onReject: (offerId: number) => void
	isLoadingAccept: boolean
	isLoadingCounter: boolean
	isLoadingReject: boolean
	isProcessing: boolean
}
