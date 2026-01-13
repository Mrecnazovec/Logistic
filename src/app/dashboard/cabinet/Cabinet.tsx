"use client"

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/Chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/InputOTP'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Skeleton } from '@/components/ui/Skeleton'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetAnalytics } from '@/hooks/queries/me/useGetAnalytics'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useI18n } from '@/i18n/I18nProvider'
import { useLogout } from '@/hooks/useLogout'
import { useResendVerify } from '@/hooks/queries/auth/useResendVerify'
import { useVerifyEmail } from '@/hooks/queries/auth/useVerifyEmail'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, BarChart3, ChevronDown, DoorOpen, LogOut, Pencil, Star, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from 'recharts'
import toast from 'react-hot-toast'

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

type AnalyticsBarChart = {
	labels?: string[]
	given?: number[]
	received?: number[]
	earned?: number[]
}

export function Cabinet() {
	const { t, locale } = useI18n()
	const { me, isLoading } = useGetMe()
	const { logout, isLoading: isLoadingLogout } = useLogout()
	const { resendVerify, isLoading: isResendingVerify } = useResendVerify()
	const { verifyEmail, isLoading: isVerifyingEmail } = useVerifyEmail()
	const { analytics, isLoading: isLoadingAnalytics } = useGetAnalytics()
	const [isRevenueOpen, setIsRevenueOpen] = useState(false)
	const [isTransportOpen, setIsTransportOpen] = useState(false)
	const [isEmailEditing, setIsEmailEditing] = useState(false)
	const [emailDraft, setEmailDraft] = useState('')
	const [emailCode, setEmailCode] = useState('')

	const localeTag = locale === 'ru' ? 'ru-RU' : 'en-US'
	const integerFormatter = useMemo(() => new Intl.NumberFormat(localeTag), [localeTag])
	const decimalFormatter = useMemo(
		() => new Intl.NumberFormat(localeTag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
		[localeTag],
	)
	const fullDateFormatter = useMemo(
		() => new Intl.DateTimeFormat(localeTag, { day: 'numeric', month: 'long', year: 'numeric' }),
		[localeTag],
	)

	const formatTrend = (value?: number | null) => {
		if (typeof value !== 'number') return undefined
		const normalized = Math.abs(value) < 1 && value !== 0 ? value * 100 : value
		const absoluteValue = Math.abs(normalized)
		if (absoluteValue === 0) return '0%'
		const sign = normalized > 0 ? '+' : '-'
		return `${sign}${decimalFormatter.format(absoluteValue)}%`
	}

	const transportChartConfig = useMemo<ChartConfig>(
		() => ({
			value: { label: t('cabinet.transport.label') },
			search: { label: t('cabinet.transport.search'), color: '#9CA3AF' },
			progress: { label: t('cabinet.transport.progress'), color: '#2563EB' },
			success: { label: t('cabinet.transport.success'), color: '#22C55E' },
			cancelled: { label: t('cabinet.transport.cancelled'), color: '#EF4444' },
		}),
		[t],
	)

	const incomeChartConfig = useMemo<ChartConfig>(
		() => ({
			given: { label: t('cabinet.income.given'), color: '#FCA5A5' },
			received: { label: t('cabinet.income.received'), color: '#93C5FD' },
			earned: { label: t('cabinet.income.earned'), color: '#86EFAC' },
		}),
		[t],
	)

	const fallbackIncomeChartData = useMemo(
		() => [
			{ month: t('cabinet.month.jan'), given: 5600, received: 8500, earned: 4300 },
			{ month: t('cabinet.month.feb'), given: 8800, received: 6800, earned: 200 },
			{ month: t('cabinet.month.mar'), given: 2100, received: 3900, earned: 1400 },
			{ month: t('cabinet.month.apr'), given: 5600, received: 10000, earned: 5600 },
			{ month: t('cabinet.month.may'), given: 3200, received: 6200, earned: 2100 },
			{ month: t('cabinet.month.jun'), given: 900, received: 1600, earned: 500 },
		],
		[t],
	)

	const fallbackValue = '-'
	const registrationValue = analytics ? fullDateFormatter.format(new Date(analytics.registered_since)) : fallbackValue
	const ratingValue = analytics ? decimalFormatter.format(analytics.rating) : fallbackValue
	const distanceValue = analytics
		? `${integerFormatter.format(Math.round(analytics.distance_km))} ${t('cabinet.unit.km')}`
		: fallbackValue
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
		{ status: 'search', label: t('cabinet.transport.search'), value: queued, fill: 'var(--color-search)' },
		{ status: 'progress', label: t('cabinet.transport.progress'), value: inProgress, fill: 'var(--color-progress)' },
		{ status: 'success', label: t('cabinet.transport.success'), value: completed, fill: 'var(--color-success)' },
		{ status: 'cancelled', label: t('cabinet.transport.cancelled'), value: cancelled, fill: 'var(--color-cancelled)' },
	]

	const totalTransports = pieChart?.total ?? transportChartData.reduce((sum, item) => sum + item.value, 0)

	const detailCards: AnalyticsCard[] = [
		{
			id: 'registration',
			title: t('cabinet.detail.registered'),
			value: registrationValue,
			description: analytics ? t('cabinet.detail.days', { count: analytics.days_since_registered }) : undefined,
			icon: DoorOpen,
			accentClass: 'text-indigo-600 bg-indigo-100',
		},
		{
			id: 'price-per-km',
			title: t('cabinet.detail.avgPrice'),
			value: averagePriceValue,
			trend: ratingTrend,
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
			trendLabel: analytics ? t('cabinet.detail.trendFromLastMonth') : undefined,
			icon: BarChart3,
			accentClass: 'text-blue-600 bg-blue-100',
		},
		{
			id: 'rating',
			title: t('cabinet.detail.rating'),
			value: ratingValue,
			trend: ratingTrend,
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
			trendLabel: analytics ? t('cabinet.detail.trendFromLastMonth') : undefined,
			description: analytics ? t('cabinet.detail.dealsBy', { count: integerFormatter.format(dealsCount) }) : undefined,
			icon: Star,
			accentClass: 'text-amber-500 bg-amber-50',
		},
		{
			id: 'distance',
			title: t('cabinet.detail.distance'),
			value: distanceValue,
			description: analytics ? t('cabinet.detail.dealsFor', { count: integerFormatter.format(dealsCount) }) : undefined,
			icon: Truck,
			accentClass: 'text-sky-600 bg-sky-100',
		},
	]

	const emailValue = me?.email ?? ''
	const isEmailMissing = emailValue.trim().length === 0
	const isEmailVerified = me?.is_email_verified ?? true
	const isEmailEditingActive = isEmailEditing || isEmailMissing
	const isEmailChanged = isEmailEditingActive && emailDraft.trim() !== emailValue.trim()
	const shouldShowEmailActions = isEmailEditingActive || !isEmailVerified
	const emailForActions = (isEmailEditingActive ? emailDraft : emailValue).trim()

	const profileFields = [
		{ id: 'full-name', label: t('cabinet.profile.fullName'), value: me?.first_name || me?.company_name || me?.email || '' },
		{ id: 'phone', label: t('cabinet.profile.phone'), value: me?.phone || '' },
		{ id: 'company', label: t('cabinet.profile.company'), value: me?.company_name || '' },
		{ id: 'country', label: t('cabinet.profile.country'), value: me?.profile?.country || '' },
		{ id: 'city', label: t('cabinet.profile.city'), value: me?.profile?.city || '' },
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
			<h1 className='sr-only'>{t('cabinet.title')}</h1>

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
									<Image src={me.photo} alt={t('cabinet.photoAlt')} width={96} height={96} className='size-24 rounded-full object-cover' />
								) : (
									<NoPhoto className='size-24' />
								)}
								<p className='text-base font-semibold text-foreground'>{me?.company_name || me?.first_name || me?.email}</p>

								<p className='text-xs text-muted-foreground'>
									{me?.first_name && me?.email ? me.email : me?.profile?.city || me?.profile?.country || ''}
								</p>
								<div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
									<span className='text-xs text-muted-foreground'>{t('cabinet.profile.id')}:</span>
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
								{t('cabinet.edit')}
							</Button>
						</Link>
						{profileFields.length ? (
							<div className='space-y-2'>
								<Label className='text-xs text-muted-foreground' htmlFor={profileFields[0].id}>
									{profileFields[0].label}
								</Label>
								{isLoading ? (
									<Skeleton className='h-11 w-full rounded-3xl' />
								) : (
									<Input
										disabled
										value={profileFields[0].value}
										id={profileFields[0].id}
										className='disabled:opacity-100'
										placeholder={profileFields[0].label}
									/>
								)}
							</div>
						) : null}

						<div className='space-y-2'>
							<div className='flex items-center justify-between gap-2'>
								<Label className='text-xs text-muted-foreground' htmlFor='email'>
									{t('cabinet.profile.email')}
								</Label>
							{!isEmailMissing && !isEmailEditing ? (
								<Button
									type='button'
									variant='link'
									size='sm'
									className='h-auto px-0 text-xs text-brand'
									onClick={() => {
										setEmailDraft(emailValue)
										setIsEmailEditing(true)
									}}
								>
									{t('cabinet.profile.emailEdit')}
								</Button>
							) : null}
						</div>
						{isLoading ? (
							<Skeleton className='h-11 w-full rounded-3xl' />
						) : (
							<Input
								id='email'
								value={isEmailEditingActive ? emailDraft : emailValue}
								disabled={!isEmailEditingActive}
								onChange={(event) => setEmailDraft(event.target.value)}
								className='rounded-3xl bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80 disabled:opacity-100'
								placeholder={t('cabinet.profile.emailPlaceholder')}
							/>
						)}
							{!isEmailVerified ? (
								<p className='text-xs text-warning-600'>{t('cabinet.profile.emailNeedsVerify')}</p>
							) : null}
							{shouldShowEmailActions ? (
								<div className='space-y-3 pt-2'>
									<div className='flex flex-wrap gap-2'>
										<Button
											type='button'
											variant='outline'
											disabled={isResendingVerify || emailForActions.length === 0}
											onClick={() => {
												if (!emailForActions) {
													toast.error(t('cabinet.profile.emailRequired'))
													return
												}
												resendVerify(isEmailChanged ? emailDraft.trim() : emailForActions)
											}}
										>
											{t('cabinet.profile.emailSendCode')}
										</Button>
										{isEmailEditing ? (
											<Button
												type='button'
												variant='outline'
												disabled={isResendingVerify || isVerifyingEmail}
												onClick={() => {
													setIsEmailEditing(false)
													setEmailDraft(emailValue)
												setEmailCode('')
											}}
										>
											{t('cabinet.profile.emailCancel')}
										</Button>
										) : null}
									</div>
									<div className='flex justify-center'>
										<InputOTP maxLength={6} value={emailCode} onChange={setEmailCode}>
											<InputOTPGroup>
												{Array.from({ length: 6 }).map((_, index) => (
													<InputOTPSlot key={`email-otp-${index}`} index={index} />
												))}
											</InputOTPGroup>
										</InputOTP>
									</div>
									<Button
										type='button'
										disabled={isVerifyingEmail || emailCode.trim().length < 6 || emailForActions.length === 0}
										onClick={() => {
											if (!emailForActions) {
												toast.error(t('cabinet.profile.emailRequired'))
												return
											}
											verifyEmail(
												{ email: emailForActions, code: emailCode.trim() },
												{
													onSuccess: () => {
														setEmailCode('')
														setIsEmailEditing(false)
													},
												}
											)
										}}
									>
										{t('cabinet.profile.emailVerify')}
									</Button>
								</div>
							) : null}
						</div>

						{profileFields.slice(1).map((field) => (
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
						<h2 className='text-lg font-semibold text-brand'>{t('cabinet.analytics.title')}</h2>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						{detailCards.map((card) => renderDetailCard(card))}
						<Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
							<DialogTrigger asChild>
								<Button variant='outline' className='h-10 border-brand/40 px-5 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
									{t('cabinet.analytics.revenue')}
									<ArrowUpRight className='size-4' />
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-[860px] p-6 sm:p-8'>
								<DialogHeader>
									<DialogTitle className='text-center text-xl font-semibold'>{t('cabinet.analytics.dialogTitle')}</DialogTitle>
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
												{t('cabinet.analytics.periodHalf')}
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
										<p className='text-sm text-muted-foreground'>{t('cabinet.analytics.earned')}</p>
										<ChartContainer config={incomeChartConfig} className='h-[260px] w-full aspect-auto'>
											<BarChart data={incomeChartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
												<CartesianGrid strokeDasharray='3 3' vertical={false} />
												<XAxis dataKey='month' axisLine={false} tickLine={false} />
												<YAxis
													axisLine={false}
													tickLine={false}
													width={32}
													tickFormatter={(value) => t('cabinet.chart.thousand', { value: Math.round(value / 1000) })}
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
									{t('cabinet.analytics.transport')}
									<ArrowUpRight className='size-4' />
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-[520px] p-6 sm:p-8'>
								<DialogHeader>
									<DialogTitle className='text-center text-xl font-semibold'>{t('cabinet.analytics.dialogTitle')}</DialogTitle>
								</DialogHeader>
								<div className='rounded-[24px] border border-border/60 bg-background px-5 py-6 shadow-[0_10px_25px_rgba(15,23,42,0.05)] sm:px-6'>
									<p className='text-sm font-medium text-muted-foreground'>{t('cabinet.analytics.transportStats')}</p>
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
											<span className='text-xs text-muted-foreground'>{t('cabinet.analytics.totalTransports')}</span>
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
