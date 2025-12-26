export const PaymentMethodEnum = {
	CASH: 'cash',
	CASHLESS: 'cashless',
	BOTH: 'both',
} as const

export type PaymentMethodEnum = (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum]

export const PaymentMethodSelector = [
	{ type: PaymentMethodEnum.CASH, nameKey: 'shared.payment.cash' },
	{ type: PaymentMethodEnum.CASHLESS, nameKey: 'shared.payment.cashless' },
	{ type: PaymentMethodEnum.BOTH, nameKey: 'shared.payment.both' },
] as const
