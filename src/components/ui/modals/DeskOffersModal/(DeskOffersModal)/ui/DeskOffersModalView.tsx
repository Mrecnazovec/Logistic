"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Tabs, TabsContent } from "@/components/ui/Tabs"
import { useI18n } from "@/i18n/I18nProvider"

import { CargoInfo } from "../../CargoInfo"
import { OfferCard } from "../../OfferCard"
import { OfferHistoryItem } from "../../OfferHistoryItem"
import type { OffersTab } from "../../types"
import { useDeskOffersModalView } from "../hooks/useDeskOffersModalView"
import { DeskOffersTabs } from "./DeskOffersTabs"

interface DeskOffersModalProps {
  cargoUuid?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialPrice?: string
}

export function DeskOffersModalView({
  cargoUuid,
  open,
  onOpenChange,
  initialPrice,
}: DeskOffersModalProps) {
  const { t } = useI18n()
  const {
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
  } = useDeskOffersModalView(cargoUuid, initialPrice, t)

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
              <DeskOffersTabs
                t={t}
                incomingCount={incomingOffers.length}
                acceptedCount={acceptedOffers.length}
                historyCount={offers.length}
              />

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
                    {activeHistoryOffers.map((offer) => (
                      <OfferHistoryItem
                        key={offer.id}
                        offer={offer}
                        isExpanded={expandedOfferId === offer.id}
                        onToggle={() =>
                          setExpandedOfferId((prev) => (prev === offer.id ? null : offer.id))
                        }
                      />
                    ))}
                    {inactiveHistoryOffers.length ? (
                      <div className="relative py-2">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden />
                        <div className="relative mx-auto w-fit bg-background px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t("components.deskOffers.inactiveHeading")}
                        </div>
                      </div>
                    ) : null}
                    {inactiveHistoryOffers.map((offer) => (
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
