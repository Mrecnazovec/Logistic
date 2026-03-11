import type { LucideIcon } from 'lucide-react'

export type AnalyticsCard = {
	id: string
	title: string
	value: string
	icon: LucideIcon
	accentClass: string
	trend?: string
	trendVariant?: 'success' | 'danger'
	trendLabel?: string
	description?: string
}

export type IncomeChartDatum = {
	month: string
	given: number
	received: number
	earned: number
}

export type TransportChartDatum = {
	status: string
	label: string
	value: number
	fill: string
}

export type ProfileField = {
	id: string
	label: string
	value: string
}
