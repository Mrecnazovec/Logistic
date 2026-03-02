"use client"

import { useState } from "react"

import { useAcceptOffer } from "@/hooks/queries/offers/useAction/useAcceptOffer"
import { useCounterOffer } from "@/hooks/queries/offers/useAction/useCounterOffer"
import { useRejectOffer } from "@/hooks/queries/offers/useAction/useRejectOffer"
import { useAcceptOrderInvite } from "@/hooks/queries/orders/useAcceptOrderInvite"
import { useConfirmOrderTerms } from "@/hooks/queries/orders/useConfirmOrderTerms"
import { useDeclineOrderInvite } from "@/hooks/queries/orders/useDeclineOrderInvite"
import { useGetInvitePreview } from "@/hooks/queries/orders/useGet/useGetInvitePreview"
import type { PriceCurrencyCode } from "@/lib/currency"
import { formatCurrencyPerKmValue, formatCurrencyValue } from "@/lib/currency"
import { formatDateValue, formatDistanceKm } from "@/lib/formatters"
import { formatPriceInputValue, normalizePriceValueForPayload } from "@/lib/InputValidation"
import { PaymentMethodEnum } from "@/shared/enums/PaymentMethod.enum"
import { getTransportName, type TransportTypeEnum } from "@/shared/enums/TransportType.enum"
import type { IOfferShort } from "@/shared/types/Offer.interface"

const EMPTY = "-"

type Translator = (key: string, params?: Record<string, string | number>) => string

export function useOfferDecisionModalState(
  offer: IOfferShort | undefined,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  t: Translator,
) {
  const initialPriceValue = formatPriceInputValue(offer?.price_value ? String(offer.price_value) : "")
  const initialCurrency = (offer?.price_currency as PriceCurrencyCode) ?? ""
  const initialPaymentMethod = (offer?.payment_method as PaymentMethodEnum) ?? ""

  const [priceValue, setPriceValue] = useState(initialPriceValue)
  const [currency, setCurrency] = useState<PriceCurrencyCode | "">(initialCurrency)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum | "">(initialPaymentMethod)
  const [isCounterMode, setIsCounterMode] = useState(false)
  const dialogKey = offer ? `${offer.id}-${open}` : "empty"

  const { acceptOffer, isLoadingAcceptOffer } = useAcceptOffer()
  const { rejectOffer, isLoadingRejectOffer } = useRejectOffer()
  const { counterOffer, isLoadingCounterOffer } = useCounterOffer()
  const { acceptOrderInvite, isLoadingAccept: isLoadingAcceptInvite } = useAcceptOrderInvite()
  const { declineOrderInvite, isLoadingDecline } = useDeclineOrderInvite()
  const { confirmOrderTerms } = useConfirmOrderTerms()

  const isCounterDisabled = !priceValue || !currency || !paymentMethod || isLoadingCounterOffer || !offer
  const inviteToken = (offer as { invite_token?: string } | undefined)?.invite_token
  const isInviteFlow = Boolean(inviteToken)
  const { invitePreview } = useGetInvitePreview(isInviteFlow ? inviteToken : "")
  const resolvedOriginCity = invitePreview?.origin_city ?? offer?.origin_city ?? EMPTY
  const resolvedOriginCountry = offer?.origin_country ?? ""
  const resolvedDestinationCity = invitePreview?.destination_city ?? offer?.destination_city ?? EMPTY
  const resolvedDestinationCountry = offer?.destination_country ?? ""
  const resolvedLoadDate = formatDateValue(invitePreview?.load_date ?? offer?.load_date, "dd.MM.yyyy", EMPTY)
  const resolvedDeliveryDate = formatDateValue(invitePreview?.delivery_date ?? offer?.delivery_date, "dd.MM.yyyy", EMPTY)
  const resolvedRouteKm = invitePreview?.route_distance_km
    ? formatDistanceKm(invitePreview.route_distance_km, EMPTY)
    : offer?.route_km ?? EMPTY
  const resolvedTransportType = invitePreview?.transport_type ?? offer?.transport_type
  const resolvedTransport = resolvedTransportType
    ? getTransportName(t, resolvedTransportType as TransportTypeEnum) || resolvedTransportType || EMPTY
    : EMPTY
  const resolvedWeight = invitePreview?.weight_kg
    ? Number(invitePreview.weight_kg) / 1000
    : offer?.weight_t
  const resolvedPriceValue = invitePreview?.driver_price ?? offer?.price_value
  const resolvedCurrency = (invitePreview?.driver_currency ?? offer?.price_currency) as PriceCurrencyCode | undefined
  const resolvedPrice = formatCurrencyValue(resolvedPriceValue, resolvedCurrency)
  const resolvedPricePerKm = formatCurrencyPerKmValue(offer?.price_per_km, resolvedCurrency)
  const inviter = invitePreview?.inviter as { id?: number; name?: string; company?: string } | null
  const inviteUserId = inviter?.id ?? null
  const inviteUserName = inviter?.name ?? EMPTY
  const inviteCompanyName = inviter?.company ?? EMPTY

  const resetCounterState = () => {
    setPriceValue(initialPriceValue)
    setCurrency(initialCurrency)
    setPaymentMethod(initialPaymentMethod)
    setIsCounterMode(false)
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetCounterState()
    }
    onOpenChange(nextOpen)
  }

  const handleAcceptInvite = () => {
    if (!inviteToken) return
    acceptOrderInvite(
      { token: inviteToken },
      {
        onSuccess: (order) => {
          if (order?.order_id) {
            confirmOrderTerms(order.order_id)
          }
          onOpenChange(false)
        },
      },
    )
  }

  const handleDeclineInvite = () => {
    if (!inviteToken) return
    declineOrderInvite(
      { token: inviteToken },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  const handleAccept = () => {
    if (!offer) return
    acceptOffer(String(offer.id), {
      onSuccess: () => onOpenChange(false),
    })
  }

  const handleReject = () => {
    if (!offer) return
    rejectOffer(String(offer.id), {
      onSuccess: () => onOpenChange(false),
    })
  }

  const handleCounter = () => {
    if (!isCounterMode) {
      setIsCounterMode(true)
      return
    }
    if (isCounterDisabled || !offer) return
    counterOffer(
      {
        id: String(offer.id),
        data: {
          price_value: normalizePriceValueForPayload(priceValue) ?? "",
          price_currency: currency as PriceCurrencyCode,
          payment_method: paymentMethod as PaymentMethodEnum,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return {
    dialogKey,
    priceValue,
    setPriceValue,
    currency,
    setCurrency,
    paymentMethod,
    setPaymentMethod,
    isCounterMode,
    isCounterDisabled,
    isInviteFlow,
    inviteToken,
    invitePreview,
    resolvedOriginCity,
    resolvedOriginCountry,
    resolvedDestinationCity,
    resolvedDestinationCountry,
    resolvedLoadDate,
    resolvedDeliveryDate,
    resolvedRouteKm,
    resolvedTransport,
    resolvedWeight,
    resolvedPrice,
    resolvedPricePerKm,
    inviteUserId,
    inviteUserName,
    inviteCompanyName,
    isLoadingAcceptOffer,
    isLoadingRejectOffer,
    isLoadingAcceptInvite,
    isLoadingDecline,
    handleDialogOpenChange,
    handleAcceptInvite,
    handleDeclineInvite,
    handleAccept,
    handleReject,
    handleCounter,
  }
}

