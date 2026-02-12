'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { DEFAULT_POINT, DRIVER_ROUTE_STYLES, STATIC_DRIVER_POINT, TRUCK_ICON_URL } from '../constants'
import { buildPointQuery, ensureYandexMultiRouterModule, loadYandexMaps, resolveYandexLang } from '../lib/map'
import type { OrderRouteMapProps } from '../types'

export function OrderRouteMap({ order, apiKey, locale }: OrderRouteMapProps) {
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
								routeActiveStrokeColor: DRIVER_ROUTE_STYLES.activeStrokeColor,
								routeActiveStrokeWidth: DRIVER_ROUTE_STYLES.activeStrokeWidth,
								routeActiveStrokeOpacity: DRIVER_ROUTE_STYLES.activeStrokeOpacity,
								routeStrokeColor: DRIVER_ROUTE_STYLES.strokeColor,
								routeStrokeWidth: DRIVER_ROUTE_STYLES.strokeWidth,
								routeStrokeOpacity: DRIVER_ROUTE_STYLES.strokeOpacity,
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
