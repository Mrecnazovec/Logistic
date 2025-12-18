export const OfferResponseStatusEnum = {
	WAITING: 'waiting',
	ACTION_REQUIRED: 'action_required',
	REJECTED: 'rejected',
} as const

export type OfferResponseStatusEnum = (typeof OfferResponseStatusEnum)[keyof typeof OfferResponseStatusEnum]
