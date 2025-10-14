export const InitiatorEnum = {
	CUSTOMER: 'CUSTOMER',
	CARRIER: 'CARRIER',
} as const

export type InitiatorEnum = (typeof InitiatorEnum)[keyof typeof InitiatorEnum]
