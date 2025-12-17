export const PaymentMethodEnum = {
	TRANSFER: 'transfer',
	CASH: 'cash',
	BOTH: 'both',
} as const

export type PaymentMethodEnum = (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum]

export const PaymentMethodSelector = [
	{ type: PaymentMethodEnum.TRANSFER, name: 'Безналичный расчёт' },
	{ type: PaymentMethodEnum.CASH, name: 'Наличные' },
	{ type: PaymentMethodEnum.BOTH, name: 'Любой способ' },
]
