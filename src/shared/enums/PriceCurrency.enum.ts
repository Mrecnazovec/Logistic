export const PriceCurrency = {
	UZS: 'UZS',
	KZT: 'KZT',
	RUB: 'RUB',
	USD: 'USD',
	EUR: 'EUR',
} as const

export type PriceCurrencyEnum = (typeof PriceCurrency)[keyof typeof PriceCurrency]