import type { IOrderDetail, IOrderStatusHistory } from '@/shared/types/Order.interface'

export type StatusPageProps = {
	yandexApiKey?: string
	showMap?: boolean
}

export type TimelineEvent = {
	id: string
	timeLabel: string
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
	showMap?: boolean
	timelineSections: TimelineSection[]
	hasHistory: boolean
	orderStatusLabel: string
	orderStatusVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'
}

export type OrderRouteMapProps = {
	order?: IOrderDetail
	apiKey?: string
	locale: string
}
