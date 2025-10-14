export const StatusEnum = {
	POSTED: 'POSTED',
	MATCHED: 'MATCHED',
	DELIVERED: 'DELIVERED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
} as const

export type StatusEnum = (typeof StatusEnum)[keyof typeof StatusEnum]
