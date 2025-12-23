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

const offerLogDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const offerLogTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

const formatLogValue = (value: unknown) => {
  if (value === null || value === undefined) return "—"
  if (typeof value === "string" && value.trim()) return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  try {
    const serialized = JSON.stringify(value)
    return serialized === "{}" ? "—" : serialized
  } catch {
    return "—"
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

const formatBooleanValue = (value: unknown) => {
  if (value === undefined) return "—"
  return value ? "Да" : "Нет"
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "—"
  if (typeof value === "boolean") return formatBooleanValue(value)
  if (typeof value === "number") return String(value)
  if (typeof value === "string") return value.trim() || "—"
  try {
    const serialized = JSON.stringify(value)
    return serialized === "{}" ? "—" : serialized
  } catch {
    return "—"
  }
}

const formatPrice = (state: LogState) => {
  const value = state.price_value
  const currency = state.price_currency
  if (!value && !currency) return "—"
  if (value && currency) return `${value} ${currency}`
  return `${value ?? "—"} ${currency ?? ""}`.trim()
}

const formatPaymentMethod = (value: unknown) => {
  if (value === "cash") return "Наличные"
  if (value === "cashless") return "Безнал"
  return formatValue(value)
}

const formatInitiator = (value: unknown) => {
  if (value === "LOGISTIC") return "Логист"
  if (value === "CUSTOMER") return "Заказчик"
  if (value === "CARRIER") return "Перевозчик"
  return formatValue(value)
}

const buildLogChanges = (oldState: LogState, newState: LogState): OfferLogChange[] => {
  const changes: OfferLogChange[] = []

  const addChange = (label: string, from: string, to: string) => {
    if (from === to) return
    changes.push({ label, from, to })
  }

  addChange("Цена", formatPrice(oldState), formatPrice(newState))
  addChange(
    "Способ оплаты",
    formatPaymentMethod(oldState.payment_method),
    formatPaymentMethod(newState.payment_method),
  )
  addChange(
    "Статус ответа",
    formatValue(oldState.response_status),
    formatValue(newState.response_status),
  )
  addChange("Контрпредложение", formatBooleanValue(oldState.is_counter), formatBooleanValue(newState.is_counter))
  addChange("Активен", formatBooleanValue(oldState.is_active), formatBooleanValue(newState.is_active))
  addChange(
    "Принят клиентом",
    formatBooleanValue(oldState.accepted_by_customer),
    formatBooleanValue(newState.accepted_by_customer),
  )
  addChange(
    "Принят логистом",
    formatBooleanValue(oldState.accepted_by_logistic),
    formatBooleanValue(newState.accepted_by_logistic),
  )
  addChange(
    "Принят перевозчиком",
    formatBooleanValue(oldState.accepted_by_carrier),
    formatBooleanValue(newState.accepted_by_carrier),
  )
  addChange("Инициатор", formatInitiator(oldState.initiator), formatInitiator(newState.initiator))
  addChange("Сообщение", formatValue(oldState.message), formatValue(newState.message))

  return changes
}

export const buildOfferLogSections = (
  logs?: IOfferStatusLog[] | null,
): OfferLogSection[] => {
  if (!Array.isArray(logs) || logs.length === 0) return []

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
      timeLabel: eventDate ? offerLogTimeFormatter.format(eventDate) : "--:--",
      author: log.user_name?.trim() || "System",
      action: log.action,
      statusFrom: formatValue(normalizeState(log.old_state).response_status),
      statusTo: formatValue(normalizeState(log.new_state).response_status),
      changes: buildLogChanges(normalizeState(log.old_state), normalizeState(log.new_state)),
    }

    const existingSectionIndex = sectionIndexMap.get(sectionKey)

    if (existingSectionIndex === undefined) {
      sectionIndexMap.set(sectionKey, sections.length)
      sections.push({
        id: sectionKey,
        title: eventDate ? offerLogDateFormatter.format(eventDate) : "Unknown date",
        events: [event],
      })
    } else {
      sections[existingSectionIndex]?.events.push(event)
    }
  }

  return sections
}
