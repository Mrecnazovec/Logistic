export const ModerationStatus = {
	PENDING: 'pending',
	APPROVED: 'approved',
	REJECTED: 'rejected',
} as const

export type ModerationStatusEnum = (typeof ModerationStatus)[keyof typeof ModerationStatus]