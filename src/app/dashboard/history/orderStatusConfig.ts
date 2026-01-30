import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { IOrderList } from '@/shared/types/Order.interface'

type OrderStatus = OrderStatusEnum
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'
type Translator = (key: string) => string

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	delivered: 'Доставлено',
	in_process: 'В процессе',
	no_driver: 'Без водителя',
	paid: 'Оплачено',
	pending: 'В ожидании',
	canceled: 'Отменено',
}

const ORDER_STATUS_BADGE_VARIANTS: Record<OrderStatus, BadgeVariant> = {
	delivered: 'success',
	in_process: 'info',
	no_driver: 'danger',
	paid: 'success',
	pending: 'warning',
	canceled: 'danger',
}

export const getOrderStatusLabel = (status: OrderStatus, t?: Translator) => {
	if (t) {
		const key = `history.status.${status}`
		const translated = t(key)
		if (translated && translated !== key) return translated
	}
	return ORDER_STATUS_LABELS[status] ?? status
}

export const getOrderStatusVariant = (status: OrderStatus) => ORDER_STATUS_BADGE_VARIANTS[status] ?? 'secondary'
