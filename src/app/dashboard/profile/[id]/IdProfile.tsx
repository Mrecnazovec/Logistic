"use client"

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/Chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetRatingUser } from '@/hooks/queries/ratings/useGet/useGetRatingUser'
import { useI18n } from '@/i18n/I18nProvider'
import type { RatingUserPieChart } from '@/shared/types/Rating.interface'
import { ArrowUpRight, CalendarDays, ChartBar, Star, Truck } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Pie, PieChart } from 'recharts'

const parseNumber = (value?: number | string | null) => {
	if (value === null || value === undefined) return null
	const numericValue = typeof value === 'string' ? Number(value) : value
	return Number.isFinite(numericValue) ? numericValue : null
}

const getDaysSince = (dateValue?: string | null) => {
	if (!dateValue) return null
	const createdAt = new Date(dateValue)
	if (Number.isNaN(createdAt.getTime())) return null
	const diffMs = Date.now() - createdAt.getTime()
	return Math.max(Math.floor(diffMs / 86400000), 0)
}

type PieChartRaw = RatingUserPieChart | string | Record<string, number> | null | undefined

const parsePieChart = (value?: PieChartRaw) => {
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

const formatPlural = (locale: string, count: number, one: string, few: string, many: string) => {
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

export function IdProfile() {
	const { t, locale } = useI18n()
	const params = useParams<{ id: string }>()
	const { ratingUser, isLoading } = useGetRatingUser(params?.id)
	const [isTransportOpen, setIsTransportOpen] = useState(false)

	const integerFormatter = useMemo(
		() => new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU'),
		[locale],
	)
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
	const dealsSub = completedOrders !== null
		? t('profile.deals', { count: integerFormatter.format(completedOrders) })
		: ''
	const daysSub = registeredDays !== null
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

	if (isLoading) {
		return (
			<Card className='rounded-[32px] border-border/40 bg-background px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8'>
				<div className='flex flex-col gap-8 lg:flex-row'>
					<div className='lg:w-[38%]'>
						<div className='flex items-start gap-4'>
							<Skeleton className='size-20 rounded-full' />
							<div className='flex-1 space-y-2'>
								<Skeleton className='h-5 w-40 rounded-full' />
								<Skeleton className='h-4 w-32 rounded-full' />
							</div>
						</div>
						<div className='mt-8 space-y-4'>
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className='space-y-2'>
									<Skeleton className='h-3 w-20 rounded-full' />
									<Skeleton className='h-11 w-full rounded-3xl' />
								</div>
							))}
							<Skeleton className='h-10 w-full rounded-full' />
						</div>
					</div>
					<div className='lg:w-[62%]'>
						<div className='grid gap-4 sm:grid-cols-2'>
							{Array.from({ length: 4 }).map((_, index) => (
								<Card key={index} className='rounded-[24px] border-border/40 px-5 py-5 shadow-sm'>
									<Skeleton className='h-4 w-24 rounded-full' />
									<Skeleton className='mt-3 h-6 w-20 rounded-full' />
									<Skeleton className='mt-2 h-3 w-28 rounded-full' />
								</Card>
							))}
						</div>
					</div>
				</div>
			</Card>
		)
	}

	if (!ratingUser) {
		return (
			<Card className='rounded-[28px] border-border/50 px-6 py-8 text-center text-muted-foreground shadow-sm'>
				{t('profile.unavailable')}
			</Card>
		)
	}

	return (
		<Card className='h-full rounded-[32px] border-border/40 bg-background px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8'>
			<div className='flex items-center gap-4'>
				<NoPhoto className='size-20' />
				<div className='space-y-1'>
					<p className='text-xl font-semibold text-foreground'>{ratingUser.company_name || ratingUser.display_name}</p>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span>{t('profile.idLabel')}</span>
						<UuidCopy id={ratingUser.id} isPlaceholder />
					</div>
				</div>
			</div>

			<div className='mt-8 grid gap-6 sm:grid-cols-2'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='full-name'>
							{t('profile.field.fullName')}
						</Label>
						<Input disabled id='full-name' value={ratingUser.display_name || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='country'>
							{t('profile.field.country')}
						</Label>
						<Input disabled id='country' value={ratingUser.country || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='city'>
							{t('profile.field.city')}
						</Label>
						<Input disabled id='city' value={ratingUser.city || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
						<DialogTrigger asChild>
							<Button variant='outline' className='h-11 w-full rounded-full border-brand/40 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
								{t('profile.analytics.button')}
								<ArrowUpRight className='size-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[520px] p-6 sm:p-8'>
							<DialogHeader>
								<DialogTitle className='text-center text-xl font-semibold'>{t('profile.analytics.title')}</DialogTitle>
							</DialogHeader>
							<div className='rounded-[24px] border border-border/60 bg-background px-5 py-6 shadow-[0_10px_25px_rgba(15,23,42,0.05)] sm:px-6'>
								<p className='text-sm font-medium text-muted-foreground'>{t('profile.analytics.subtitle')}</p>
								<div className='mt-4 space-y-2 text-sm'>
									{transportChartData.map((item) => (
										<div key={item.status} className='flex items-center justify-between gap-2 text-muted-foreground'>
											<span className='flex items-center gap-2'>
												<span className='size-2 rounded-full' style={{ backgroundColor: item.fill }} />
												<span>{item.label}</span>
											</span>
											<span className='font-medium text-foreground'>{integerFormatter.format(item.value)}</span>
										</div>
									))}
								</div>
								<div className='relative mt-6'>
									<ChartContainer config={transportChartConfig} className='mx-auto max-h-[240px]'>
										<PieChart>
											<ChartTooltip content={<ChartTooltipContent hideLabel />} />
											<Pie data={transportChartData} dataKey='value' nameKey='status' innerRadius={70} strokeWidth={6} />
										</PieChart>
									</ChartContainer>
									<div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
										<span className='text-xs text-muted-foreground'>{t('profile.analytics.total')}</span>
										<span className='text-2xl font-semibold text-foreground'>{integerFormatter.format(totalTransports)}</span>
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<div className='grid gap-4 sm:grid-cols-2'>
					{stats.map((item) => (
						<Card key={item.id} className='rounded-[24px] border-border/40 px-6 py-5 shadow-sm'>
							<div className='flex items-start justify-between gap-3'>
								<div className='space-y-2'>
									<p className='text-sm text-muted-foreground'>{item.label}</p>
									<p className='text-xl font-semibold text-foreground'>{item.value}</p>
								</div>
								<div className={`flex size-11 items-center justify-center rounded-full ${item.accentClass}`}>
									<item.icon className='size-5' />
								</div>
							</div>
							<div className='mt-3 space-y-2 text-xs text-muted-foreground'>
								{item.trend ? (
									<div className='flex items-center gap-2'>
										<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.trendClass}`}>{item.trend}</span>
										<span>{item.trendLabel}</span>
									</div>
								) : null}
								{item.sub ? <p>{item.sub}</p> : null}
							</div>
						</Card>
					))}
				</div>
			</div>
		</Card>
	)
}
