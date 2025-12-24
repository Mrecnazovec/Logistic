"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/form-control/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { PaymentSelector } from "@/components/ui/selectors/PaymentSelector"
import type { PriceCurrencyCode } from "@/lib/currency"
import { formatCurrencyPerKmValue, formatCurrencyValue } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { PaymentMethodEnum } from "@/shared/enums/PaymentMethod.enum"
import type { IOfferShort } from "@/shared/types/Offer.interface"
import { ProfileLink } from "@/components/ui/actions/ProfileLink"

import { currencyOptions } from "./constants"
import type { OfferFormState } from "./types"

type OfferCardMode = "incoming" | "accepted"

type CounterOfferPayload = {
  price_value: string
  price_currency: PriceCurrencyCode
  payment_method: PaymentMethodEnum
}

type OfferCardProps = {
  offer: IOfferShort
  mode: OfferCardMode
  formState?: OfferFormState
  isLoadingAccept: boolean
  isLoadingReject: boolean
  isLoadingCounter: boolean
  onAccept: () => void
  onReject: () => void
  onCounter: (payload: CounterOfferPayload) => void
  onFormChange: (next: Partial<OfferFormState>, defaultForm: OfferFormState) => void
}

export function OfferCard({
  offer,
  mode,
  formState,
  isLoadingAccept,
  isLoadingReject,
  isLoadingCounter,
  onAccept,
  onReject,
  onCounter,
  onFormChange,
}: OfferCardProps) {
  const priceCurrency = offer.price_currency as PriceCurrencyCode
  const defaultForm: OfferFormState = {
    paymentMethod: (offer.payment_method as PaymentMethodEnum) || "",
    currency: priceCurrency,
    price: offer.price_value ?? "",
  }
  const form = { ...defaultForm, ...formState }
  const isCounterDisabled =
    !form.price || !form.currency || !form.paymentMethod || isLoadingCounter

  const updateForm = (next: Partial<OfferFormState>) => onFormChange(next, defaultForm)

  const handleCounterOffer = () => {
    if (isCounterDisabled) return
    onCounter({
      price_value: form.price as string,
      price_currency: form.currency as PriceCurrencyCode,
      payment_method: form.paymentMethod as PaymentMethodEnum,
    })
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-background p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            {offer.carrier_id ? <ProfileLink name={offer.carrier_full_name} id={offer.carrier_id} /> : <ProfileLink name={offer.logistic_full_name} id={offer.logistic_id} />}
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Компания: </span>
            {offer.carrier_id ? offer.carrier_company : offer.logistic_company}
          </p>
          <span className="text-error-500 font-bold">{offer.response_status}</span>
        </div>
        <div className="space-y-1 text-right text-sm text-muted-foreground">
          {offer.carrier_rating !== null && offer.carrier_rating !== undefined ? (
            <p>
              <span className="font-semibold text-foreground">Рейтинг: </span>
              {offer.carrier_rating}
            </p>
          ) : null}
          <p className="font-semibold text-foreground text-start">
            Цена: {formatCurrencyValue(offer.price_value, priceCurrency)}
            {offer.price_per_km ? (
              <span className="text-muted-foreground">
                {" "}
                ({formatCurrencyPerKmValue(offer.price_per_km, priceCurrency)})
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="grid gap-3 pt-2 md:grid-cols-[1fr_auto_auto]">
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={form.price ?? ""}
          onChange={(event) => updateForm({ price: event.target.value })}
          placeholder="Введите цену"
          className="w-full rounded-full border-none bg-muted/40 placeholder:text-muted-foreground"
        />

        <Select
          value={form.currency}
          onValueChange={(value) => updateForm({ currency: value as PriceCurrencyCode })}
        >
          <SelectTrigger
            className={cn(
              "w-full rounded-full bg-grayscale-50 border-none ",
              "*:data-[slot=select-value]:text-black",
            )}
          >
            <SelectValue placeholder="Выберите валюту" />
          </SelectTrigger>
          <SelectContent align="start">
            {currencyOptions.map((currency) => (
              <SelectItem key={`${offer.id}-${currency}`} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <PaymentSelector
          value={form.paymentMethod}
          onChange={(value) => updateForm({ paymentMethod: value })}
          placeholder="Способ оплаты"
          className="bg-muted/40 shadow-none [&>button]:border-none [&>button]:bg-transparent"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 max-sm:flex-col ">
        {mode === "incoming" ? (
          <>
            <Button
              className="rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60"
              onClick={handleCounterOffer}
              disabled={isCounterDisabled}
            >
              Контрпредложение
            </Button>
            <Button
              className="rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60"
              onClick={onReject}
              disabled={isLoadingReject}
            >
              Отказать
            </Button>
          </>
        ) : (
          <>
            <Button
              className="rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60"
              onClick={onAccept}
              disabled={isLoadingAccept}
            >
              Принять
            </Button>
            <Button
              className="rounded-full bg-warning-400 text-white hover:bg-warning-500 disabled:opacity-60"
              onClick={handleCounterOffer}
              disabled={isCounterDisabled}
            >
              Торговаться
            </Button>
            <Button
              className="rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60"
              onClick={onReject}
              disabled={isLoadingReject}
            >
              Отказать
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
