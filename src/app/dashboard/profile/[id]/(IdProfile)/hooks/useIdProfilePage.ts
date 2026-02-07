'use client'

import { useGetRatingUser } from '@/hooks/queries/ratings/useGet/useGetRatingUser'
import { useI18n } from '@/i18n/I18nProvider'
import { type ChartConfig } from '@/components/ui/Chart'
import { CalendarDays, ChartBar, Star, Truck } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { formatPlural, getDaysSince, parseNumber, parsePieChart } from '../lib/profileParsers'

export function useIdProfilePage() {
	const { t, locale } = useI18n()
	const params = useParams<{ id: string }>()
	const { ratingUser, isLoading } = useGetRatingUser(params?.id)
	const [isTransportOpen, setIsTransportOpen] = useState(false)

	const integerFormatter = useMemo(() => new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU'), [locale])
	const dateFormatter = useMemo(
		() => new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
		[locale],
	)

	const transportChartConfig = useMemo<ChartConfig>(
		() => ({
			value: { label: t('profile.chart.value') },
			search: { label: t('profile.chart.search'), color: '#9CA3AF' },
			progress: { label: t('profile.chart.progress'), color: '#2563EB' },
			success: { label: t('profile.chart.success'), color: '#22C55E' },
			cancelled: { label: t('profile.chart.cancelled'), color: '#EF4444' },
		}),
		[t],
	)

	const registeredAt = ratingUser?.registered_at ? dateFormatter.format(new Date(ratingUser.registered_at)) : '-'
	const registeredDays = getDaysSince(ratingUser?.registered_at)
	const completedOrders = parseNumber(ratingUser?.completed_orders)
	const totalDistance = parseNumber(ratingUser?.total_distance)
	const ratingValue = ratingUser?.avg_rating ? ratingUser.avg_rating.toFixed(1) : '-'
	const distanceValue = totalDistance !== null ? `${integerFormatter.format(Math.round(totalDistance))} ${t('profile.unit.km')}` : '-'

	const pieChart = parsePieChart(ratingUser?.pie_chart)
	const queued = pieChart?.in_search ?? 0
	const inProgress = pieChart?.in_process ?? 0
	const completed = pieChart?.successful ?? 0
	const cancelled = pieChart?.cancelled ?? 0

	const transportChartData = [
		{ status: 'search', label: t('profile.chart.search'), value: queued, fill: 'var(--color-search)' },
		{ status: 'progress', label: t('profile.chart.progress'), value: inProgress, fill: 'var(--color-progress)' },
		{ status: 'success', label: t('profile.chart.success'), value: completed, fill: 'var(--color-success)' },
		{ status: 'cancelled', label: t('profile.chart.cancelled'), value: cancelled, fill: 'var(--color-cancelled)' },
	]

	const totalTransports = pieChart?.total ?? transportChartData.reduce((sum, item) => sum + item.value, 0)

	const ratingSub = ratingUser
		? formatPlural(
				locale,
				ratingUser.rating_count,
				t('profile.reviews.one'),
				t('profile.reviews.few'),
				t('profile.reviews.many'),
			)
		: ''
	const dealsSub = completedOrders !== null ? t('profile.deals', { count: integerFormatter.format(completedOrders) }) : ''
	const daysSub =
		registeredDays !== null
			? formatPlural(
					locale,
					registeredDays,
					t('profile.days.one'),
					t('profile.days.few'),
					t('profile.days.many'),
				)
			: ''

	const stats = [
		{
			id: 'rating',
			label: t('profile.stats.rating'),
			value: ratingValue,
			sub: ratingUser ? ratingSub : '',
			icon: Star,
			accentClass: 'text-amber-500 bg-amber-50',
			trend: ratingUser ? '+13%' : '',
			trendClass: 'text-emerald-600 bg-emerald-50',
			trendLabel: ratingUser ? t('profile.stats.lastMonth') : '',
		},
		{
			id: 'distance',
			label: t('profile.stats.distance'),
			value: distanceValue,
			sub: dealsSub,
			icon: Truck,
			accentClass: 'text-blue-600 bg-blue-100',
		},
		{
			id: 'registered',
			label: t('profile.stats.registered'),
			value: registeredAt,
			sub: daysSub,
			icon: CalendarDays,
			accentClass: 'text-sky-600 bg-sky-100',
		},
		{
			id: 'price-per-km',
			label: t('profile.stats.pricePerKm'),
			value: '-',
			sub: '',
			icon: ChartBar,
			accentClass: 'text-indigo-600 bg-indigo-100',
			trend: '',
			trendClass: 'text-rose-500 bg-rose-50',
			trendLabel: '',
		},
	]

	return {
		t,
		ratingUser,
		isLoading,
		isTransportOpen,
		setIsTransportOpen,
		integerFormatter,
		transportChartConfig,
		transportChartData,
		totalTransports,
		stats,
	}
}
