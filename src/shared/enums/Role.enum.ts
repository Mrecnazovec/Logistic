export const RoleEnum = {
	LOGISTIC: 'LOGISTIC',
	CUSTOMER: 'CUSTOMER',
	CARRIER: 'CARRIER',
} as const

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum]

export const RoleSelect = [
	{ type: RoleEnum.LOGISTIC, nameKey: 'shared.role.logistic' },
	{ type: RoleEnum.CUSTOMER, nameKey: 'shared.role.customer' },
	{ type: RoleEnum.CARRIER, nameKey: 'shared.role.carrier' },
] as const
