'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'
import { useI18n } from '@/i18n/I18nProvider'

type MapPoint = {
	lat: number
	lng: number
}

type MapSelection = MapPoint & {
	address?: string
}

type LocationMapPickerProps = {
	type: 'origin' | 'destination'
	apiKey?: string
	city?: string
	country?: string
	address?: string
	fallbackPoint?: MapPoint | null
	value?: MapPoint | null
	onSelect: (selection: MapSelection) => void
	disabled?: boolean
	compact?: boolean
	disabledCityTooltip?: string
	open?: boolean
	onOpenChange?: (nextOpen: boolean) => void
}

declare global {
	interface Window {
		ymaps?: any
		__yandexMapsPromise?: Promise<any>
	}
}

const DEFAULT_POINT: MapPoint = { lat: 41.3111, lng: 69.2797 }

const extractGeoObjectAddress = (geoObject: any): string => {
	if (!geoObject) return ''

	const getAddressLine = geoObject.getAddressLine
	if (typeof getAddressLine === 'function') {
		const directAddress = getAddressLine.call(geoObject)
		if (typeof directAddress === 'string' && directAddress.trim()) return directAddress
	}

	const properties = geoObject.properties
	const candidates = [
		properties?.get?.('metaDataProperty.GeocoderMetaData.Address.formatted'),
		properties?.get?.('metaDataProperty.GeocoderMetaData.text'),
		properties?.get?.('text'),
		properties?.get?.('name'),
		properties?.get?.('description'),
	]

	for (const candidate of candidates) {
		if (typeof candidate === 'string' && candidate.trim()) return candidate
	}

	return ''
}

const resolveYandexLang = (locale: string) => {
	if (locale === 'en') return 'en_US'
	return 'ru_RU'
}

const loadYandexMaps = (apiKey: string, lang: string) => {
	if (window.ymaps) {
		return Promise.resolve(window.ymaps)
	}

	if (window.__yandexMapsPromise) {
		return window.__yandexMapsPromise
	}

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

export function LocationMapPicker({
	type,
	apiKey,
	city,
	country,
	address,
	fallbackPoint,
	value,
	onSelect,
	disabled,
	compact = false,
	disabledCityTooltip,
	open,
	onOpenChange,
}: LocationMapPickerProps) {
	const { t, locale } = useI18n()
	const tm = (key: string, fallback: string) => {
		const value = t(key)
		return value === key ? fallback : value
	}
	const [internalOpen, setInternalOpen] = useState(false)
	const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(value ?? null)
	const [selectedAddress, setSelectedAddress] = useState<string>('')
	const [isLoadingMap, setIsLoadingMap] = useState(false)
	const [isSearching, setIsSearching] = useState(false)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [searchAddress, setSearchAddress] = useState(address ?? '')
	const [mapContainerNode, setMapContainerNode] = useState<HTMLDivElement | null>(null)
	const mapRef = useRef<any>(null)
	const ymapsRef = useRef<any>(null)
	const placemarkRef = useRef<any>(null)
	const setPlacemarkRef = useRef<((point: MapPoint) => void) | null>(null)
	const reverseGeocodeRequestRef = useRef(0)
	const skipAutoApplyOnCloseRef = useRef(false)

	const initialQuery = useMemo(() => [country, city, address].filter(Boolean).join(', '), [address, city, country])
	const hasMinimumData = Boolean(city)
	const dialogOpen = open ?? internalOpen

	const setDialogOpen = (nextOpen: boolean) => {
		if (open === undefined) {
			setInternalOpen(nextOpen)
		}
		onOpenChange?.(nextOpen)
	}

	useEffect(() => {
		setSelectedPoint(value ?? null)
	}, [value])

	useEffect(() => {
		setSearchAddress(address ?? '')
	}, [address])

	const geocodeAndSelect = async (query: string) => {
		if (!query.trim() || !ymapsRef.current || !mapRef.current || !setPlacemarkRef.current) return

		setIsSearching(true)
		setLoadError(null)

		try {
			const result = await ymapsRef.current.geocode(query, { results: 1 })
			const firstGeoObject = result.geoObjects.get(0)
			if (!firstGeoObject) {
				setLoadError(tm('announcements.posting.map.notFound', 'Address not found on map.'))
				return
			}

			const coords = firstGeoObject.geometry.getCoordinates()
			const geocodedPoint = { lat: coords[0], lng: coords[1] }
			const resolvedAddress =
				firstGeoObject.getAddressLine?.() ??
				firstGeoObject.properties?.get('text') ??
				firstGeoObject.properties?.get('name') ??
				''
			mapRef.current.setCenter(coords, 14)
			setPlacemarkRef.current(geocodedPoint)
			setSelectedPoint(geocodedPoint)
			setSelectedAddress(resolvedAddress)
		} catch {
			setLoadError(tm('announcements.posting.map.searchFailed', 'Failed to search location on map.'))
		} finally {
			setIsSearching(false)
		}
	}

	const resolveAddressByCoords = async (point: MapPoint) => {
		if (!ymapsRef.current) return

		const currentRequestId = ++reverseGeocodeRequestRef.current
		try {
			const result = await ymapsRef.current.geocode([point.lat, point.lng], { results: 1 })
			if (currentRequestId !== reverseGeocodeRequestRef.current) return

			const firstGeoObject = result.geoObjects.get(0)
			if (!firstGeoObject) {
				setSelectedAddress('')
				return
			}

			const resolvedAddress = extractGeoObjectAddress(firstGeoObject)
			setSelectedAddress(resolvedAddress)
		} catch {
			setSelectedAddress('')
		}
	}

	useEffect(() => {
		if (!dialogOpen || !mapContainerNode || !apiKey) return

		let isCancelled = false

		const initMap = async () => {
			setIsLoadingMap(true)
			setLoadError(null)

			try {
				const ymaps = await loadYandexMaps(apiKey, resolveYandexLang(locale))
				if (isCancelled || !mapContainerNode) return
				ymapsRef.current = ymaps

				const startPoint = value ?? fallbackPoint ?? DEFAULT_POINT
				const map = new ymaps.Map(mapContainerNode, {
					center: [startPoint.lat, startPoint.lng],
					zoom: value || fallbackPoint ? 12 : 7,
					controls: ['zoomControl', 'geolocationControl'],
				})

				mapRef.current = map
				setTimeout(() => {
					if (mapRef.current) {
						mapRef.current.container.fitToViewport()
					}
				}, 0)

				const setPlacemark = (point: MapPoint) => {
					const geometry = [point.lat, point.lng]
					if (!placemarkRef.current) {
						placemarkRef.current = new ymaps.Placemark(geometry, {}, { draggable: true })
						map.geoObjects.add(placemarkRef.current)
						placemarkRef.current.events.add('dragend', () => {
							const coords = placemarkRef.current.geometry.getCoordinates()
							const movedPoint = { lat: coords[0], lng: coords[1] }
							setSelectedPoint(movedPoint)
							void resolveAddressByCoords(movedPoint)
						})
						return
					}
					placemarkRef.current.geometry.setCoordinates(geometry)
				}
				setPlacemarkRef.current = setPlacemark

				if (value) {
					setPlacemark(value)
					setSelectedPoint(value)
					void resolveAddressByCoords(value)
				}

				if (!value && initialQuery) {
					try {
						const result = await ymaps.geocode(initialQuery, { results: 1 })
						const firstGeoObject = result.geoObjects.get(0)
						if (firstGeoObject) {
							const coords = firstGeoObject.geometry.getCoordinates()
							const geocodedPoint = { lat: coords[0], lng: coords[1] }
							const resolvedAddress =
								firstGeoObject.getAddressLine?.() ??
								firstGeoObject.properties?.get('text') ??
								firstGeoObject.properties?.get('name') ??
								''
							map.setCenter(coords, 14)
							setPlacemark(geocodedPoint)
							setSelectedPoint(geocodedPoint)
							setSelectedAddress(resolvedAddress)
						}
					} catch {
						// Keep fallback center when geocoder fails.
					}
				}

				map.events.add('click', (event: any) => {
					const coords = event.get('coords') as [number, number]
					const point = { lat: coords[0], lng: coords[1] }
					setPlacemark(point)
					setSelectedPoint(point)
					void resolveAddressByCoords(point)
				})
			} catch (error) {
				if (!isCancelled) {
					setLoadError(error instanceof Error ? error.message : 'Failed to initialize map')
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
			setPlacemarkRef.current = null
			ymapsRef.current = null
			placemarkRef.current = null
			if (mapRef.current) {
				mapRef.current.destroy()
				mapRef.current = null
			}
		}
	}, [apiKey, dialogOpen, fallbackPoint, initialQuery, locale, mapContainerNode, value])

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && selectedPoint && !skipAutoApplyOnCloseRef.current) {
			onSelect({ ...selectedPoint, address: selectedAddress || undefined })
		}
		skipAutoApplyOnCloseRef.current = false
		setDialogOpen(nextOpen)
	}

	const handleApply = () => {
		if (!selectedPoint) return
		skipAutoApplyOnCloseRef.current = true
		onSelect({ ...selectedPoint, address: selectedAddress || undefined })
		setDialogOpen(false)
	}

	const handleSearch = () => {
		if (!city) return
		const query = [country, city, searchAddress].filter(Boolean).join(', ')
		void geocodeAndSelect(query)
	}

	const coordsText = selectedPoint
		? `${selectedPoint.lat.toFixed(6)}, ${selectedPoint.lng.toFixed(6)}`
		: tm('announcements.posting.map.coordinatesPlaceholder', 'Coordinates are not selected')
	const isTriggerDisabled = Boolean(disabled || !hasMinimumData || !apiKey)

	const triggerButton = (
		<Button
			type='button'
			variant='default'
			className={
				compact
					? 'h-11 w-11 rounded-full bg-brand border-none p-0 text-white hover:bg-brand/90'
					: 'rounded-4xl h-11 bg-brand border-none text-white hover:bg-brand/90'
			}
			size='sm'
			onClick={() => setDialogOpen(true)}
			disabled={isTriggerDisabled}
		>
			<MapPin className='size-4 text-white' />
			{compact ? null : tm('announcements.posting.map.open', 'Open map')}
		</Button>
	)

	const triggerWithOptionalTooltip =
		isTriggerDisabled && !hasMinimumData && disabledCityTooltip ? (
			<Tooltip>
				<TooltipTrigger asChild>
					<span className='inline-flex'>{triggerButton}</span>
				</TooltipTrigger>
				<TooltipContent side='top' className='text-black' sideOffset={6}>
					{disabledCityTooltip}
				</TooltipContent>
			</Tooltip>
		) : (
			triggerButton
		)

	return (
		<div className={compact ? '' : 'mt-2 space-y-2'}>
			<div className='flex flex-wrap items-center gap-2'>
				{triggerWithOptionalTooltip}
				{compact ? null : <p className='text-xs text-muted-foreground'>{coordsText}</p>}
			</div>
			{compact
				? null
				: !apiKey
					? (
						<p className='text-xs text-destructive'>
							{tm('announcements.posting.map.missingKey', 'Yandex key is missing: set YANDEX_SECRET_KEY in environment.')}
						</p>
					)
					: null}
			{compact
				? null
				: !hasMinimumData
					? (
						<p className='text-xs text-muted-foreground'>
							{tm('announcements.posting.map.fillAddress', 'Fill in city to open map. Address is optional.')}
						</p>
					)
					: null}
			<Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
				<DialogContent className='md:max-h-[80dvh]'>
					<DialogHeader>
						<DialogTitle>{tm('announcements.posting.map.title', 'Specify exact point on map')}</DialogTitle>
						<DialogDescription>
							{tm(
								'announcements.posting.map.description',
								'Click on the map to select an exact point. You can also drag the marker.'
							)}
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-3'>

						<div className='flex flex-col gap-2 sm:flex-row'>
							<Input
								value={searchAddress}
								onChange={(event) => setSearchAddress(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === 'Enter') {
										event.preventDefault()
										handleSearch()
									}
								}}
								placeholder={tm('announcements.posting.map.searchAddressPlaceholder', 'Enter address for map search')}
								className='rounded-full'
							/>
							<Button type='button' variant='outline' onClick={handleSearch} disabled={isSearching || !city}>
								{isSearching
									? tm('announcements.posting.map.searching', 'Searching...')
									: tm('announcements.posting.map.search', 'Search')}
							</Button>
						</div>
						<div className='h-[420px] w-full overflow-hidden rounded-2xl border bg-muted/30'>
							{isLoadingMap ? (
								<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
									{tm('announcements.posting.map.loading', 'Loading map...')}
								</div>
							) : null}
							{loadError ? (
								<div className='flex h-full items-center justify-center text-sm text-destructive'>{loadError}</div>
							) : null}
							<div ref={setMapContainerNode} className='h-full w-full' />
						</div>
						<p className='text-xs text-muted-foreground'>
							{tm('announcements.posting.map.selected', 'Selected coordinates')}: {coordsText}
						</p>
						<p className='text-xs text-muted-foreground'>
							{tm('announcements.posting.map.selectedAddress', 'Selected address')}:{' '}
							{selectedAddress || tm('announcements.posting.map.addressPlaceholder', 'Address is not defined')}
						</p>
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => setDialogOpen(false)}>
							{tm('announcements.posting.map.close', 'Close')}
						</Button>
						<Button type='button' onClick={handleApply} disabled={!selectedPoint}>
							{tm('announcements.posting.map.apply', 'Apply point')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
