import type { ComponentProps } from 'react'
import type { Badge } from '@/components/ui/Badge'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

export type TransportationStatusValue = 'no_driver' | 'pending' | 'in_process' | 'delivered' | 'paid'

type StatusMeta = {
	label: string
	badgeVariant: BadgeVariant
}

export const TRANSPORTATION_STATUS_META: Record<TransportationStatusValue, StatusMeta> = {
	no_driver: { label: 'Без водителя', badgeVariant: 'outline' },
	pending: { label: 'В ожидании', badgeVariant: 'danger' },
	in_process: { label: 'В процессе', badgeVariant: 'warning' },
	delivered: { label: 'Доставлен', badgeVariant: 'success' },
	paid: { label: 'Оплачен', badgeVariant: 'success' },
} as const

export const getTransportationStatusMeta = (status: string): StatusMeta => {
	const normalizedStatus = status?.trim()

	const byValue = TRANSPORTATION_STATUS_META[normalizedStatus as TransportationStatusValue]
	if (byValue) {
		return byValue
	}

	const byLabel = Object.values(TRANSPORTATION_STATUS_META).find((meta) => meta.label === normalizedStatus)
	if (byLabel) {
		return byLabel
	}

	return {
		label: normalizedStatus || '—',
		badgeVariant: 'secondary',
	}
}
