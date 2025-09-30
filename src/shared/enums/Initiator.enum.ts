export const Initiator = {
	CUSTOMER: 'CUSTOMER',
	CARRIER: 'CARRIER',
} as const

export type InitiatorEnum = (typeof Initiator)[keyof typeof Initiator]
