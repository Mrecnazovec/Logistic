"use client"

import { useState } from "react"
import toast from "react-hot-toast"

import { DASHBOARD_URL } from "@/config/url.config"
import { useGenerateOrderInvite } from "@/hooks/queries/orders/useGenerateOrderInvite"
import { useInviteOrderById } from "@/hooks/queries/orders/useInviteOrderById"
import { DEFAULT_PLACEHOLDER, formatDistanceKm, formatPricePerKmValue, formatPriceValue } from "@/lib/formatters"
import { normalizePriceValueForPayload } from "@/lib/InputValidation"
import { PriceCurrencyEnum } from "@/shared/enums/PriceCurrency.enum"
import type { DriverPaymentMethod, IOrderDetail } from "@/shared/types/Order.interface"

type Translator = (key: string, params?: Record<string, string | number>) => string
type OrderInviteResult = IOrderDetail & { invite_token?: string }
type CopyState = "idle" | "copied" | "error"
type CurrencyCode = PriceCurrencyEnum

export const currencyOptions: CurrencyCode[] = ["UZS", "USD", "EUR", "KZT", "RUB"]
export const paymentMethodOptions: DriverPaymentMethod[] = ["cash", "bank_transfer", "both"]

export function useInviteDriverModalState(order: IOrderDetail, canInviteById: boolean, t: Translator) {
  const [isOpen, setIsOpen] = useState(false)
  const [carrierId, setCarrierId] = useState("")
  const [driverPrice, setDriverPrice] = useState("")
  const [driverCurrency, setDriverCurrency] = useState<CurrencyCode | "">(order.currency ?? "")
  const [driverPaymentMethod, setDriverPaymentMethod] = useState<DriverPaymentMethod | "">("")
  const [shareCopyStatus, setShareCopyStatus] = useState<CopyState>("idle")

  const { inviteOrderById, isLoadingInviteById } = useInviteOrderById()
  const { generateOrderInvite, generatedOrder, isLoadingGenerateInvite, resetGenerateInvite } = useGenerateOrderInvite()

  const inviteData = generatedOrder as OrderInviteResult | undefined
  const inviteToken = inviteData?.invite_token
  const shareLink = inviteToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${DASHBOARD_URL.order(`invite/${inviteToken}`)}`
    : ""

  const handleModalOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCarrierId("")
      setDriverPrice("")
      setDriverCurrency(order.currency ?? "")
      setDriverPaymentMethod("")
      setShareCopyStatus("idle")
      resetGenerateInvite()
    }
    setIsOpen(nextOpen)
  }

  const ensureDriverPayload = () => {
    if (!driverPrice) {
      toast.error(t("components.inviteDriver.driverPriceRequired"))
      return null
    }
    if (!driverCurrency) {
      toast.error(t("components.inviteDriver.driverCurrencyRequired"))
      return null
    }
    if (!driverPaymentMethod) {
      toast.error(t("components.inviteDriver.driverPaymentRequired"))
      return null
    }
    const normalizedDriverPrice = normalizePriceValueForPayload(driverPrice)
    if (!normalizedDriverPrice) {
      toast.error(t("components.inviteDriver.driverPriceRequired"))
      return null
    }
    return {
      driver_price: normalizedDriverPrice,
      driver_currency: driverCurrency,
      driver_payment_method: driverPaymentMethod,
    }
  }

  const handleInviteCarrier = () => {
    if (!canInviteById) return

    const parsedCarrierId = Number(carrierId)
    if (!carrierId || Number.isNaN(parsedCarrierId)) {
      toast.error(t("components.inviteDriver.invalidId"))
      return
    }

    const payload = ensureDriverPayload()
    if (!payload) return

    inviteOrderById(
      {
        id: String(order.id),
        payload: {
          driver_id: parsedCarrierId,
          ...payload,
        },
      },
      {
        onSuccess: () => setCarrierId(""),
      },
    )
  }

  const handleGenerateInviteLink = () => {
    if (!canInviteById) return

    const payload = ensureDriverPayload()
    if (!payload) return

    setShareCopyStatus("idle")
    generateOrderInvite({
      id: String(order.id),
      payload: {
        cargo: order.cargo,
        ...payload,
      },
    })
  }

  const handleCopyShareLink = async () => {
    if (!shareLink) {
      toast.error(t("components.inviteDriver.generateFirst"))
      return
    }

    try {
      await navigator.clipboard.writeText(shareLink)
      setShareCopyStatus("copied")
      toast.success(t("components.inviteDriver.copySuccess"))
    } catch (error) {
      console.error(error)
      setShareCopyStatus("error")
      toast.error(t("components.inviteDriver.copyError"))
    }
  }

  const formattedPrice = formatPriceValue(order.price_total, order.currency)
  const formattedPricePerKm = formatPricePerKmValue(order.price_per_km, order.currency)
  const formattedRouteDistance = formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)

  return {
    isOpen,
    carrierId,
    setCarrierId,
    driverPrice,
    setDriverPrice,
    driverCurrency,
    setDriverCurrency,
    driverPaymentMethod,
    setDriverPaymentMethod,
    shareCopyStatus,
    isLoadingInviteById,
    isLoadingGenerateInvite,
    shareLink,
    formattedPrice,
    formattedPricePerKm,
    formattedRouteDistance,
    handleModalOpenChange,
    handleInviteCarrier,
    handleGenerateInviteLink,
    handleCopyShareLink,
  }
}
