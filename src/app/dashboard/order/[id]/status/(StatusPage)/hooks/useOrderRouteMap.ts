import { useEffect, useMemo, useRef, useState } from 'react'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { DEFAULT_POINT, DRIVER_ROUTE_STYLES, STATIC_DRIVER_POINT, TRUCK_ICON_URL } from '../constants'
import { buildPointQuery, ensureYandexMultiRouterModule, loadYandexMaps, resolveYandexLang } from '../lib/map'
import type { OrderRouteMapProps } from '../types'

const MAP_CONTROLS = [
	'zoomControl',
	'geolocationControl',
	'fullscreenControl',
	'trafficControl',
	'routeButtonControl',
	'typeSelector',
	'rulerControl',
] as const

type UseOrderRouteMapParams = Pick<OrderRouteMapProps, 'order' | 'apiKey' | 'locale' | 'onRemainingKmChange' | 'onDriverLocationChange'>

const toFiniteNumber = (value: unknown): number | null => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null
	if (typeof value === 'string') {
		const parsed = Number(value)
		return Number.isFinite(parsed) ? parsed : null
	}
	return null
}

export function useOrderRouteMap({ order, apiKey, locale, onRemainingKmChange, onDriverLocationChange }: UseOrderRouteMapParams) {
	const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null)
	const [mapError, setMapError] = useState<string | null>(null)
	const [isLoadingMap, setIsLoadingMap] = useState(false)
	const [isTouchDevice, setIsTouchDevice] = useState(false)
	const [showTouchHint, setShowTouchHint] = useState(false)
	const mapRef = useRef<any>(null)

	const originQuery = useMemo(
		() => buildPointQuery(order?.origin_city, order?.origin_address),
		[order?.origin_address, order?.origin_city],
	)
	const destinationQuery = useMemo(
		() => buildPointQuery(order?.destination_city, order?.destination_address),
		[order?.destination_address, order?.destination_city],
	)
	const originCoordsFromOrder = useMemo(() => {
		const source = order as unknown as { origin_lat?: unknown; origin_lng?: unknown }
		const lat = toFiniteNumber(source?.origin_lat)
		const lng = toFiniteNumber(source?.origin_lng)
		return lat !== null && lng !== null ? ([lat, lng] as [number, number]) : null
	}, [order])
	const destinationCoordsFromOrder = useMemo(() => {
		const source = order as unknown as { dest_lat?: unknown; dest_lng?: unknown }
		const lat = toFiniteNumber(source?.dest_lat)
		const lng = toFiniteNumber(source?.dest_lng)
		return lat !== null && lng !== null ? ([lat, lng] as [number, number]) : null
	}, [order])
	const driverCoordsFromOrder = useMemo(() => {
		const source = order as unknown as { driver_location?: { lat?: unknown; lng?: unknown } | null }
		const lat = toFiniteNumber(source?.driver_location?.lat)
		const lng = toFiniteNumber(source?.driver_location?.lng)
		return lat !== null && lng !== null ? ([lat, lng] as [number, number]) : null
	}, [order])
	const rawOrderStatus = String(order?.status ?? '')
	const normalizedOrderStatus = rawOrderStatus === 'in_proccess' ? OrderStatusEnum.IN_PROCESS : rawOrderStatus
	const shouldShowDriverRoute =
		normalizedOrderStatus === OrderStatusEnum.PENDING || normalizedOrderStatus === OrderStatusEnum.IN_PROCESS
	const touchHintLabel =
		locale === 'en'
			? 'Tap map to move it'
			: locale === 'uz'
				? "Xaritani surish uchun bosib ko'ring"
				: 'Нажмите на карту, чтобы перемещать'

	useEffect(() => {
		if (typeof window === 'undefined') return
		const coarsePointer = window.matchMedia?.('(any-pointer: coarse)')?.matches ?? false
		const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
		const nextIsTouchDevice = coarsePointer || hasTouch
		setIsTouchDevice(nextIsTouchDevice)
		setShowTouchHint(nextIsTouchDevice)
	}, [])

	useEffect(() => {
		if (!containerNode) return

		let isCancelled = false

		const initMap = async () => {
			setMapError(null)
			onRemainingKmChange?.(null)
			onDriverLocationChange?.(null)
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
					controls: [...MAP_CONTROLS],
				})
				mapRef.current = map
				if (isTouchDevice) {
					map.behaviors.disable('drag')
				}

				const points: [number, number][] = []

				const resolvePoint = async (query: string, predefinedCoords: [number, number] | null, fallbackName: string) => {
					if (predefinedCoords) {
						return { coords: predefinedCoords, name: fallbackName }
					}
					if (!query) return null
					const result = await ymaps.geocode(query, { results: 1 })
					const first = result.geoObjects.get(0)
					if (!first) return null
					const coords = first.geometry.getCoordinates() as [number, number]
					return { coords, name: first.properties?.get('name') ?? query }
				}

				const [originPoint, destinationPoint] = await Promise.all([
					resolvePoint(originQuery, originCoordsFromOrder, order?.origin_city || originQuery || 'Origin'),
					resolvePoint(destinationQuery, destinationCoordsFromOrder, order?.destination_city || destinationQuery || 'Destination'),
				])

				if (originPoint) {
					points.push(originPoint.coords)
					map.geoObjects.add(
						new ymaps.Placemark(originPoint.coords, {
							balloonContent: order?.origin_address || originPoint.name,
						}),
					)
				}

				if (destinationPoint) {
					points.push(destinationPoint.coords)
					map.geoObjects.add(
						new ymaps.Placemark(destinationPoint.coords, {
							balloonContent: order?.destination_address || destinationPoint.name,
						}),
					)
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
					const driverPoint: [number, number] = driverCoordsFromOrder ?? STATIC_DRIVER_POINT
					points.push(driverPoint)

					try {
						const locationResult = await ymaps.geocode(driverPoint, { results: 1 })
						const locationGeoObject = locationResult.geoObjects.get(0)
						const locality =
							locationGeoObject?.getLocalities?.()?.[0] ??
							locationGeoObject?.properties?.get('name') ??
							locationGeoObject?.properties?.get('text') ??
							null
						onDriverLocationChange?.(locality)
					} catch {
						onDriverLocationChange?.(`${driverPoint[0].toFixed(5)}, ${driverPoint[1].toFixed(5)}`)
					}

					map.geoObjects.add(
						new ymaps.Placemark(
							driverPoint,
							{ balloonContent: order?.carrier_name || order?.roles?.carrier?.name || 'Carrier' },
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
							const nextRemainingKm = typeof meters === 'number' ? meters / 1000 : null
							onRemainingKmChange?.(nextRemainingKm)
							setMapError(null)
						})

						multiRoute.model.events.add('requestfail', () => {
							onRemainingKmChange?.(null)
							setMapError('Failed to build driver route')
						})
					} catch (error) {
						setMapError(error instanceof Error ? error.message : 'Failed to build driver route')
						onRemainingKmChange?.(null)
					}
				} else {
					onDriverLocationChange?.(null)
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
					onRemainingKmChange?.(null)
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
	}, [
		apiKey,
		containerNode,
		destinationQuery,
		isTouchDevice,
		locale,
		normalizedOrderStatus,
		onDriverLocationChange,
		onRemainingKmChange,
		originQuery,
		originCoordsFromOrder,
		order?.origin_city,
		order?.destination_city,
		order?.origin_address,
		order?.destination_address,
		order?.carrier_name,
		order?.roles?.carrier?.name,
		shouldShowDriverRoute,
		destinationCoordsFromOrder,
		driverCoordsFromOrder,
	])

	useEffect(() => {
		const map = mapRef.current
		if (!map || !isTouchDevice) return

		if (showTouchHint) {
			map.behaviors.disable('drag')
			return
		}

		map.behaviors.enable('drag')
	}, [isTouchDevice, showTouchHint])

	return {
		setContainerNode,
		mapError,
		isLoadingMap,
		isTouchDevice,
		showTouchHint,
		setShowTouchHint,
		touchHintLabel,
	}
}

