export const PriceCurrency = {
	UZS: 'UZS',
	KZT: 'KZT',
	RUB: 'RUB',
	USD: 'USD',
	EUR: 'EUR',
} as const

export type PriceCurrencyEnum = (typeof PriceCurrency)[keyof typeof PriceCurrency]

export const PriceSelector = [
	{ type: PriceCurrency.UZS, name: 'Суммы' },
	{ type: PriceCurrency.KZT, name: 'Тенге' },
	{ type: PriceCurrency.RUB, name: 'Рубли' },
	{ type: PriceCurrency.USD, name: 'Доллары' },
	{ type: PriceCurrency.EUR, name: 'Евро' },
]
