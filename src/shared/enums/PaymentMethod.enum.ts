export const PaymentMethodEnum = {
	CASH: 'cash',
	CASHLESS: 'cashless',
} as const

export type PaymentMethodEnum = (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum]

export const PaymentMethodSelector = [
	{ type: PaymentMethodEnum.CASH, name: 'Наличные' },
	{ type: PaymentMethodEnum.CASHLESS, name: 'Безналичный расчёт' },
]
