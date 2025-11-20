import type { IOrderList } from '@/shared/types/Order.interface'

type OrderStatus = NonNullable<IOrderList['status']>
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	delivered: 'Доставлено',
	en_route: 'В пути',
	no_driver: 'Нет водителя',
	pending: 'В обработке',
}

const ORDER_STATUS_BADGE_VARIANTS: Record<OrderStatus, BadgeVariant> = {
	delivered: 'success',
	en_route: 'info',
	no_driver: 'danger',
	pending: 'warning',
}

export const getOrderStatusLabel = (status: OrderStatus) => ORDER_STATUS_LABELS[status] ?? status

export const getOrderStatusVariant = (status: OrderStatus) => ORDER_STATUS_BADGE_VARIANTS[status] ?? 'secondary'
