export const PriceCurrencyEnum = {
	UZS: 'UZS',
	KZT: 'KZT',
	RUB: 'RUB',
	USD: 'USD',
	EUR: 'EUR',
} as const

export type PriceCurrencyEnum = (typeof PriceCurrencyEnum)[keyof typeof PriceCurrencyEnum]

export const PriceSelector = [
	{ type: PriceCurrencyEnum.UZS, name: 'сум' },
	{ type: PriceCurrencyEnum.KZT, name: 'тенге' },
	{ type: PriceCurrencyEnum.RUB, name: 'рубли' },
	{ type: PriceCurrencyEnum.USD, name: 'доллары' },
	{ type: PriceCurrencyEnum.EUR, name: 'евро' },
]
