import { useCallback, useEffect, useState } from 'react'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'

type LocationPermissionState = 'idle' | 'prompt' | 'granted' | 'denied' | 'unsupported'

type CarrierLocationState = {
	isCarrier: boolean
	permissionState: LocationPermissionState
	isRequesting: boolean
	lastError: string | null
	notice: string | null
	requestLocation: () => void
	requestLocationWithNotice: () => void
}

export function useCarrierLocation(): CarrierLocationState {
	const role = useRoleStore((state) => state.role)
	const isCarrier = role === RoleEnum.CARRIER
	const isGeolocationSupported = typeof window !== 'undefined' && 'geolocation' in navigator
	const [permissionState, setPermissionState] = useState<LocationPermissionState>('idle')
	const [isRequesting, setIsRequesting] = useState(false)
	const [lastError, setLastError] = useState<string | null>(null)
	const [notice, setNotice] = useState<string | null>(null)

	const requestLocationInternal = useCallback((withNotice: boolean) => {
		if (!isCarrier) return
		if (!isGeolocationSupported) {
			setPermissionState('unsupported')
			setLastError('Geolocation is not supported in this browser.')
			if (withNotice) {
				setNotice('Геолокация не поддерживается в этом браузере.')
			}
			return
		}

		setIsRequesting(true)
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setPermissionState('granted')
				setLastError(null)
				setIsRequesting(false)
				if (withNotice) {
					setNotice('Доступ к геолокации разрешен. Трансляция местоположения включена.')
				}
				console.log('[carrier-location]', {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					accuracy: position.coords.accuracy,
					capturedAt: new Date(position.timestamp).toISOString(),
				})
			},
			(error) => {
				setPermissionState(error.code === error.PERMISSION_DENIED ? 'denied' : 'prompt')
				setLastError(error.message || 'Failed to get location.')
				setIsRequesting(false)
				if (withNotice) {
					setNotice(
						error.code === error.PERMISSION_DENIED
							? 'Доступ к геолокации запрещен.'
							: 'Не удалось получить геолокацию. Попробуйте снова.',
					)
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 60000,
			},
		)
	}, [isCarrier, isGeolocationSupported])

	const requestLocation = useCallback(() => {
		requestLocationInternal(false)
	}, [requestLocationInternal])

	const requestLocationWithNotice = useCallback(() => {
		requestLocationInternal(true)
	}, [requestLocationInternal])

	useEffect(() => {
		if (!isCarrier) return

		if (!isGeolocationSupported) return

		let isCancelled = false
		let permissionStatus: PermissionStatus | null = null

		const bootstrapLocation = async () => {
			try {
				if ('permissions' in navigator && navigator.permissions?.query) {
					permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
					if (isCancelled) return
					setPermissionState(permissionStatus.state as LocationPermissionState)
					permissionStatus.onchange = () => {
						if (isCancelled || !permissionStatus) return
						setPermissionState(permissionStatus.state as LocationPermissionState)
					}
					if (permissionStatus.state !== 'denied') {
						requestLocation()
					}
					return
				}
				requestLocation()
			} catch {
				if (!isCancelled) {
					requestLocation()
				}
			}
		}

		void bootstrapLocation()

		return () => {
			isCancelled = true
			if (permissionStatus) {
				permissionStatus.onchange = null
			}
		}
	}, [isCarrier, isGeolocationSupported, requestLocation])

	return {
		isCarrier,
		permissionState: isCarrier ? (isGeolocationSupported ? permissionState : 'unsupported') : 'idle',
		isRequesting: isCarrier ? isRequesting : false,
		lastError: isCarrier ? (isGeolocationSupported ? lastError : 'Geolocation is not supported in this browser.') : null,
		notice: isCarrier ? notice : null,
		requestLocation,
		requestLocationWithNotice,
	}
}
