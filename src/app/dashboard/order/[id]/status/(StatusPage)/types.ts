import type { IOrderDetail, IOrderStatusHistory } from '@/shared/types/Order.interface'

export type StatusPageProps = {
	yandexApiKey?: string
}

export type TimelineEvent = {
	id: string
	timeLabel: string
	occurredAt: string | null
	author: string
	statusFrom: string
	statusTo: string
}

export type TimelineSection = {
	id: string
	title: string
	events: TimelineEvent[]
}

export type StatusHistory = IOrderStatusHistory[] | null | undefined

export type BuildTimelineSectionsOptions = {
	t: (key: string, params?: Record<string, string>) => string
	dateFormatter: Intl.DateTimeFormat
	timeFormatter: Intl.DateTimeFormat
}

export type StatusPageViewProps = {
	t: (key: string, params?: Record<string, string>) => string
	locale: string
	order?: IOrderDetail
	apiKey?: string
	timelineSections: TimelineSection[]
	hasHistory: boolean
	orderStatusLabel: string
	orderStatusVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'
}

export type OrderRouteMapProps = {
	order?: IOrderDetail
	apiKey?: string
	locale: string
	onRemainingKmChange?: (value: number | null) => void
	onDriverLocationChange?: (value: string | null) => void
}
