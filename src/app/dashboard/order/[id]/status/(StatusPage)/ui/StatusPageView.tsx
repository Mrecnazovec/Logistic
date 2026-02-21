'use client'

import { Badge } from '@/components/ui/Badge'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { getOrderDriverStatusName, OrderStatusEnum, type OrderDriverStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { Clock3, MapPin, UserRound } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { StatusPageViewProps, TimelineSection } from '../types'
import { EmptyTimelineState } from './EmptyTimelineState'
import { OrderRouteMap } from './OrderRouteMap'

type TimelineOnlyProps = {
	t: (key: string, params?: Record<string, string>) => string
	timelineSections: TimelineSection[]
	hasHistory: boolean
}

type MaybeOrder = StatusPageViewProps['order']

const AVERAGE_SPEED_KMH = 55
const DRIVER_STATUS_BADGE_MAP: Record<OrderDriverStatusEnum, { variant: 'info' | 'warning' | 'danger'; fallback: string }> = {
	en_route: { variant: 'info', fallback: 'En route' },
	stopped: { variant: 'warning', fallback: 'Stopped' },
	problem: { variant: 'danger', fallback: 'Problem' },
}

const uniqueCities = (cities: string[]) => {
	const seen = new Set<string>()
	const result: string[] = []
	for (const city of cities) {
		const normalized = city.trim()
		if (!normalized) continue
		const key = normalized.toLowerCase()
		if (seen.has(key)) continue
		seen.add(key)
		result.push(normalized)
	}
	return result
}

const normalizeOrderStatus = (status: string | undefined) => {
	if (!status) return ''
	return status === 'in_proccess' ? OrderStatusEnum.IN_PROCESS : status
}

const getProgressPercent = (normalizedStatus: string) => {
	if (normalizedStatus === OrderStatusEnum.IN_PROCESS) return 62
	return null
}

const getProgressPlaceholderKey = (normalizedStatus: string) => {
	if (normalizedStatus === OrderStatusEnum.DELIVERED || normalizedStatus === OrderStatusEnum.PAID) {
		return 'order.status.progress.completedDelivery'
	}
	return 'order.status.progress.notStarted'
}

const getRouteCities = (order: MaybeOrder) => {
	const orderUnsafe = (order as Record<string, unknown> | undefined) ?? {}
	const routeCitiesRaw = Array.isArray(orderUnsafe.route_cities) ? orderUnsafe.route_cities : []
	const routeCities = routeCitiesRaw.filter((value): value is string => typeof value === 'string')
	return uniqueCities([order?.origin_city ?? '', ...routeCities, order?.destination_city ?? ''])
}

const getLocaleTag = (locale: string) => {
	if (locale === 'en') return 'en-US'
	if (locale === 'uz') return 'uz-UZ'
	return 'ru-RU'
}

// TODO[TEMP_HIDE_MAPS_NON_DEV]: remove this fallback when maps are re-enabled outside development.
function TemporaryDriverStatusBranches({ t, timelineSections, hasHistory }: TimelineOnlyProps) {
	if (!hasHistory) return <EmptyTimelineState />

	return (
		<div className='space-y-8'>
			{timelineSections.map((section) => (
				<section key={section.id} className='space-y-4'>
					<h3 className='text-3xl font-semibold text-foreground'>{section.title}</h3>
					<div className='space-y-6'>
						{section.events.map((event, eventIndex) => {
							const isLastEvent = eventIndex === section.events.length - 1

							return (
								<div key={event.id} className='grid grid-cols-[50px_minmax(0,1fr)] gap-6'>
									<div className='relative pt-1 text-sm text-muted-foreground'>
										<span className='inline-block pt-5'>{event.timeLabel}</span>
										<span className='absolute left-2.5 top-2.5 size-3 rounded-full bg-brand shadow-[0_0_0_3px_rgba(37,99,235,0.2)]' />
										{!isLastEvent ? <span className='absolute left-[15px] top-6 h-[calc(100%+18px)] w-px bg-border' /> : null}
									</div>
									<div className='rounded-2xl bg-muted/50 p-2 sm:p-5'>
										<p className='text-base font-semibold text-foreground sm:text-2xl'>{event.author}</p>
										<p className='mt-4 text-sm text-muted-foreground sm:text-lg'>
											{t('order.status.timeline.changed', {
												from: event.statusFrom,
												to: event.statusTo,
											})}
										</p>
									</div>
								</div>
							)
						})}
					</div>
				</section>
			))}
		</div>
	)
}

export function StatusPageView({
	t,
	locale,
	order,
	apiKey,
	showMap = true,
	timelineSections,
	hasHistory,
	orderStatusLabel,
	orderStatusVariant,
	carrierCurrentPosition,
}: StatusPageViewProps) {
	const [remainingKmFromMap, setRemainingKmFromMap] = useState<number | null>(null)
	const [driverLocationFromMap, setDriverLocationFromMap] = useState<string | null>(null)
	const handleRemainingKmChange = useCallback((nextValue: number | null) => {
		setRemainingKmFromMap(nextValue)
	}, [])
	const handleDriverLocationChange = useCallback((nextValue: string | null) => {
		setDriverLocationFromMap(nextValue)
	}, [])

	if (!showMap) {
		return <TemporaryDriverStatusBranches t={t} timelineSections={timelineSections} hasHistory={hasHistory} />
	}

	const latestEvent = timelineSections[0]?.events[0] ?? null
	const normalizedStatus = normalizeOrderStatus(String(order?.status ?? ''))
	const progressPercent = getProgressPercent(normalizedStatus)
	const canShowProgress = progressPercent !== null
	const progressPlaceholderKey = getProgressPlaceholderKey(normalizedStatus)
	const routeCities = getRouteCities(order)
	const viaCities = routeCities.length > 2 ? routeCities.slice(1, -1) : []
	const remainingHours = remainingKmFromMap !== null ? Math.max(1, Math.ceil(remainingKmFromMap / AVERAGE_SPEED_KMH)) : null
	const remainingKmLabel =
		remainingKmFromMap !== null ? `${remainingKmFromMap.toFixed(1)} ${t('order.unit.km')}` : t('order.status.timeline.notSpecified')
	const carrierName = order?.roles?.carrier?.name?.trim() || t('order.status.timeline.system')
	const carrierId = order?.roles?.carrier?.id
	const currentDriverStatus = order?.driver_status as OrderDriverStatusEnum | undefined
	const driverStatusMeta = currentDriverStatus ? DRIVER_STATUS_BADGE_MAP[currentDriverStatus] : null
	const carrierStatusLabel =
		(currentDriverStatus ? getOrderDriverStatusName(t, currentDriverStatus) : '') ||
		driverStatusMeta?.fallback ||
		orderStatusLabel
	const carrierLocation = driverLocationFromMap?.trim()
		? driverLocationFromMap
		: carrierCurrentPosition
		? `${carrierCurrentPosition.lat.toFixed(5)}, ${carrierCurrentPosition.lng.toFixed(5)}`
		: order?.origin_city?.trim() || t('order.status.progress.locationUnknown')
	const updatedAtSource = carrierCurrentPosition?.capturedAt ?? latestEvent?.occurredAt ?? null
	const updatedAt = updatedAtSource
		? new Intl.DateTimeFormat(getLocaleTag(locale), {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(new Date(updatedAtSource))
		: t('order.status.timeline.unknownTime')

	return (
		<div className='grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6'>
			<OrderRouteMap
				order={order}
				apiKey={apiKey}
				locale={locale}
				onRemainingKmChange={handleRemainingKmChange}
				onDriverLocationChange={handleDriverLocationChange}
			/>

			<section className='flex h-full min-h-0 flex-col gap-3'>
				<section className='rounded-3xl border bg-muted/20 p-4 sm:p-5'>
					<div className='flex items-center justify-between gap-3'>
						<h2 className='text-lg font-semibold text-foreground sm:text-xl'>{t('order.status.progress.title')}</h2>
						<Badge variant={orderStatusVariant}>{orderStatusLabel}</Badge>
					</div>

					{routeCities.length > 0 ? (
						<div className='mt-5 flex items-center justify-between gap-2 text-xs text-muted-foreground'>
							{routeCities.map((city) => (
								<p key={city} className='truncate text-center font-medium'>
									{city}
								</p>
							))}
						</div>
					) : null}

					<div className='mt-3'>
						<div className='relative h-10 rounded-full bg-muted'>
							{canShowProgress ? (
								<div
									className='h-full rounded-full bg-gradient-to-r from-[#0f4acb] to-[#63aaf7] transition-all'
									style={{ width: `${Math.max(0, Math.min(progressPercent, 100))}%` }}
								/>
							) : (
								<div className='flex h-full items-center justify-center px-3 text-sm text-muted-foreground'>
									{t(progressPlaceholderKey)}
								</div>
							)}
							{canShowProgress && routeCities.length > 2
								? routeCities.slice(1, -1).map((city, index) => {
										const left = ((index + 1) / (routeCities.length - 1)) * 100
										return [
											<span key={`${city}-line`} aria-hidden className='absolute inset-y-1 w-px bg-border/70' style={{ left: `${left}%` }} />,
											<span
												key={`${city}-dot`}
												aria-hidden
												className='absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-1 ring-border'
												style={{ left: `${left}%` }}
											/>,
										]
									})
								: null}
						</div>
						{canShowProgress ? (
							<div className='mt-3 flex items-center justify-between gap-3 text-sm'>
								<p className='font-medium text-foreground'>
									{remainingHours !== null
										? t('order.status.progress.remainingHours', { hours: String(remainingHours) })
										: t('order.status.timeline.notSpecified')}
								</p>
								{viaCities.length > 0 ? (
									<p className='truncate text-muted-foreground'>
										{t('order.status.progress.via')}: {viaCities.join(' · ')}
									</p>
								) : null}
							</div>
						) : null}
					</div>
				</section>

				<section className='rounded-3xl border bg-muted/20 p-4 sm:p-5'>
					<div className='flex items-center justify-between gap-3'>
						<h3 className='text-lg font-semibold text-foreground'>{t('order.status.carrier.title')}</h3>
						<Badge variant={driverStatusMeta?.variant ?? orderStatusVariant}>{carrierStatusLabel}</Badge>
					</div>

					<div className='mt-4'>
						{carrierId ? (
							<ProfileLink id={carrierId} name={carrierName} className='text-2xl font-medium' />
						) : (
							<p className='text-2xl font-medium text-foreground'>{carrierName}</p>
						)}
					</div>
					<div className='mt-4 space-y-3 text-base text-foreground'>
						<p className='flex items-center gap-2'>
							<MapPin className='size-5 text-foreground/80' />
							<span>{carrierLocation}</span>
						</p>
						<p>
							{t('order.status.carrier.remaining')}{' '}
							<span className='font-semibold text-brand'>{remainingKmLabel}</span>
						</p>
						<p className='flex items-center gap-2 text-muted-foreground'>
							<Clock3 className='size-5' />
							<span>
								{t('order.status.carrier.updated')}: <span className='text-brand'>{updatedAt}</span>
							</span>
						</p>
					</div>
				</section>

				<section className='h-[420px] overflow-auto rounded-3xl border bg-muted/20 p-4 sm:p-5'>
					{hasHistory ? (
						<div className='space-y-7'>
							{timelineSections.map((section) => (
								<section key={section.id} className='space-y-4'>
									<p className='text-xl font-semibold text-foreground'>{section.title}</p>
									<div className='space-y-5'>
										{section.events.map((event, eventIndex) => {
											const isLastEvent = eventIndex === section.events.length - 1
											const initial = event.author.trim().charAt(0).toUpperCase() || 'S'

											return (
												<div key={event.id} className='grid grid-cols-[66px_minmax(0,1fr)] gap-3'>
													<div className='relative text-sm text-muted-foreground'>
														<p className='pt-1'>{event.timeLabel}</p>
														<span className='absolute left-1 top-8 size-3 shrink-0 rounded-full bg-brand shadow-[0_0_0_3px_rgba(37,99,235,0.2)]' />
														{!isLastEvent ? <span className='absolute left-[7px] top-11 h-[calc(100%+14px)] w-px bg-border' /> : null}
													</div>
													<article className='rounded-2xl bg-background p-4'>
														<div className='flex items-start gap-3'>
															<div className='grid size-10 shrink-0 place-items-center rounded-full bg-brand/15 text-brand'>
																{initial === 'S' ? <UserRound className='size-5' /> : <span className='text-sm font-semibold'>{initial}</span>}
															</div>
															<div>
																<p className='text-base font-semibold text-foreground'>{event.author}</p>
																<p className='mt-1.5 text-sm text-muted-foreground'>
																	{t('order.status.timeline.changed', {
																		from: event.statusFrom,
																		to: event.statusTo,
																	})}
																</p>
															</div>
														</div>
													</article>
												</div>
											)
										})}
									</div>
								</section>
							))}
						</div>
					) : (
						<EmptyTimelineState />
					)}
				</section>
			</section>
		</div>
	)
}
