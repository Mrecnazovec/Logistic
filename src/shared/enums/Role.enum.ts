export const RoleEnum = {
	LOGISTIC: 'LOGISTIC',
	CUSTOMER: 'CUSTOMER',
	CARRIER: 'CARRIER',
} as const

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum]

export const RoleSelect = [
	{ type: RoleEnum.LOGISTIC, name: 'Логист' },
	{ type: RoleEnum.CUSTOMER, name: 'Грузоотправитель' },
	{ type: RoleEnum.CARRIER, name: 'Перевозчик' },
]
