export const PaymentMethodEnum = {
	TRANSFER: 'transfer',
	CASH: 'cash',
	BOTH: 'both',
} as const

export type PaymentMethodEnum = (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum]

export const PaymentMethodSelector = [
	{ type: PaymentMethodEnum.TRANSFER, name: 'Безналичный расчет' },
	{ type: PaymentMethodEnum.CASH, name: 'Наличный расчет' },
	{ type: PaymentMethodEnum.BOTH, name: 'Наличный и безналичный' },
]
