"use client"

import { TabsList, TabsTrigger } from "@/components/ui/Tabs"

type Translator = (key: string, params?: Record<string, string | number>) => string

interface DeskOffersTabsProps {
  t: Translator
  incomingCount: number
  acceptedCount: number
  historyCount: number
}

const renderCountBadge = (count: number) =>
  count > 0 ? (
    <div className="size-4 rounded-full bg-error-500 flex items-center justify-center text-white text-xs">
      <span className="-mt-0.5">{count}</span>
    </div>
  ) : null

export function DeskOffersTabs({
  t,
  incomingCount,
  acceptedCount,
  historyCount,
}: DeskOffersTabsProps) {
  return (
    <div className="w-full overflow-x-auto">
      <TabsList className="flex min-w-max flex-nowrap justify-start gap-8 border-b bg-transparent p-0 whitespace-nowrap w-full max-sm:flex-col max-sm:h-fit">
        <TabsTrigger
          value="incoming"
          className="rounded-none border-1 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground max-sm:w-full max-sm:border-b-border items-start"
        >
          {t("components.deskOffers.tabs.incoming")}
          {renderCountBadge(incomingCount)}
        </TabsTrigger>
        <TabsTrigger
          value="accepted"
          className="rounded-none border-1 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground max-sm:w-full max-sm:border-b-border items-start"
        >
          {t("components.deskOffers.tabs.accepted")}
          {renderCountBadge(acceptedCount)}
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="rounded-none border-1 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground max-sm:w-full max-sm:border-b-border items-start"
        >
          {t("components.deskOffers.tabs.history")}
          {renderCountBadge(historyCount)}
        </TabsTrigger>
      </TabsList>
    </div>
  )
}

