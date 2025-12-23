"use client"

import { ChevronDown } from "lucide-react"
import { useMemo } from "react"

import { NoPhoto } from "@/components/ui/NoPhoto"
import { ProfileLink } from "@/components/ui/actions/ProfileLink"
import { useGetOfferLogs } from "@/hooks/queries/offers/useGet/useGetOfferLogs"
import type { PriceCurrencyCode } from "@/lib/currency"
import { formatCurrencyValue } from "@/lib/currency"
import { cn } from "@/lib/utils"
import type { IOfferShort } from "@/shared/types/Offer.interface"

import { buildOfferLogSections } from "./offerLog"

type OfferHistoryItemProps = {
  offer: IOfferShort
  isExpanded: boolean
  onToggle: () => void
}

export function OfferHistoryItem({ offer, isExpanded, onToggle }: OfferHistoryItemProps) {
  const priceCurrency = offer.price_currency as PriceCurrencyCode
  const { data, isLoading } = useGetOfferLogs(isExpanded ? String(offer.id) : undefined)
  const sections = useMemo(() => buildOfferLogSections(data?.results ?? []), [data?.results])

  return (
    <div className="rounded-2xl border bg-background p-4 sm:p-5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-4 text-left max-xs:flex-col max-xs:justify-center"
      >
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            <ProfileLink name={offer.carrier_full_name} id={offer.carrier_id} />
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Компания: </span>
            {offer.carrier_company || "-"}
          </p>
          <span className="text-error-500 text-sm font-semibold">
            {offer.response_status}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-semibold text-foreground">
            Цена: {formatCurrencyValue(offer.price_value, priceCurrency)}
          </p>
          <ChevronDown
            className={cn(
              "size-5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {isExpanded ? (
        <div className="mt-4 rounded-2xl bg-muted/20">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Загружаем историю...</p>
          ) : sections.length ? (
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.id} className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                  <div className="relative pl-6 sm:pl-8">
                    <span
                      aria-hidden
                      className="absolute left-2 top-3 bottom-6 w-px bg-border sm:left-3"
                    />
                    <div className="space-y-6">
                      {section.events.map((event, eventIndex) => {
                        const isLastEvent = eventIndex === section.events.length - 1

                        return (
                          <article
                            key={event.id}
                            className="relative grid grid-cols-1 items-start gap-3 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6"
                          >
                            <div
                              aria-hidden
                              className="absolute -left-[21px] top-2 size-3 rounded-full bg-brand/30 sm:-left-[26px]"
                            >
                              <span className="absolute inset-0 m-auto size-2 rounded-full bg-brand" />
                            </div>

                            {isLastEvent ? (
                              <span
                                aria-hidden
                                className="pointer-events-none absolute -left-4 top-5 bottom-0 z-10 w-px bg-muted/20 sm:-left-6"
                              />
                            ) : null}

                            <div className="text-xs font-medium text-muted-foreground">
                              {event.timeLabel}
                            </div>

                            <div className="rounded-2xl bg-background px-4 py-3 sm:ml-4 sm:px-5">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <NoPhoto className="size-10 shrink-0" />
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {event.author}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {event.action}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs text-muted-foreground">
                                  {event.changes.length ? (
                                    <div className="space-y-1">
                                      {event.changes.map((change) => (
                                        <div key={`${event.id}-${change.label}`} className="flex flex-wrap gap-1">
                                          <span className="font-medium text-foreground">
                                            {change.label}:
                                          </span>
                                          <span>{change.from}</span>
                                          <span aria-hidden className="text-muted-foreground">
                                            →
                                          </span>
                                          <span className="font-semibold text-foreground">
                                            {change.to}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p>Нет измененных полей.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">История пока пустая.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
