import type { RatingUserPieChart } from '@/shared/types/Rating.interface'

export const parseNumber = (value?: number | string | null) => {
	if (value === null || value === undefined) return null
	const numericValue = typeof value === 'string' ? Number(value) : value
	return Number.isFinite(numericValue) ? numericValue : null
}

export const getDaysSince = (dateValue?: string | null) => {
	if (!dateValue) return null
	const createdAt = new Date(dateValue)
	if (Number.isNaN(createdAt.getTime())) return null
	const diffMs = Date.now() - createdAt.getTime()
	return Math.max(Math.floor(diffMs / 86400000), 0)
}

type PieChartRaw = RatingUserPieChart | string | Record<string, number> | null | undefined

export const parsePieChart = (value?: PieChartRaw) => {
	if (!value) return null

	const toMapped = (input: Record<string, number>) => ({
		in_search: input['1'] ?? 0,
		in_process: input['2'] ?? 0,
		successful: input['3'] ?? 0,
		cancelled: input['4'] ?? 0,
		total: input['5'],
	})

	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value) as Record<string, number>
			return toMapped(parsed)
		} catch {
			return null
		}
	}

	if ('in_search' in value || 'in_process' in value || 'successful' in value || 'cancelled' in value) {
		return value as RatingUserPieChart
	}

	return toMapped(value as Record<string, number>)
}

export const formatPlural = (locale: string, count: number, one: string, few: string, many: string) => {
	if (locale === 'ru') {
		const normalized = Math.abs(count)
		const lastTwoDigits = normalized % 100
		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} ${many}`
		const lastDigit = normalized % 10
		if (lastDigit === 1) return `${count} ${one}`
		if (lastDigit >= 2 && lastDigit <= 4) return `${count} ${few}`
		return `${count} ${many}`
	}

	return `${count} ${count === 1 ? one : many}`
}
