import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatCurrencyPerKmValue, formatCurrencyValue, type PriceCurrencyCode } from './currency'

export const DEFAULT_PLACEHOLDER = '—'

export function formatDateValue(value?: string | number | Date | null, pattern = 'dd.MM.yyyy', placeholder = DEFAULT_PLACEHOLDER) {
	if (!value) return placeholder
	try {
		return format(new Date(value), pattern, { locale: ru })
	} catch {
		return placeholder
	}
}

export function formatDateTimeValue(value?: string | number | Date | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (!value) return placeholder
	try {
		return new Intl.DateTimeFormat('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(new Date(value))
	} catch {
		return placeholder
	}
}

export function formatRelativeDate(value?: string | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (!value) return placeholder
	try {
		const createdAt = new Date(value)
		const diffMs = Date.now() - createdAt.getTime()
		const minutes = Math.floor(diffMs / (1000 * 60))
		const hours = Math.floor(diffMs / (1000 * 60 * 60))
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		if (days >= 1) return `${days} дн. назад`
		if (hours >= 1) return `${hours} ч. назад`
		return `${minutes} мин. назад`
	} catch {
		return placeholder
	}
}

export function formatPlace(city?: string | null, country?: string | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (!city && !country) return placeholder
	return [city, country].filter(Boolean).join(', ')
}

export function formatWeightValue(value?: number | string | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (value === null || value === undefined || value === '') return placeholder

	const numeric = typeof value === 'string' ? Number(value) : value
	if (Number.isNaN(numeric)) return String(value)

	return `${numeric.toLocaleString('ru-RU')} т`
}

export function formatPriceValue(value?: number | string | null, currency?: PriceCurrencyCode | null) {
	return formatCurrencyValue(value, currency)
}

export function formatPricePerKmValue(value?: number | string | null, currency?: PriceCurrencyCode | null) {
	return formatCurrencyPerKmValue(value, currency)
}

export function formatDistanceKm(value?: string | number | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (value === null || value === undefined || value === '') return placeholder
	const numeric = typeof value === 'string' ? Number(value) : value
	if (Number.isNaN(numeric)) return placeholder
	return `${numeric.toLocaleString('ru-RU')} км`
}

export function parseDistanceKm(value?: string | number | null) {
	if (value === null || value === undefined || value === '') return 0
	const numeric = typeof value === 'string' ? Number(value) : value
	return Number.isNaN(numeric) ? 0 : numeric
}

export function parseDateToTimestamp(value?: string | number | Date | null) {
	if (!value) return 0
	const timestamp = new Date(value).getTime()
	return Number.isNaN(timestamp) ? 0 : timestamp
}

export function formatDurationFromMinutes(totalMinutes?: number | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (!totalMinutes) return placeholder

	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60
	const parts = []
	if (hours) parts.push(`${hours} ч`)
	if (minutes) parts.push(`${minutes} мин`)

	return parts.length ? parts.join(' ') : `${totalMinutes} мин`
}

export function formatAgeFromMinutes(ageMinutes?: number | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (!Number.isFinite(ageMinutes)) return placeholder
	if (!ageMinutes) return 'Только что'
	if (ageMinutes < 60) return `${ageMinutes} мин назад`

	const hours = Math.floor(ageMinutes / 60)
	const minutes = ageMinutes % 60
	if (ageMinutes < 24 * 60) {
		if (minutes === 0) return `${hours} ч назад`
		return `${hours} ч ${minutes} мин назад`
	}

	const days = Math.floor(ageMinutes / (60 * 24))
	return `${days} дн. назад`
}

export function formatFileSize(bytes?: number | null, placeholder = DEFAULT_PLACEHOLDER) {
	if (bytes === null || bytes === undefined) return placeholder
	const numeric = Number(bytes)
	if (!Number.isFinite(numeric) || numeric < 0) return placeholder
	if (numeric === 0) return '0 B'

	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	const exponent = Math.min(Math.floor(Math.log10(numeric) / 3), units.length - 1)
	const value = numeric / 1000 ** exponent
	return `${value.toFixed(value >= 10 || value === Math.trunc(value) ? 0 : 1)} ${units[exponent]}`
}
