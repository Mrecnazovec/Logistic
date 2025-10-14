export const ModerationStatusEnum = {
	PENDING: 'pending',
	APPROVED: 'approved',
	REJECTED: 'rejected',
} as const

export type ModerationStatusEnum = (typeof ModerationStatusEnum)[keyof typeof ModerationStatusEnum]
