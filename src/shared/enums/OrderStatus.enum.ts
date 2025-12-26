type Translator = (key: string) => string

export const OrderStatusEnum = {
	PENDING: 'pending',
	IN_PROCESS: 'in_process',
	DELIVERED: 'delivered',
	NODRIVER: 'no_driver',
	PAID: 'paid',
} as const

export type OrderStatusEnum = (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum]

export const OrderDriverStatusEnum = {
	STOPPED: 'stopped',
	EN_ROUTE: 'en_route',
	PROBLEM: 'problem',
} as const

export type OrderDriverStatusEnum = (typeof OrderDriverStatusEnum)[keyof typeof OrderDriverStatusEnum]

export const OrderDriverStatusSelector = [
	{ type: OrderDriverStatusEnum.STOPPED, nameKey: 'shared.orderDriverStatus.stopped' },
	{ type: OrderDriverStatusEnum.PROBLEM, nameKey: 'shared.orderDriverStatus.problem' },
	{ type: OrderDriverStatusEnum.EN_ROUTE, nameKey: 'shared.orderDriverStatus.enRoute' },
] as const

const orderDriverStatusNameKeyMap = OrderDriverStatusSelector.reduce<Record<OrderDriverStatusEnum, string>>((acc, status) => {
	acc[status.type] = status.nameKey
	return acc
}, {} as Record<OrderDriverStatusEnum, string>)

export const getOrderDriverStatusName = (t: Translator, status?: OrderDriverStatusEnum | null) => {
	if (!status) return ''
	const key = orderDriverStatusNameKeyMap[status]
	return key ? t(key) : ''
}
