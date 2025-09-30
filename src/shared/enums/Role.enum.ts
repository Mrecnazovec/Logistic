export const Role = {
	LOGISTIC: 'LOGISTIC',
	CUSTOMER: 'CUSTOMER',
	CARRIER: 'CARRIER',
} as const

export type RoleEnum = (typeof Role)[keyof typeof Role]
