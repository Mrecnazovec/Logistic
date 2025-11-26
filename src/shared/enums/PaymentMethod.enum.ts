export const PaymentMethodEnum = {
	TRANSFER: 'transfer',
	CASH: 'cash',
	BOTH: 'both',
} as const

export type PaymentMethodEnum = (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum]

export const PaymentMethodSelector = [
	{ type: PaymentMethodEnum.TRANSFER, name: 'Перечисление' },
	{ type: PaymentMethodEnum.CASH, name: 'Наличными' },
	{ type: PaymentMethodEnum.BOTH, name: 'Оба варианта' },
]
