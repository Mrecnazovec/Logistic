export const getLocaleTag = (locale: string) => (locale === 'ru' ? 'ru-RU' : 'en-US')

export const formatTrend = (value: number | null | undefined, formatter: Intl.NumberFormat) => {
	if (typeof value !== 'number') return undefined

	const normalized = Math.abs(value) < 1 && value !== 0 ? value * 100 : value
	const absoluteValue = Math.abs(normalized)
	if (absoluteValue === 0) return '0%'

	const sign = normalized > 0 ? '+' : '-'
	return `${sign}${formatter.format(absoluteValue)}%`
}
