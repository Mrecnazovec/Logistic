export const RoleEnum = {
	LOGISTIC: 'LOGISTIC',
	CUSTOMER: 'CUSTOMER',
	CARRIER: 'CARRIER',
} as const

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum]
