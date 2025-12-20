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
import { ArrowUpRight, CalendarDays, ChartBar, Star, Truck } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Pie, PieChart } from 'recharts'

const integerFormatter = new Intl.NumberFormat('ru-RU')
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const transportChartConfig = {
	value: { label: 'Перевозки' },
	search: { label: 'В поиске', color: '#9CA3AF' },
	progress: { label: 'В процессе', color: '#2563EB' },
	success: { label: 'Успешные', color: '#22C55E' },
	cancelled: { label: 'Отмененные', color: '#EF4444' },
} satisfies ChartConfig

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

export function IdProfile() {
	const params = useParams<{ id: string }>()
	const { ratingUser, isLoading } = useGetRatingUser(params?.id)
	const [isTransportOpen, setIsTransportOpen] = useState(false)

	const registeredAt = ratingUser?.registered_at ? dateFormatter.format(new Date(ratingUser.registered_at)) : '-'
	const registeredDays = getDaysSince(ratingUser?.registered_at)
	const completedOrders = parseNumber(ratingUser?.completed_orders)
	const totalDistance = parseNumber(ratingUser?.total_distance)
	const ratingValue = ratingUser?.avg_rating ? ratingUser.avg_rating.toFixed(1) : '-'
	const distanceValue = totalDistance !== null ? `${integerFormatter.format(Math.round(totalDistance))} км` : '-'

	const statsSummary = ratingUser?.orders_stats
	const total = statsSummary?.total ?? 0
	const queued = statsSummary?.queued ?? 0
	const inProgress = statsSummary?.in_progress ?? 0
	const completed = statsSummary?.completed ?? 0
	const inferredCancelled = Math.max(total - queued - inProgress - completed, 0)

	const transportChartData = [
		{ status: 'search', label: 'В поиске', value: queued, fill: 'var(--color-search)' },
		{ status: 'progress', label: 'В процессе', value: inProgress, fill: 'var(--color-progress)' },
		{ status: 'success', label: 'Успешные', value: completed, fill: 'var(--color-success)' },
		{ status: 'cancelled', label: 'Отмененные', value: inferredCancelled, fill: 'var(--color-cancelled)' },
	]

	const totalTransports = transportChartData.reduce((sum, item) => sum + item.value, 0)

	const stats = [
		{
			id: 'rating',
			label: 'Рейтинг',
			value: ratingValue,
			sub: ratingUser ? `${integerFormatter.format(ratingUser.rating_count)} отзывов` : '',
			icon: Star,
			accentClass: 'text-amber-500 bg-amber-50',
			trend: ratingUser ? '+13%' : '',
			trendClass: 'text-emerald-600 bg-emerald-50',
			trendLabel: ratingUser ? 'с прошлого месяца' : '',
		},
		{
			id: 'distance',
			label: 'Пройдено расстояния',
			value: distanceValue,
			sub: completedOrders !== null ? `за ${integerFormatter.format(completedOrders)} сделок` : '',
			icon: Truck,
			accentClass: 'text-blue-600 bg-blue-100',
		},
		{
			id: 'registered',
			label: 'Зарегистрирован с',
			value: registeredAt,
			sub: registeredDays !== null ? `${integerFormatter.format(registeredDays)} дней` : '',
			icon: CalendarDays,
			accentClass: 'text-sky-600 bg-sky-100',
		},
		{
			id: 'price-per-km',
			label: 'Средняя цена за км',
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
				Профиль недоступен
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
						<span>ID:</span>
						<UuidCopy id={ratingUser.id} isPlaceholder />
					</div>
				</div>
			</div>

			<div className='mt-8 grid gap-6 sm:grid-cols-2'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='full-name'>
							Ф.И.О.
						</Label>
						<Input disabled id='full-name' value={ratingUser.display_name || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='country'>
							Страна
						</Label>
						<Input disabled id='country' value={ratingUser.country || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='city'>
							Город
						</Label>
						<Input disabled id='city' value={ratingUser.city || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
						<DialogTrigger asChild>
							<Button variant='outline' className='h-11 w-full rounded-full border-brand/40 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
								Аналитика перевозок
								<ArrowUpRight className='size-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[520px] p-6 sm:p-8'>
							<DialogHeader>
								<DialogTitle className='text-center text-xl font-semibold'>Аналитика</DialogTitle>
							</DialogHeader>
							<div className='rounded-[24px] border border-border/60 bg-background px-5 py-6 shadow-[0_10px_25px_rgba(15,23,42,0.05)] sm:px-6'>
								<p className='text-sm font-medium text-muted-foreground'>Статистика перевозок</p>
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
										<span className='text-xs text-muted-foreground'>Всего перевозок</span>
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
