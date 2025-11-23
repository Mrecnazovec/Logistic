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
	{ type: OrderDriverStatusEnum.STOPPED, name: 'Остановился' },
	{ type: OrderDriverStatusEnum.PROBLEM, name: 'Проблема' },
	{ type: OrderDriverStatusEnum.EN_ROUTE, name: 'В пути' },
]
