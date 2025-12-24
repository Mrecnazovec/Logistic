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
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetAnalytics } from '@/hooks/queries/me/useGetAnalytics'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useLogout } from '@/hooks/useLogout'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, BarChart3, ChevronDown, DoorOpen, LogOut, Pencil, Star, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from 'recharts'

type AnalyticsCard = {
	id: string
	title: string
	value: string
	icon: LucideIcon
	accentClass: string
	trend?: string
	trendVariant?: 'success' | 'danger'
	trendLabel?: string
	description?: string
}

const integerFormatter = new Intl.NumberFormat('ru-RU')
const decimalFormatter = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const transportChartConfig = {
	value: { label: 'Перевозки' },
	search: { label: 'В поиске', color: '#9CA3AF' },
	progress: { label: 'В процессе', color: '#2563EB' },
	success: { label: 'Успешные', color: '#22C55E' },
	cancelled: { label: 'Отмененные', color: '#EF4444' },
} satisfies ChartConfig

const incomeChartConfig = {
	given: { label: 'Отдал', color: '#FCA5A5' },
	received: { label: 'Получил', color: '#93C5FD' },
	earned: { label: 'Заработок', color: '#86EFAC' },
} satisfies ChartConfig

const fallbackIncomeChartData = [
	{ month: 'Янв', given: 5600, received: 8500, earned: 4300 },
	{ month: 'Фев', given: 8800, received: 6800, earned: 200 },
	{ month: 'Мар', given: 2100, received: 3900, earned: 1400 },
	{ month: 'Апр', given: 5600, received: 10000, earned: 5600 },
	{ month: 'Май', given: 3200, received: 6200, earned: 2100 },
	{ month: 'Июн', given: 900, received: 1600, earned: 500 },
]

type AnalyticsBarChart = {
	labels?: string[]
	given?: number[]
	received?: number[]
	earned?: number[]
}

const formatTrend = (value?: number | null) => {
	if (typeof value !== 'number') return undefined
	const normalized = Math.abs(value) < 1 && value !== 0 ? value * 100 : value
	const absoluteValue = Math.abs(normalized)
	if (absoluteValue === 0) return '0%'
	const sign = normalized > 0 ? '+' : '-'
	return `${sign}${decimalFormatter.format(absoluteValue)}%`
}

export function Cabinet() {
	const { me, isLoading } = useGetMe()
	const { logout, isLoading: isLoadingLogout } = useLogout()
	const { analytics, isLoading: isLoadingAnalytics } = useGetAnalytics()
	const [isRevenueOpen, setIsRevenueOpen] = useState(false)
	const [isTransportOpen, setIsTransportOpen] = useState(false)

	const fallbackValue = '-'
	const registrationValue = analytics ? fullDateFormatter.format(new Date(analytics.registered_since)) : fallbackValue
	const ratingValue = analytics ? decimalFormatter.format(analytics.rating) : fallbackValue
	const distanceValue = analytics ? `${integerFormatter.format(Math.round(analytics.distance_km))} км` : fallbackValue
	const dealsCount = analytics?.deals_count ?? 0
	const averagePriceValue = fallbackValue
	const ratingTrend = formatTrend(analytics?.successful_deliveries_change)
	const analyticsBarChart = analytics?.bar_chart as AnalyticsBarChart | undefined
	const barChartLabels = Array.isArray(analyticsBarChart?.labels) ? analyticsBarChart.labels : []
	const hasBarChartLabels = barChartLabels.length > 0
	const incomeChartData = hasBarChartLabels
		? barChartLabels.map((label, index) => ({
				month: label,
				given: analyticsBarChart?.given?.[index] ?? 0,
				received: analyticsBarChart?.received?.[index] ?? 0,
				earned: analyticsBarChart?.earned?.[index] ?? 0,
			}))
		: fallbackIncomeChartData

	const pieChart = analytics?.pie_chart as
		| {
				in_search?: number
				in_process?: number
				successful?: number
				cancelled?: number
				total?: number
		  }
		| undefined
	const queued = pieChart?.in_search ?? 0
	const inProgress = pieChart?.in_process ?? 0
	const completed = pieChart?.successful ?? 0
	const cancelled = pieChart?.cancelled ?? 0

	const transportChartData = [
		{ status: 'search', label: 'В поиске', value: queued, fill: 'var(--color-search)' },
		{ status: 'progress', label: 'В процессе', value: inProgress, fill: 'var(--color-progress)' },
		{ status: 'success', label: 'Успешные', value: completed, fill: 'var(--color-success)' },
		{ status: 'cancelled', label: 'Отмененные', value: cancelled, fill: 'var(--color-cancelled)' },
	]

	const totalTransports = pieChart?.total ?? transportChartData.reduce((sum, item) => sum + item.value, 0)

	const detailCards: AnalyticsCard[] = [
		{
			id: 'registration',
			title: 'Зарегистрирован с',
			value: registrationValue,
			description: analytics ? `${analytics.days_since_registered} дней` : undefined,
			icon: DoorOpen,
			accentClass: 'text-indigo-600 bg-indigo-100',
		},
		{
			id: 'price-per-km',
			title: 'Средняя цена за км',
			value: averagePriceValue,
			trend: ratingTrend,
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
			trendLabel: analytics ? 'с прошлого месяца' : undefined,
			icon: BarChart3,
			accentClass: 'text-blue-600 bg-blue-100',
		},
		{
			id: 'rating',
			title: 'Рейтинг',
			value: ratingValue,
			trend: ratingTrend,
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
			trendLabel: analytics ? 'с прошлого месяца' : undefined,
			description: analytics ? `по ${integerFormatter.format(dealsCount)} сделкам` : undefined,
			icon: Star,
			accentClass: 'text-amber-500 bg-amber-50',
		},
		{
			id: 'distance',
			title: 'Пройдено расстояния',
			value: distanceValue,
			description: analytics ? `за ${integerFormatter.format(dealsCount)} сделок` : undefined,
			icon: Truck,
			accentClass: 'text-sky-600 bg-sky-100',
		},
	]

	const profileFields = [
		{ id: 'full-name', label: 'Ф.И.О.', value: me?.first_name || me?.company_name || me?.email || '' },
		{ id: 'email', label: 'Email', value: me?.email || '' },
		{ id: 'phone', label: 'Номер телефона', value: me?.phone || '' },
		{ id: 'company', label: 'Название компании', value: me?.company_name || '' },
		{ id: 'country', label: 'Страна', value: me?.profile?.country || '' },
		{ id: 'city', label: 'Город', value: me?.profile?.city || '' },
	]

	const renderDetailCard = (card: AnalyticsCard) => {
		const Icon = card.icon
		return (
			<Card key={card.id} className='gap-3 rounded-[24px] border-border/40 px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]'>
				<div className='flex items-start justify-between gap-4'>
					<div className='space-y-1.5'>
						<p className='text-xs text-muted-foreground'>{card.title}</p>
						{isLoadingAnalytics ? (
							<Skeleton className='h-7 w-24 rounded-2xl' />
						) : (
							<p className='text-xl font-semibold text-foreground'>{card.value}</p>
						)}
					</div>
					<div className={`flex size-11 shrink-0 items-center justify-center rounded-full ${card.accentClass}`}>
						<Icon className='size-5' />
					</div>
				</div>
				<div className='mt-3 space-y-1'>
					{isLoadingAnalytics ? (
						<Skeleton className='h-3.5 w-28 rounded-full' />
					) : (
						<>
							{card.trend ? (
								<p className={`text-xs ${card.trendVariant === 'danger' ? 'text-rose-500' : 'text-emerald-600'}`}>
									{card.trend} {card.trendLabel}
								</p>
							) : null}
							{card.description ? <p className='text-xs text-muted-foreground'>{card.description}</p> : null}
						</>
					)}
				</div>
			</Card>
		)
	}

	return (
		<div className='flex h-full flex-col gap-4 lg:flex-row lg:gap-6'>
			<h1 className='sr-only'>Личный кабинет</h1>

			<div className='lg:w-[32%] xl:w-[30%]'>
				<Card className='h-full items-center rounded-[32px] border-none bg-background px-6 py-8 gap-0'>
					<div className='centred w-full flex-col gap-3 text-center relative'>
						{isLoading ? (
							<>
								<Skeleton className='size-24 rounded-full' />
								<Skeleton className='h-4 w-32 rounded-full' />
								<Skeleton className='h-6 w-40 rounded-full' />
							</>
						) : (
							<>
								{me?.photo ? (
									<Image src={me.photo} alt='Фото профиля' width={96} height={96} className='size-24 rounded-full object-cover' />
								) : (
									<NoPhoto className='size-24' />
								)}
								<p className='text-base font-semibold text-foreground'>{me?.company_name || me?.first_name || me?.email}</p>

								<p className='text-xs text-muted-foreground'>
									{me?.first_name && me?.email ? me.email : me?.profile?.city || me?.profile?.country || ''}
								</p>
								<div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
									<span className='text-xs text-muted-foreground'>ID:</span>
									<UuidCopy id={me?.id} isPlaceholder />
								</div>
								<Button
									onClick={() => logout('')}
									size='icon'
									className='bg-error-500 hover:bg-error-400 absolute right-0 top-0 rounded-2xl'
									disabled={isLoadingLogout}
								>
									<LogOut />
								</Button>
							</>
						)}
					</div>

					<div className='mt-10 w-full space-y-4'>
						<Link className='flex justify-end' href={DASHBOARD_URL.settings()}>
							<Button variant='link' size='sm' className='h-auto px-0 text-xs text-brand'>
								<Pencil className='size-3.5' />
								Изменить
							</Button>
						</Link>
						{profileFields.map((field) => (
							<div key={field.id} className='space-y-2'>
								<Label className='text-xs text-muted-foreground' htmlFor={field.id}>
									{field.label}
								</Label>
								{isLoading ? (
									<Skeleton className='h-11 w-full rounded-3xl' />
								) : (
									<Input disabled value={field.value} id={field.id} className='disabled:opacity-100' placeholder={field.label} />
								)}
							</div>
						))}
					</div>
				</Card>
			</div>

			<div className='lg:w-[68%] xl:w-[70%]'>
				<Card className='flex h-full flex-col gap-6 rounded-[32px] border-border/60 bg-background px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8'>
					<div className='flex items-center justify-between gap-3'>
						<h2 className='text-lg font-semibold text-brand'>Аналитика</h2>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						{detailCards.map((card) => renderDetailCard(card))}
					</div>

					<div className='mt-auto flex flex-wrap gap-3'>

						<Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
							<DialogTrigger asChild>
								<Button variant='outline' className='h-10 border-brand/40 px-5 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
									Аналитика доходов
									<ArrowUpRight className='size-4' />
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-[860px] p-6 sm:p-8'>
								<DialogHeader>
									<DialogTitle className='text-center text-xl font-semibold'>Аналитика</DialogTitle>
								</DialogHeader>
								<div className='space-y-4'>
									<div className='flex flex-wrap items-center justify-between gap-3'>
										<div className='flex flex-wrap gap-3'>
											<Button
												type='button'
												variant='outline'
												className='h-10 rounded-full border-transparent bg-muted/40 px-4 text-sm text-foreground hover:bg-muted/60'
											>
												2024
												<ChevronDown className='size-4 text-muted-foreground' />
											</Button>
											<Button
												type='button'
												variant='outline'
												className='h-10 rounded-full border-transparent bg-muted/40 px-4 text-sm text-foreground hover:bg-muted/60'
											>
												1-ая половина
												<ChevronDown className='size-4 text-muted-foreground' />
											</Button>
										</div>
										<div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
											{Object.entries(incomeChartConfig).map(([key, item]) => (
												<div key={key} className='flex items-center gap-2'>
													<span className='size-2 rounded-full' style={{ backgroundColor: item.color }} />
													<span>{item.label}</span>
												</div>
											))}
										</div>
									</div>
									<Card className='gap-4 rounded-[24px] border-border/60 bg-background px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:px-6'>
										<p className='text-sm text-muted-foreground'>Заработано</p>
										<ChartContainer config={incomeChartConfig} className='h-[260px] w-full aspect-auto'>
											<BarChart data={incomeChartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
												<CartesianGrid strokeDasharray='3 3' vertical={false} />
												<XAxis dataKey='month' axisLine={false} tickLine={false} />
												<YAxis
													axisLine={false}
													tickLine={false}
													width={32}
													tickFormatter={(value) => `${Math.round(value / 1000)}к$`}
												/>
												<ChartTooltip content={<ChartTooltipContent hideLabel />} />
												<Bar dataKey='given' fill='var(--color-given)' radius={[8, 8, 0, 0]} barSize={10} />
												<Bar dataKey='received' fill='var(--color-received)' radius={[8, 8, 0, 0]} barSize={10} />
												<Bar dataKey='earned' fill='var(--color-earned)' radius={[8, 8, 0, 0]} barSize={10} />
											</BarChart>
										</ChartContainer>
									</Card>
								</div>
							</DialogContent>
						</Dialog>
						<Dialog open={isRevenueOpen} onOpenChange={setIsRevenueOpen}>
							<DialogTrigger asChild>
								<Button variant='outline' className='h-10 border-brand/40 px-5 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
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
												<Pie
													data={transportChartData}
													dataKey='value'
													nameKey='status'
													innerRadius={70}
													strokeWidth={6}
												/>
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
				</Card>
			</div>
		</div>
	)
}
