import { getOrderDriverStatusName, type OrderDriverStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { BuildTimelineSectionsOptions, StatusHistory, TimelineEvent, TimelineSection } from '../types'

export const buildTimelineSections = (history: StatusHistory, options: BuildTimelineSectionsOptions): TimelineSection[] => {
	if (!Array.isArray(history) || history.length === 0) {
		return []
	}

	const { t, dateFormatter, timeFormatter } = options

	const parseDate = (value?: string | null) => {
		if (!value) return null
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}

	const formatSectionTitle = (date: Date | null) => {
		if (!date) return t('order.status.timeline.unknownDate')
		return dateFormatter.format(date)
	}

	const formatTimeLabel = (date: Date | null) => {
		if (!date) return t('order.status.timeline.unknownTime')
		return timeFormatter.format(date)
	}

	const normalizeStatusLabel = (value: string | null | undefined) => value?.trim() || t('order.status.timeline.notSpecified')

	const getStatusName = (value: string) => {
		const name = getOrderDriverStatusName(t, value as OrderDriverStatusEnum)
		return name || value || t('order.status.timeline.notSpecified')
	}

	const sortedHistory = [...history].sort((first, second) => {
		const firstTimestamp = parseDate(first.created_at)?.getTime() ?? 0
		const secondTimestamp = parseDate(second.created_at)?.getTime() ?? 0
		return secondTimestamp - firstTimestamp
	})

	const sections: TimelineSection[] = []
	const sectionIndexMap = new Map<string, number>()

	for (const item of sortedHistory) {
		const eventDate = parseDate(item.created_at)
		const sectionKey = eventDate ? eventDate.toISOString().slice(0, 10) : `unknown-${item.id}`
		const event: TimelineEvent = {
			id: String(item.id),
			timeLabel: formatTimeLabel(eventDate),
			author: item.user_name?.trim() || t('order.status.timeline.system'),
			statusFrom: normalizeStatusLabel(item.old_status_label),
			statusTo: normalizeStatusLabel(item.new_status_label),
		}

		const existingSectionIndex = sectionIndexMap.get(sectionKey)
		if (existingSectionIndex === undefined) {
			sectionIndexMap.set(sectionKey, sections.length)
			sections.push({ id: sectionKey, title: formatSectionTitle(eventDate), events: [event] })
		} else {
			sections[existingSectionIndex]?.events.push(event)
		}
	}

	return sections.map((section) => ({
		...section,
		events: section.events.map((event) => ({
			...event,
			statusFrom: getStatusName(event.statusFrom),
			statusTo: getStatusName(event.statusTo),
		})),
	}))
}
