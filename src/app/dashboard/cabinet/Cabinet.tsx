"use client"

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetAnalytics } from '@/hooks/queries/me/useGetAnalytics'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useLogout } from '@/hooks/useLogout'
import type { LucideIcon } from 'lucide-react'
import { BarChart3, DoorOpen, PackageCheck, Star, Truck } from 'lucide-react'
import Image from 'next/image'
import type { CSSProperties } from 'react'

 type AnalyticsCard = {
	id: string
	title: string
	value: string
	icon: LucideIcon
	accentClass: string
	trend?: string
	trendVariant?: 'success' | 'danger'
	description?: string
}

 type OrdersStats = {
	total: string
	successful: string
	cancelled: string
	successPercentLabel: string
	donutStyle: CSSProperties
	legend: { id: string; label: string; color: string; value: string }[]
}

const integerFormatter = new Intl.NumberFormat('ru-RU')
const decimalFormatter = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

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

	const fallbackValue = '-'
	const successfulDeliveries = analytics?.successful_deliveries ?? 0
	const registrationValue = analytics ? fullDateFormatter.format(new Date(analytics.registered_since)) : fallbackValue
	const ratingValue = analytics ? decimalFormatter.format(analytics.rating) : fallbackValue
	const distanceValue = analytics ? `${integerFormatter.format(Math.round(analytics.distance_km))} км` : fallbackValue
	const dealsCount = analytics?.deals_count ?? 0
	const dealsValue = analytics ? integerFormatter.format(dealsCount) : fallbackValue
	const cancelledDeliveries = Math.max(dealsCount - successfulDeliveries, 0)
	const successPercent = dealsCount ? Math.round((successfulDeliveries / dealsCount) * 100) : 0

	const shipmentCard: AnalyticsCard = {
		id: 'shipments',
		title: 'Успешные перевозки',
		value: analytics ? integerFormatter.format(successfulDeliveries) : fallbackValue,
		trend: formatTrend(analytics?.successful_deliveries_change),
		trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
		description: analytics ? 'с прошлого месяца' : undefined,
		icon: PackageCheck,
		accentClass: 'text-sky-600 bg-sky-100',
	}

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
			id: 'rating',
			title: 'Рейтинг',
			value: ratingValue,
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
			accentClass: 'text-blue-700 bg-blue-100',
		},
		{
			id: 'deals',
			title: 'Всего сделок',
			value: dealsValue,
			description: analytics ? `успешные: ${integerFormatter.format(successfulDeliveries)}` : undefined,
			icon: BarChart3,
			accentClass: 'text-brand bg-brand/10',
		},
	]

	const ordersStats: OrdersStats = {
		total: integerFormatter.format(dealsCount),
		successful: integerFormatter.format(successfulDeliveries),
		cancelled: integerFormatter.format(cancelledDeliveries),
		successPercentLabel: `${successPercent}%`,
		donutStyle: dealsCount
			? { backgroundImage: `conic-gradient(#10b981 0% ${successPercent}%, #f43f5e ${successPercent}% 100%)` }
			: { backgroundImage: 'conic-gradient(#e2e8f0 0% 100%)' },
		legend: [
			{ id: 'success', label: 'Успешные', color: 'bg-emerald-500', value: integerFormatter.format(successfulDeliveries) },
			{ id: 'cancelled', label: 'Отмененные', color: 'bg-rose-500', value: integerFormatter.format(cancelledDeliveries) },
			{ id: 'total', label: 'Всего перевозок', color: 'bg-slate-400', value: integerFormatter.format(dealsCount) },
		],
	}

	const profileFields = [
		{ id: 'full-name', label: 'Ф.И.О.', value: me?.first_name || me?.company_name || me?.email || '' },
		{ id: 'email', label: 'Email', value: me?.email || '' },
		{ id: 'phone', label: 'Номер телефона', value: me?.phone || '' },
		{ id: 'company', label: 'Название компании', value: me?.company_name || '' },
		{ id: 'country', label: 'Страна', value: me?.profile?.country || '' },
		{ id: 'city', label: 'Город', value: me?.profile?.city || '' },
	]

	const RegistrationIcon = detailCards[0].icon
	const RatingIcon = detailCards[1].icon
	const DistanceIcon = detailCards[2].icon
	const DealsIcon = detailCards[3].icon
	const ShipmentIcon = shipmentCard.icon

	const renderDetailCard = (card: AnalyticsCard, Icon: LucideIcon) => (
		<Card key={card.id} className='rounded-[28px] border-border/40 px-6 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]'>
			<div className='flex items-start justify-between gap-4'>
				<div className='space-y-1.5'>
					<p className='text-sm text-muted-foreground'>{card.title}</p>
					{isLoadingAnalytics ? <Skeleton className='h-9 w-24 rounded-2xl' /> : <p className='text-2xl font-semibold'>{card.value}</p>}
				</div>
				<div className={`flex size-11 shrink-0 items-center justify-center rounded-full ${card.accentClass}`}>
					<Icon className='size-5' />
				</div>
			</div>
			<div className='mt-4'>
				{isLoadingAnalytics ? (
					<Skeleton className='h-4 w-28 rounded-full' />
				) : card.description ? (
					<p className='text-sm text-muted-foreground'>{card.description}</p>
				) : null}
			</div>
		</Card>
	)

	return (
		<div className='flex h-full flex-col gap-4 lg:flex-row lg:gap-6'>
			<h1 className='sr-only'>Личный кабинет</h1>

			<div className='lg:w-[32%] xl:w-[30%]'>
				<Card className='h-full items-center rounded-[32px] border-border/60 bg-background px-6 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.06)]'>
					<div className='centred w-full flex-col gap-3 text-center'>
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
								<p className='text-lg font-semibold'>{me?.company_name || me?.first_name || me?.email}</p>
								<p className='text-sm text-muted-foreground'>
									{me?.first_name && me?.email ? me.email : me?.profile?.city || me?.profile?.country || ''}
								</p>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<UuidCopy id={me?.id} isPlaceholder />
								</div>
								<Button
									onClick={() => logout('')}
									variant='destructive'
									size='sm'
									className='mt-2 rounded-full px-5'
									disabled={isLoadingLogout}
								>
									Выйти из аккаунта
								</Button>
							</>
						)}
					</div>

					<div className='mt-10 w-full space-y-4'>
						{profileFields.map((field) => (
							<div key={field.id} className='space-y-2'>
								<Label className='text-sm text-muted-foreground' htmlFor={field.id}>
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
				<div className='flex h-full flex-col gap-6 rounded-[32px] bg-background p-4 xs:p-6 xl:p-8'>
					<div className='flex flex-wrap items-center justify-between gap-3'>
						<h2 className='text-2xl font-bold text-brand'>Аналитика</h2>
						{!isLoadingAnalytics && shipmentCard.trend ? (
							<Badge variant={shipmentCard.trendVariant === 'danger' ? 'danger' : 'success'} className='before:hidden px-3 py-1.5 text-xs'>
								{shipmentCard.trend} с прошлого месяца
							</Badge>
						) : null}
					</div>

					<div className='grid gap-4 md:grid-cols-2 md:gap-6'>
						<Card className='rounded-[28px] border-border/40 px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]'>
							<div className='flex flex-wrap items-start justify-between gap-4'>
								<div className='space-y-2'>
									<p className='text-sm text-muted-foreground'>{shipmentCard.title}</p>
									{isLoadingAnalytics ? (
										<Skeleton className='h-11 w-32 rounded-3xl' />
									) : (
										<p className='text-4xl font-semibold tracking-tight'>{shipmentCard.value}</p>
									)}
								</div>
								<div className={`flex size-14 items-center justify-center rounded-full ${shipmentCard.accentClass}`}>
									<ShipmentIcon className='size-6' />
								</div>
							</div>
							<div className='mt-6 flex flex-wrap items-center gap-4'>
								{isLoadingAnalytics ? (
									<Skeleton className='h-7 w-32 rounded-full' />
								) : shipmentCard.trend ? (
									<Badge variant={shipmentCard.trendVariant === 'danger' ? 'danger' : 'success'} className='before:hidden px-3 py-1 text-xs'>
										{shipmentCard.trend} с прошлого месяца
									</Badge>
								) : null}
								{isLoadingAnalytics ? (
									<Skeleton className='h-4 w-40 rounded-full' />
								) : shipmentCard.description ? (
									<p className='text-sm text-muted-foreground'>{shipmentCard.description}</p>
								) : null}
							</div>
						</Card>

						{[RegistrationIcon, RatingIcon, DistanceIcon].map((Icon, index) => renderDetailCard(detailCards[index], Icon))}

						<Card className='rounded-[28px] border-border/40 px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]'>
							{isLoadingAnalytics ? (
								<div className='flex flex-col gap-4'>
									<Skeleton className='h-4 w-32 rounded-full' />
									<Skeleton className='h-9 w-48 rounded-2xl' />
									<Skeleton className='h-32 w-full rounded-3xl' />
								</div>
							) : (
								<div className='space-y-6'>
									<div className='space-y-1'>
										<p className='text-sm text-muted-foreground'>Статистика перевозок</p>
										<p className='text-lg font-semibold'>Успешные: {ordersStats.successPercentLabel}</p>
									</div>
									<div className='flex flex-wrap items-center gap-6 sm:flex-row sm:items-center sm:justify-center'>
										<div className='relative size-40 min-h-40 min-w-40 shrink-0 rounded-full p-3' style={ordersStats.donutStyle} aria-hidden='true'>
											<div className='absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-background shadow-inner'>
												<span className='text-3xl font-semibold'>{ordersStats.total}</span>
												<span className='text-center text-sm text-muted-foreground'>Всего перевозок</span>
											</div>
										</div>
										<div className='w-full space-y-3 sm:max-w-[240px]'>
											{ordersStats.legend.map((item) => (
												<div key={item.id} className='flex items-center justify-between text-sm font-medium'>
													<span className='flex items-center gap-2 text-muted-foreground'>
														<span className={`size-2.5 rounded-full ${item.color}`} aria-hidden='true' />
														{item.label}
													</span>
													<span className='font-semibold text-foreground'>{item.value}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</Card>

						{renderDetailCard(detailCards[3], DealsIcon)}
					</div>
				</div>
			</div>
		</div>
	)
}
