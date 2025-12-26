export const PriceCurrencyEnum = {
	UZS: 'UZS',
	KZT: 'KZT',
	RUB: 'RUB',
	USD: 'USD',
	EUR: 'EUR',
} as const

export type PriceCurrencyEnum = (typeof PriceCurrencyEnum)[keyof typeof PriceCurrencyEnum]

export const PriceSelector = [
	{ type: PriceCurrencyEnum.UZS, nameKey: 'shared.currency.uzs' },
	{ type: PriceCurrencyEnum.KZT, nameKey: 'shared.currency.kzt' },
	{ type: PriceCurrencyEnum.RUB, nameKey: 'shared.currency.rub' },
	{ type: PriceCurrencyEnum.USD, nameKey: 'shared.currency.usd' },
	{ type: PriceCurrencyEnum.EUR, nameKey: 'shared.currency.eur' },
] as const
