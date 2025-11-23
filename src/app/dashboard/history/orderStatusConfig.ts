import type { IOrderList } from '@/shared/types/Order.interface'

type OrderStatus = NonNullable<IOrderList['status']>
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	delivered: 'Доставлен',
	in_process: 'В процессе',
	no_driver: 'Без водителя',
	paid: 'Оплачен',
	pending: 'В ожидании',
}

const ORDER_STATUS_BADGE_VARIANTS: Record<OrderStatus, BadgeVariant> = {
	delivered: 'success',
	in_process: 'info',
	no_driver: 'danger',
	paid: 'success',
	pending: 'warning',
}

export const getOrderStatusLabel = (status: OrderStatus) => ORDER_STATUS_LABELS[status] ?? status

export const getOrderStatusVariant = (status: OrderStatus) => ORDER_STATUS_BADGE_VARIANTS[status] ?? 'secondary'
