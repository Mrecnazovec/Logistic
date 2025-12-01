export const PriceCurrencyEnum = {
	UZS: 'UZS',
	KZT: 'KZT',
	RUB: 'RUB',
	USD: 'USD',
	EUR: 'EUR',
} as const

export type PriceCurrencyEnum = (typeof PriceCurrencyEnum)[keyof typeof PriceCurrencyEnum]

export const PriceSelector = [
	{ type: PriceCurrencyEnum.UZS, name: 'Сум' },
	{ type: PriceCurrencyEnum.KZT, name: 'Тенге' },
	{ type: PriceCurrencyEnum.RUB, name: 'Рубль' },
	{ type: PriceCurrencyEnum.USD, name: 'Доллар' },
	{ type: PriceCurrencyEnum.EUR, name: 'Евро' },
]
