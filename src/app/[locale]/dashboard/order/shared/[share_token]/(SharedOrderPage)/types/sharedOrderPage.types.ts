import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/Badge'
import type { DriverStatus } from '@/shared/types/Order.interface'

export type SharedOrderPageTranslator = (key: string, params?: Record<string, string | number>) => string

export type SharedOrderSectionRow = {
	label: string
	value: string
	profileId?: number | null
}

export type SharedOrderSection = {
	title: string
	rows: SharedOrderSectionRow[]
}

export type SharedOrderDriverStatusMeta = {
	label: string
	variant: VariantProps<typeof badgeVariants>['variant']
}

export type DriverStatusBadgeMap = Record<DriverStatus, SharedOrderDriverStatusMeta>
