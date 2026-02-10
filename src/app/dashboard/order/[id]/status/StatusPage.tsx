'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { useGetOrderStatusHistory } from '@/hooks/queries/orders/useGet/useGetOrderStatusHistory'
import { useI18n } from '@/i18n/I18nProvider'
import { getOrderDriverStatusName, OrderStatusEnum, type OrderDriverStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { IOrderDetail, IOrderStatusHistory } from '@/shared/types/Order.interface'

declare global {
	interface Window {
		ymaps?: any
		__yandexMapsPromise?: Promise<any>
	}
}

type StatusPageProps = {
	yandexApiKey?: string
}

type TimelineEvent = {
	id: string
	timeLabel: string
	author: string
	statusFrom: string
	statusTo: string
}

type TimelineSection = {
	id: string
	title: string
	events: TimelineEvent[]
}

type StatusHistory = IOrderStatusHistory[] | null | undefined

const EN_LOCALE = 'en-US'
const DEFAULT_LOCALE = 'ru-RU'
const TIMELINE_SKELETON_SECTION_COUNT = 3
const TIMELINE_SKELETON_EVENTS_PER_SECTION = 2
const DEFAULT_POINT: [number, number] = [41.3111, 69.2797]
const STATIC_DRIVER_POINT: [number, number] = [42.8848, 74.6111]

const TRUCK_ICON_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="21" fill="#1d4ed8"/><path d="M11 23h2a3 3 0 1 0 6 0h4a3 3 0 1 0 6 0h2v-7l-3-4h-7v2h6l1.7 2.3H23V23h-2a3 3 0 1 0-6 0h-4v-8h10v-3H9v11h2zm5 2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8zm10 0a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z" fill="#fff"/></svg>'
const TRUCK_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(TRUCK_ICON_SVG)}`

const resolveYandexLang = (locale: string) => (locale === 'en' ? 'en_US' : 'ru_RU')

const loadYandexMaps = (apiKey: string, lang: string) => {
	if (window.ymaps) return Promise.resolve(window.ymaps)
	if (window.__yandexMapsPromise) return window.__yandexMapsPromise

	window.__yandexMapsPromise = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=${lang}`
		script.async = true
		script.onload = () => {
			if (!window.ymaps) {
				reject(new Error('Yandex Maps API did not initialize'))
				return
			}
			window.ymaps.ready(() => resolve(window.ymaps))
		}
		script.onerror = () => reject(new Error('Failed to load Yandex Maps API'))
		document.head.appendChild(script)
	})

	return window.__yandexMapsPromise.catch((error) => {
		window.__yandexMapsPromise = undefined
		throw error
	})
}

const buildPointQuery = (city?: string | null, address?: string | null) => [city, address].filter(Boolean).join(', ')

const ensureYandexMultiRouterModule = (ymaps: any) =>
	new Promise<void>((resolve, reject) => {
		if (typeof ymaps?.multiRouter?.MultiRoute === 'function') {
			resolve()
			return
		}

		if (!ymaps?.modules?.require) {
			reject(new Error('Yandex Maps route module loader is unavailable'))
			return
		}

		ymaps.modules.require(
			['multiRouter.MultiRoute'],
			() => resolve(),
			(error: unknown) => reject(error instanceof Error ? error : new Error('Failed to load Yandex MultiRoute module')),
		)
	})

const buildTimelineSections = (
	history: StatusHistory,
	options: {
		t: (key: string, params?: Record<string, string>) => string
		dateFormatter: Intl.DateTimeFormat
		timeFormatter: Intl.DateTimeFormat
	},
): TimelineSection[] => {
	if (!Array.isArray(history) || history.length === 0) {
		return []
	}

	const { t, dateFormatter, timeFormatter } = options

	const parseDate = (value?: string | null) => {
		if (!value) return null
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}

	const formatSectionTitle = (date: Date | null) => {
		if (!date) return t('order.status.timeline.unknownDate')
		return dateFormatter.format(date)
	}

	const formatTimeLabel = (date: Date | null) => {
		if (!date) return t('order.status.timeline.unknownTime')
		return timeFormatter.format(date)
	}

	const normalizeStatusLabel = (value: string | null | undefined) => value?.trim() || t('order.status.timeline.notSpecified')

	const getStatusName = (value: string) => {
		const name = getOrderDriverStatusName(t, value as OrderDriverStatusEnum)
		return name || value || t('order.status.timeline.notSpecified')
	}

	const sortedHistory = [...history].sort((first, second) => {
		const firstTimestamp = parseDate(first.created_at)?.getTime() ?? 0
		const secondTimestamp = parseDate(second.created_at)?.getTime() ?? 0
		return secondTimestamp - firstTimestamp
	})

	const sections: TimelineSection[] = []
	const sectionIndexMap = new Map<string, number>()

	for (const item of sortedHistory) {
		const eventDate = parseDate(item.created_at)
		const sectionKey = eventDate ? eventDate.toISOString().slice(0, 10) : `unknown-${item.id}`
		const event: TimelineEvent = {
			id: String(item.id),
			timeLabel: formatTimeLabel(eventDate),
			author: item.user_name?.trim() || t('order.status.timeline.system'),
			statusFrom: normalizeStatusLabel(item.old_status_label),
			statusTo: normalizeStatusLabel(item.new_status_label),
		}

		const existingSectionIndex = sectionIndexMap.get(sectionKey)
		if (existingSectionIndex === undefined) {
			sectionIndexMap.set(sectionKey, sections.length)
			sections.push({ id: sectionKey, title: formatSectionTitle(eventDate), events: [event] })
		} else {
			sections[existingSectionIndex]?.events.push(event)
		}
	}

	return sections.map((section) => ({
		...section,
		events: section.events.map((event) => ({
			...event,
			statusFrom: getStatusName(event.statusFrom),
			statusTo: getStatusName(event.statusTo),
		})),
	}))
}

function EmptyTimelineState() {
	const { t } = useI18n()

	return (
		<div className='flex h-full flex-col items-center justify-center gap-2 text-center'>
			<p className='text-lg font-semibold text-foreground'>{t('order.status.empty.title')}</p>
			<p className='text-sm text-muted-foreground'>{t('order.status.empty.description')}</p>
		</div>
	)
}

function StatusPageSkeleton() {
	return (
		<div className='grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6'>
			<div className='h-full min-h-0 rounded-3xl border p-4'>
				<Skeleton className='h-full w-full rounded-2xl' />
			</div>
			<div className='flex h-full min-h-0 flex-col rounded-3xl border p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-6 w-20 rounded-full' />
				</div>
				<div className='mt-6 min-h-0 flex-1 space-y-6 overflow-auto'>
					{Array.from({ length: TIMELINE_SKELETON_SECTION_COUNT }).map((_, sectionIndex) => (
						<section key={sectionIndex} className='space-y-3'>
							<Skeleton className='h-4 w-36' />
							<div className='space-y-3'>
								{Array.from({ length: TIMELINE_SKELETON_EVENTS_PER_SECTION }).map((__, eventIndex) => (
									<Skeleton key={eventIndex} className='h-16 w-full rounded-2xl' />
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</div>
	)
}

function OrderRouteMap({ order, apiKey, locale }: { order?: IOrderDetail; apiKey?: string; locale: string }) {
	const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null)
	const [mapError, setMapError] = useState<string | null>(null)
	const [isLoadingMap, setIsLoadingMap] = useState(false)
	const [remainingKm, setRemainingKm] = useState<number | null>(null)
	const mapRef = useRef<any>(null)

	const originQuery = useMemo(
		() => buildPointQuery(order?.origin_city, order?.origin_address),
		[order?.origin_address, order?.origin_city],
	)
	const destinationQuery = useMemo(
		() => buildPointQuery(order?.destination_city, order?.destination_address),
		[order?.destination_address, order?.destination_city],
	)
	const rawOrderStatus = String(order?.status ?? '')
	const normalizedOrderStatus = rawOrderStatus === 'in_proccess' ? OrderStatusEnum.IN_PROCESS : rawOrderStatus
	const shouldShowDriverRoute =
		normalizedOrderStatus === OrderStatusEnum.PENDING || normalizedOrderStatus === OrderStatusEnum.IN_PROCESS
	useEffect(() => {
		if (!containerNode) return

		let isCancelled = false

		const initMap = async () => {
			setMapError(null)
			setRemainingKm(null)
			if (!apiKey) {
				setMapError('Yandex key is missing.')
				return
			}

			setIsLoadingMap(true)

			try {
				const ymaps = await loadYandexMaps(apiKey, resolveYandexLang(locale))
				if (isCancelled || !containerNode) return

				const map = new ymaps.Map(containerNode, {
					center: DEFAULT_POINT,
					zoom: 7,
					controls: ['zoomControl', 'fullscreenControl'],
				})
				mapRef.current = map

				const points: [number, number][] = []

				const resolvePoint = async (query: string) => {
					if (!query) return null
					const result = await ymaps.geocode(query, { results: 1 })
					const first = result.geoObjects.get(0)
					if (!first) return null
					const coords = first.geometry.getCoordinates() as [number, number]
					return { coords, name: first.properties?.get('name') ?? query }
				}

				const [originPoint, destinationPoint] = await Promise.all([resolvePoint(originQuery), resolvePoint(destinationQuery)])

				if (originPoint) {
					points.push(originPoint.coords)
					map.geoObjects.add(new ymaps.Placemark(originPoint.coords, { balloonContent: originPoint.name }))
				}

				if (destinationPoint) {
					points.push(destinationPoint.coords)
					map.geoObjects.add(new ymaps.Placemark(destinationPoint.coords, { balloonContent: destinationPoint.name }))
				}

				if (originPoint && destinationPoint) {
					map.geoObjects.add(
						new ymaps.Polyline([originPoint.coords, destinationPoint.coords], {}, {
							strokeColor: '#64748b',
							strokeWidth: 3,
							strokeOpacity: 0.7,
							strokeStyle: 'dash',
						}),
					)
				}

				const driverTargetPoint =
					normalizedOrderStatus === OrderStatusEnum.PENDING
						? originPoint?.coords
						: normalizedOrderStatus === OrderStatusEnum.IN_PROCESS
							? destinationPoint?.coords
							: null

				if (shouldShowDriverRoute && driverTargetPoint) {
					const driverPoint: [number, number] = STATIC_DRIVER_POINT
					points.push(driverPoint)
					map.geoObjects.add(
						new ymaps.Placemark(
							driverPoint,
							{ balloonContent: 'Driver (static)' },
							{
								iconLayout: 'default#image',
								iconImageHref: TRUCK_ICON_URL,
								iconImageSize: [42, 42],
								iconImageOffset: [-21, -21],
							},
						),
					)

					try {
						await ensureYandexMultiRouterModule(ymaps)
						const multiRoute = new ymaps.multiRouter.MultiRoute(
							{
								referencePoints: [driverPoint, driverTargetPoint],
								params: { routingMode: 'auto' },
							},
							{
								boundsAutoApply: true,
								wayPointVisible: false,
								viaPointVisible: false,
								routeActiveStrokeColor: '#2563eb',
								routeActiveStrokeWidth: 5,
								routeActiveStrokeOpacity: 0.9,
								routeStrokeColor: '#2563eb',
								routeStrokeWidth: 4,
								routeStrokeOpacity: 0.85,
							},
						)
						map.geoObjects.add(multiRoute)

						multiRoute.model.events.add('requestsuccess', () => {
							const activeRoute = multiRoute.getActiveRoute?.()
							const distance = activeRoute?.properties?.get('distance')
							const meters = distance?.value
							setRemainingKm(typeof meters === 'number' ? meters / 1000 : null)
							setMapError(null)
						})

						multiRoute.model.events.add('requestfail', () => {
							setRemainingKm(null)
							setMapError('Failed to build driver route')
						})
					} catch (error) {
						setMapError(error instanceof Error ? error.message : 'Failed to build driver route')
						setRemainingKm(null)
					}
				}

				if (points.length > 1) {
					map.setBounds(ymaps.util.bounds.fromPoints(points), { checkZoomRange: true, zoomMargin: 40 })
				} else if (points.length === 1) {
					map.setCenter(points[0], 12)
				}

				setTimeout(() => {
					if (mapRef.current) {
						mapRef.current.container.fitToViewport()
					}
				}, 0)
			} catch (error) {
				if (!isCancelled) {
					setMapError(error instanceof Error ? error.message : 'Failed to initialize map')
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingMap(false)
				}
			}
		}

		void initMap()

		return () => {
			isCancelled = true
			if (mapRef.current) {
				mapRef.current.destroy()
				mapRef.current = null
			}
		}
	}, [apiKey, containerNode, destinationQuery, locale, normalizedOrderStatus, originQuery, shouldShowDriverRoute])

	return (
		<section className='relative h-full min-h-0 overflow-hidden rounded-3xl border bg-muted/30'>
			<div ref={setContainerNode} className='h-full w-full' />
			{remainingKm !== null ? (
				<div className='absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm'>
					{locale === 'en' ? 'Remaining' : 'Осталось'} {remainingKm.toFixed(1)} {locale === 'en' ? 'km' : 'км'}
				</div>
			) : null}
			{isLoadingMap ? (
				<div className='absolute inset-0 grid place-items-center bg-background/40 text-sm text-muted-foreground'>
					Loading map...
				</div>
			) : null}
			{mapError ? (
				<div className='absolute inset-0 grid place-items-center bg-background/70 p-4 text-center text-sm text-destructive'>
					{mapError}
				</div>
			) : null}
		</section>
	)
}

function StatusPageView({
	t,
	locale,
	order,
	apiKey,
	timelineSections,
	hasHistory,
	orderStatusLabel,
	orderStatusVariant,
}: {
	t: (key: string, params?: Record<string, string>) => string
	locale: string
	order?: IOrderDetail
	apiKey?: string
	timelineSections: TimelineSection[]
	hasHistory: boolean
	orderStatusLabel: string
	orderStatusVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'
}) {
	return (
		<div className='grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6'>
			<OrderRouteMap order={order} apiKey={apiKey} locale={locale} />

			<section className='flex h-full min-h-0 flex-col rounded-3xl border bg-muted/20 p-4 sm:p-5'>
				<div className='flex items-center justify-between gap-3'>
					<h2 className='text-lg font-semibold text-foreground sm:text-xl'>{t('order.status.meta.title')}</h2>
					<Badge variant={orderStatusVariant}>{orderStatusLabel}</Badge>
				</div>

				<div className='mt-5 min-h-0 flex-1 overflow-auto'>
					{hasHistory ? (
						<div className='space-y-7'>
							{timelineSections.map((section) => (
								<section key={section.id} className='space-y-4'>
									<p className='text-sm font-semibold text-foreground'>{section.title}</p>
									<div className='relative pl-6'>
										<span aria-hidden className='absolute bottom-2 left-2 top-2 w-px bg-border' />
										<div className='space-y-4'>
											{section.events.map((event, eventIndex) => {
												const isLastEvent = eventIndex === section.events.length - 1

												return (
													<article key={event.id} className='relative rounded-2xl bg-background p-3'>
														<span
															aria-hidden
															className='absolute -left-[21px] top-1 size-3 rounded-full border border-brand bg-background'
														/>
														{isLastEvent ? <span aria-hidden className='absolute -left-4 bottom-0 top-7 w-px bg-muted/20' /> : null}
														<div className='flex items-start justify-between gap-3'>
															<div>
																<p className='text-sm font-semibold text-foreground'>{event.author}</p>
																<p className='mt-1 text-xs text-muted-foreground'>
																	{t('order.status.timeline.changed', {
																		from: event.statusFrom,
																		to: event.statusTo,
																	})}
																</p>
															</div>
															<p className='text-xs font-medium text-muted-foreground'>{event.timeLabel}</p>
														</div>
													</article>
												)
											})}
										</div>
									</div>
								</section>
							))}
						</div>
					) : (
						<EmptyTimelineState />
					)}
				</div>
			</section>
		</div>
	)
}

export function StatusPage({ yandexApiKey }: StatusPageProps) {
	const { t, locale } = useI18n()
	const { orderStatusHistory, isLoading } = useGetOrderStatusHistory()
	const { order, isLoading: isLoadingOrder } = useGetOrder()

	const localeTag = locale === 'en' ? EN_LOCALE : DEFAULT_LOCALE
	const dateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(localeTag, {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
		[localeTag],
	)
	const timeFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(localeTag, {
				hour: '2-digit',
				minute: '2-digit',
			}),
		[localeTag],
	)

	const timelineSections = useMemo(
		() =>
			buildTimelineSections(orderStatusHistory, {
				t,
				dateFormatter,
				timeFormatter,
			}),
		[orderStatusHistory, t, dateFormatter, timeFormatter],
	)

	const orderStatus = order?.status ?? null
	const orderStatusLabel = orderStatus ? getOrderStatusLabel(orderStatus as OrderStatusEnum, t) : t('order.status.notSet')
	const orderStatusVariant = orderStatus ? getOrderStatusVariant(orderStatus as OrderStatusEnum) : 'secondary'

	return (
		<div className='flex h-full min-h-0 flex-col rounded-3xl bg-background p-4 sm:p-6 lg:p-8'>
			{isLoading || isLoadingOrder ? (
				<StatusPageSkeleton />
			) : (
				<StatusPageView
					t={t}
					locale={locale}
					order={order}
					apiKey={yandexApiKey}
					timelineSections={timelineSections}
					hasHistory={timelineSections.length > 0}
					orderStatusLabel={orderStatusLabel}
					orderStatusVariant={orderStatusVariant}
				/>
			)}
		</div>
	)
}
