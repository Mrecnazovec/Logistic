export const OrderStatusEnum = {
	PENDING: 'pending',
	ENROUTE: 'en_route',
	DELIVERED: 'delivered',
	NODRIVER: 'no_driver',
} as const

export type OrderStatusEnum = (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum]
