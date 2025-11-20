import { PriceCurrencyEnum } from '../enums/PriceCurrency.enum'

export type PriceCurrencyCode = NonNullable<PriceCurrencyEnum>

export const currencySymbols: Record<PriceCurrencyCode, string> = {
	USD: '$',
	EUR: '\u20ac',
	RUB: '\u20bd',
	KZT: '\u20b8',
	UZS: '\u0441\u045e\u043c',
}

export function getCurrencySymbol(currency?: PriceCurrencyEnum | null) {
	if (!currency) return ''
	return currencySymbols[currency as PriceCurrencyCode] ?? currency
}

export function formatCurrencyValue(value?: number | string | null, currency?: PriceCurrencyEnum | null) {
	if (value === null || value === undefined || value === '') return '\u2014'

	const numeric = typeof value === 'string' ? Number(value) : value
	if (Number.isNaN(numeric)) return String(value)

	const formatted = numeric.toLocaleString('ru-RU')
	const symbol = getCurrencySymbol(currency)

	if (symbol) return `${formatted} ${symbol}`
	return currency ? `${formatted} ${currency}` : formatted
}

export function formatCurrencyPerKmValue(value?: number | string | null, currency?: PriceCurrencyEnum | null) {
	if (value === null || value === undefined || value === '') return '\u2014'

	const numeric = typeof value === 'string' ? Number(value) : value
	if (Number.isNaN(numeric)) return String(value)

	const formatted = formatCurrencyValue(numeric, currency)
	return `${formatted}/\u043a\u043c`
}
