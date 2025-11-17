'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/shared/utils/currency'

export function formatRelativeDate(value?: string | null) {
	if (!value) return '—'
	try {
		const createdAt = new Date(value)
		const now = new Date()
		const diffMs = now.getTime() - createdAt.getTime()
		const minutes = Math.floor(diffMs / (1000 * 60))
		const hours = Math.floor(diffMs / (1000 * 60 * 60))
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		if (days >= 1) return `${days} дн. назад`
		if (hours >= 1) return `${hours} ч. назад`
		return `${minutes} мин. назад`
	} catch {
		return '—'
	}
}

export function formatPriceValue(value?: string | null, currency?: string | null) {
	return formatCurrencyValue(value, currency)
}

export function formatPlace(city?: string | null, country?: string | null) {
	if (!city && !country) return '—'
	return [city, country].filter(Boolean).join(', ')
}

export function formatDateValue(value?: string | null) {
	if (!value) return '—'
	try {
		return format(new Date(value), 'dd.MM.yyyy', { locale: ru })
	} catch {
		return '—'
	}
}

export function formatWeightValue(value?: number | string | null) {
	if (value === null || value === undefined || value === '') return '—'

	const numeric = typeof value === 'string' ? Number(value) : value
	if (Number.isNaN(numeric)) return String(value)

	return `${numeric.toLocaleString('ru-RU')} т`
}

export function formatPricePerKmValue(value?: number | string | null, currency?: string | null) {
	return formatCurrencyPerKmValue(value, currency)
}
