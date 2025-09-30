export const Status = {
	POSTED: 'POSTED',
	MATCHED: 'MATCHED',
	DELIVERED: 'DELIVERED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
} as const

export type StatusEnum = (typeof Status)[keyof typeof Status]
