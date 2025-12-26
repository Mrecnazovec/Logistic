"use client"

import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAcceptOffer } from "@/hooks/queries/offers/useAction/useAcceptOffer"
import { useCounterOffer } from "@/hooks/queries/offers/useAction/useCounterOffer"
import { useRejectOffer } from "@/hooks/queries/offers/useAction/useRejectOffer"
import { useGetOffers } from "@/hooks/queries/offers/useGet/useGetOffers"
import { useI18n } from "@/i18n/I18nProvider"
import type { PriceCurrencyCode } from "@/lib/currency"
import { PaymentMethodEnum } from "@/shared/enums/PaymentMethod.enum"

import { CargoInfo } from "./CargoInfo"
import { OfferCard } from "./OfferCard"
import { OfferHistoryItem } from "./OfferHistoryItem"
import { buildCargoInfo } from './helpers'
import type { OfferFormState, OffersTab } from "./types"

interface DeskOffersModalProps {
  cargoUuid?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialPrice?: string
}

export function DeskOffersModal({
  cargoUuid,
  open,
  onOpenChange,
  initialPrice,
}: DeskOffersModalProps) {
  const { t } = useI18n()
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
      offer.response_status !== "counter_from_customer",
  )
  const acceptedOffers = offers.filter(
    (offer) =>
      (offer.accepted_by_logistic && !offer.accepted_by_customer) ||
      (offer.accepted_by_carrier && !offer.accepted_by_customer),
  )

  const cargoInfo = buildCargoInfo(offers, t, initialPrice)

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

  const handleCounterOffer = (
    offerId: number,
    payload: {
      price_value: string
      price_currency: PriceCurrencyCode
      payment_method: PaymentMethodEnum
    },
  ) => {
    counterOffer({ id: String(offerId), data: payload })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-x-hidden">
        <DialogHeader className="pb-6 text-center">
          <DialogTitle className="text-center text-2xl font-bold">{t("components.deskOffers.title")}</DialogTitle>
        </DialogHeader>

        {!cargoUuid ? (
          <p className="py-10 text-center text-muted-foreground">
            {t("components.deskOffers.selectCargo")}
          </p>
        ) : isLoading ? (
          <p className="py-10 text-center text-muted-foreground">{t("components.deskOffers.loading")}</p>
        ) : offers.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">{t("components.deskOffers.empty")}</p>
        ) : (
          <div className="space-y-6">
            {cargoInfo ? <CargoInfo cargoInfo={cargoInfo} /> : null}

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as OffersTab)}
              className="space-y-4"
            >
              <div className="w-full overflow-x-auto">
                <TabsList className="flex min-w-max flex-nowrap justify-start gap-8 border-b bg-transparent p-0 whitespace-nowrap w-full max-sm:flex-col max-sm:h-fit">
                  <TabsTrigger
                    value="incoming"
                    className="rounded-none border-1 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground max-sm:w-full max-sm:border-b-border"
                  >
                    {t("components.deskOffers.tabs.incoming")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="accepted"
                    className="rounded-none border-1 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground max-sm:w-full max-sm:border-b-border"
                  >
                    {t("components.deskOffers.tabs.accepted")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-none border-1 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground max-sm:w-full max-sm:border-b-border"
                  >
                    {t("components.deskOffers.tabs.history")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="incoming" className="space-y-4">
                {incomingOffers.length ? (
                  incomingOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      mode="incoming"
                      formState={formState[offer.id]}
                      isLoadingAccept={isLoadingAcceptOffer}
                      isLoadingReject={isLoadingRejectOffer}
                      isLoadingCounter={isLoadingCounterOffer}
                      onAccept={() => acceptOffer(String(offer.id))}
                      onReject={() => rejectOffer(String(offer.id))}
                      onCounter={(payload) => handleCounterOffer(offer.id, payload)}
                      onFormChange={(next, defaultForm) =>
                        handleFormChange(offer.id, next, defaultForm)
                      }
                    />
                  ))
                ) : (
                  <p className="py-6 text-center text-muted-foreground">
                    {t("components.deskOffers.emptyIncoming")}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="accepted" className="space-y-4">
                {acceptedOffers.length ? (
                  acceptedOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      mode="accepted"
                      formState={formState[offer.id]}
                      isLoadingAccept={isLoadingAcceptOffer}
                      isLoadingReject={isLoadingRejectOffer}
                      isLoadingCounter={isLoadingCounterOffer}
                      onAccept={() => acceptOffer(String(offer.id))}
                      onReject={() => rejectOffer(String(offer.id))}
                      onCounter={(payload) => handleCounterOffer(offer.id, payload)}
                      onFormChange={(next, defaultForm) =>
                        handleFormChange(offer.id, next, defaultForm)
                      }
                    />
                  ))
                ) : (
                  <p className="py-6 text-center text-muted-foreground">
                    {t("components.deskOffers.emptyAccepted")}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {offers.length ? (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <OfferHistoryItem
                        key={offer.id}
                        offer={offer}
                        isExpanded={expandedOfferId === offer.id}
                        onToggle={() =>
                          setExpandedOfferId((prev) => (prev === offer.id ? null : offer.id))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-muted-foreground">{t("components.deskOffers.emptyHistory")}</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
