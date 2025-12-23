import type { PriceCurrencyCode } from "@/lib/currency"
import type { PaymentMethodEnum } from "@/shared/enums/PaymentMethod.enum"

export type OffersTab = "incoming" | "accepted" | "history"

export type OfferFormState = {
  paymentMethod?: PaymentMethodEnum | ""
  currency?: PriceCurrencyCode
  price?: string
}

export type CargoInfo = {
  origin: string
  originDate: string
  destination: string
  destinationDate: string
  transport: string
  weight: string
  route_km?: number | null
  initialPrice?: string
}
