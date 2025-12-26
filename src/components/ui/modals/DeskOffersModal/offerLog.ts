import type { IOfferStatusLog } from "@/shared/types/Offer.interface"

export type OfferLogEvent = {
  id: string
  timeLabel: string
  author: string
  action: string
  statusFrom: string
  statusTo: string
  changes: OfferLogChange[]
}

export type OfferLogSection = {
  id: string
  title: string
  events: OfferLogEvent[]
}

export type OfferLogChange = {
  label: string
  from: string
  to: string
}

type Translator = (key: string, params?: Record<string, string | number>) => string

const getDateFormatters = (locale?: string) => {
  const resolvedLocale = locale === "en" ? "en-US" : "ru-RU"

  return {
    date: new Intl.DateTimeFormat(resolvedLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: new Intl.DateTimeFormat(resolvedLocale, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

const parseLogDate = (value?: string | null) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

type LogState = Record<string, unknown>

const normalizeState = (value: unknown): LogState => {
  if (!value || typeof value !== "object") return {}
  return value as LogState
}

const formatLogValue = (value: unknown, t: Translator) => {
  if (value === null || value === undefined) return t("components.offerLog.empty")
  if (typeof value === "string" && value.trim()) return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  try {
    const serialized = JSON.stringify(value)
    return serialized === "{}" ? t("components.offerLog.empty") : serialized
  } catch {
    return t("components.offerLog.empty")
  }
}

const formatBooleanValue = (value: unknown, t: Translator) => {
  if (value === undefined) return t("components.offerLog.empty")
  return value ? t("components.offerLog.yes") : t("components.offerLog.no")
}

const formatValue = (value: unknown, t: Translator) => {
  if (value === null || value === undefined) return t("components.offerLog.empty")
  if (typeof value === "boolean") return formatBooleanValue(value, t)
  if (typeof value === "number") return String(value)
  if (typeof value === "string") return value.trim() || t("components.offerLog.empty")
  try {
    const serialized = JSON.stringify(value)
    return serialized === "{}" ? t("components.offerLog.empty") : serialized
  } catch {
    return t("components.offerLog.empty")
  }
}

const formatPrice = (state: LogState, t: Translator) => {
  const value = state.price_value
  const currency = state.price_currency
  if (!value && !currency) return t("components.offerLog.empty")
  if (value && currency) return `${value} ${currency}`
  return `${value ?? t("components.offerLog.empty")} ${currency ?? ""}`.trim()
}

const formatPaymentMethod = (value: unknown, t: Translator) => {
  if (value === "cash") return t("components.offerLog.payment.cash")
  if (value === "cashless") return t("components.offerLog.payment.cashless")
  return formatValue(value, t)
}

const formatInitiator = (value: unknown, t: Translator) => {
  if (value === "LOGISTIC") return t("components.offerLog.initiator.logistic")
  if (value === "CUSTOMER") return t("components.offerLog.initiator.customer")
  if (value === "CARRIER") return t("components.offerLog.initiator.carrier")
  return formatValue(value, t)
}

const buildLogChanges = (oldState: LogState, newState: LogState, t: Translator): OfferLogChange[] => {
  const changes: OfferLogChange[] = []

  const addChange = (label: string, from: string, to: string) => {
    if (from === to) return
    changes.push({ label, from, to })
  }

  addChange(t("components.offerLog.change.price"), formatPrice(oldState, t), formatPrice(newState, t))
  addChange(
    t("components.offerLog.change.payment"),
    formatPaymentMethod(oldState.payment_method, t),
    formatPaymentMethod(newState.payment_method, t),
  )
  addChange(
    t("components.offerLog.change.responseStatus"),
    formatValue(oldState.response_status, t),
    formatValue(newState.response_status, t),
  )
  addChange(
    t("components.offerLog.change.counterOffer"),
    formatBooleanValue(oldState.is_counter, t),
    formatBooleanValue(newState.is_counter, t),
  )
  addChange(
    t("components.offerLog.change.active"),
    formatBooleanValue(oldState.is_active, t),
    formatBooleanValue(newState.is_active, t),
  )
  addChange(
    t("components.offerLog.change.acceptedByCustomer"),
    formatBooleanValue(oldState.accepted_by_customer, t),
    formatBooleanValue(newState.accepted_by_customer, t),
  )
  addChange(
    t("components.offerLog.change.acceptedByLogistic"),
    formatBooleanValue(oldState.accepted_by_logistic, t),
    formatBooleanValue(newState.accepted_by_logistic, t),
  )
  addChange(
    t("components.offerLog.change.acceptedByCarrier"),
    formatBooleanValue(oldState.accepted_by_carrier, t),
    formatBooleanValue(newState.accepted_by_carrier, t),
  )
  addChange(
    t("components.offerLog.change.initiator"),
    formatInitiator(oldState.initiator, t),
    formatInitiator(newState.initiator, t),
  )
  addChange(
    t("components.offerLog.change.message"),
    formatValue(oldState.message, t),
    formatValue(newState.message, t),
  )

  return changes
}

export const buildOfferLogSections = (
  logs: IOfferStatusLog[] | null | undefined,
  t: Translator,
  locale?: string,
): OfferLogSection[] => {
  if (!Array.isArray(logs) || logs.length === 0) return []

  const { date, time } = getDateFormatters(locale)
  const sortedLogs = [...logs].sort((first, second) => {
    const firstTimestamp = parseLogDate(first.created_at)?.getTime() ?? 0
    const secondTimestamp = parseLogDate(second.created_at)?.getTime() ?? 0
    return secondTimestamp - firstTimestamp
  })

  const sections: OfferLogSection[] = []
  const sectionIndexMap = new Map<string, number>()

  for (const log of sortedLogs) {
    const eventDate = parseLogDate(log.created_at)
    const sectionKey = eventDate
      ? eventDate.toISOString().slice(0, 10)
      : `unknown-${log.id}`
    const event: OfferLogEvent = {
      id: String(log.id),
      timeLabel: eventDate ? time.format(eventDate) : "--:--",
      author: log.user_name?.trim() || t("components.offerLog.system"),
      action: log.action,
      statusFrom: formatValue(normalizeState(log.old_state).response_status, t),
      statusTo: formatValue(normalizeState(log.new_state).response_status, t),
      changes: buildLogChanges(normalizeState(log.old_state), normalizeState(log.new_state), t),
    }

    const existingSectionIndex = sectionIndexMap.get(sectionKey)

    if (existingSectionIndex === undefined) {
      sectionIndexMap.set(sectionKey, sections.length)
      sections.push({
        id: sectionKey,
        title: eventDate ? date.format(eventDate) : t("components.offerLog.unknownDate"),
        events: [event],
      })
    } else {
      sections[existingSectionIndex]?.events.push(event)
    }
  }

  return sections
}
