import { OrderStatusEnum, type OrderDriverStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { StatusPageViewProps } from '../types'

type MaybeOrder = StatusPageViewProps['order']

export const AVERAGE_SPEED_KMH = 55

export const DRIVER_STATUS_BADGE_MAP: Record<OrderDriverStatusEnum, { variant: 'info' | 'warning' | 'danger'; fallback: string }> = {
	en_route: { variant: 'info', fallback: 'En route' },
	stopped: { variant: 'warning', fallback: 'Stopped' },
	problem: { variant: 'danger', fallback: 'Problem' },
}

const uniqueCities = (cities: string[]) => {
	const seen = new Set<string>()
	const result: string[] = []

	for (const city of cities) {
		const normalized = city.trim()
		if (!normalized) continue
		const key = normalized.toLowerCase()
		if (seen.has(key)) continue
		seen.add(key)
		result.push(normalized)
	}

	return result
}

export const normalizeOrderStatus = (status: string | undefined) => {
	if (!status) return ''
	return status === 'in_proccess' ? OrderStatusEnum.IN_PROCESS : status
}

export const getProgressPercent = (normalizedStatus: string) => {
	if (normalizedStatus === OrderStatusEnum.IN_PROCESS) return 62
	return null
}

export const getProgressPlaceholderKey = (normalizedStatus: string) => {
	if (normalizedStatus === OrderStatusEnum.DELIVERED || normalizedStatus === OrderStatusEnum.PAID) {
		return 'order.status.progress.completedDelivery'
	}
	return 'order.status.progress.notStarted'
}

export const getRouteCities = (order: MaybeOrder) => {
	const orderUnsafe = (order as Record<string, unknown> | undefined) ?? {}
	const routeCitiesRaw = Array.isArray(orderUnsafe.route_cities) ? orderUnsafe.route_cities : []
	const routeCities = routeCitiesRaw.filter((value): value is string => typeof value === 'string')
	return uniqueCities([order?.origin_city ?? '', ...routeCities, order?.destination_city ?? ''])
}

export const getLocaleTag = (locale: string) => {
	if (locale === 'en') return 'en-US'
	if (locale === 'uz') return 'uz-UZ'
	return 'ru-RU'
}

