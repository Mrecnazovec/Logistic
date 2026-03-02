"use client"

import { useState } from "react"

import { useAcceptOffer } from "@/hooks/queries/offers/useAction/useAcceptOffer"
import { useCounterOffer } from "@/hooks/queries/offers/useAction/useCounterOffer"
import { useRejectOffer } from "@/hooks/queries/offers/useAction/useRejectOffer"
import { useGetOffers } from "@/hooks/queries/offers/useGet/useGetOffers"
import type { PriceCurrencyCode } from "@/lib/currency"
import { PaymentMethodEnum } from "@/shared/enums/PaymentMethod.enum"

import { buildCargoInfo } from "../../helpers"
import type { OfferFormState, OffersTab } from "../../types"

type Translator = (key: string, params?: Record<string, string | number>) => string

type CounterPayload = {
  price_value: string
  price_currency: PriceCurrencyCode
  payment_method: PaymentMethodEnum
}

export function useDeskOffersModalView(cargoUuid?: string, initialPrice?: string, t?: Translator) {
  const [activeTab, setActiveTab] = useState<OffersTab>("incoming")
  const [formState, setFormState] = useState<Record<number, OfferFormState>>({})
  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null)

  const { data, isLoading } = useGetOffers(
    cargoUuid ? { cargo_uuid: cargoUuid } : undefined,
    { enabled: Boolean(cargoUuid) },
  )
  const { acceptOffer, isLoadingAcceptOffer } = useAcceptOffer()
  const { rejectOffer, isLoadingRejectOffer } = useRejectOffer()
  const { counterOffer, isLoadingCounterOffer } = useCounterOffer()

  const offers = data?.results ?? []
  const incomingOffers = offers.filter(
    (offer) =>
      !offer.accepted_by_customer &&
      !offer.accepted_by_logistic &&
      !offer.accepted_by_carrier &&
      offer.response_status !== "counter_from_customer" &&
      offer.response_status !== "rejected",
  )
  const acceptedOffers = offers.filter(
    (offer) =>
      (offer.accepted_by_logistic && !offer.accepted_by_customer && offer.response_status !== "rejected") ||
      (offer.accepted_by_carrier && !offer.accepted_by_customer && offer.response_status !== "rejected"),
  )
  const activeHistoryOffers = offers.filter((offer) => offer.is_active !== false)
  const inactiveHistoryOffers = offers.filter((offer) => offer.is_active === false)
  const cargoInfo = t ? buildCargoInfo(offers, t, initialPrice) : null

  const handleFormChange = (
    offerId: number,
    next: Partial<OfferFormState>,
    defaultForm: OfferFormState,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [offerId]: { ...defaultForm, ...prev[offerId], ...next },
    }))
  }

  const handleCounterOffer = (offerId: number, payload: CounterPayload) => {
    counterOffer({ id: String(offerId), data: payload })
  }

  return {
    activeTab,
    setActiveTab,
    formState,
    expandedOfferId,
    setExpandedOfferId,
    isLoading,
    offers,
    incomingOffers,
    acceptedOffers,
    activeHistoryOffers,
    inactiveHistoryOffers,
    cargoInfo,
    acceptOffer,
    rejectOffer,
    isLoadingAcceptOffer,
    isLoadingRejectOffer,
    isLoadingCounterOffer,
    handleFormChange,
    handleCounterOffer,
  }
}
