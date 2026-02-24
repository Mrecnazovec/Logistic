import { useEffect, useRef } from 'react'
import { useUpdateOrderGps } from '@/hooks/queries/orders/useUpdateOrderGps'

type CarrierPosition = {
	lat: number
	lng: number
	capturedAt: string
}

type UseCarrierGpsSyncParams = {
	orderId?: string | number
	isCarrier: boolean
	permissionState: 'idle' | 'prompt' | 'granted' | 'denied' | 'unsupported'
	lastPosition: CarrierPosition | null
	requestLocation: () => void
}

export function useCarrierGpsSync({
	orderId,
	isCarrier,
	permissionState,
	lastPosition,
	requestLocation,
}: UseCarrierGpsSyncParams) {
	const { updateOrderGps } = useUpdateOrderGps()
	const lastSentCapturedAtRef = useRef<string | null>(null)

	useEffect(() => {
		if (!isCarrier || !orderId || !lastPosition) return
		if (lastSentCapturedAtRef.current === lastPosition.capturedAt) return

		lastSentCapturedAtRef.current = lastPosition.capturedAt
		updateOrderGps({
			id: orderId,
			data: {
				lat: lastPosition.lat,
				lng: lastPosition.lng,
				recorded_at: lastPosition.capturedAt,
			},
		})
		console.log('[status-gps] sent', {
			orderId,
			lat: lastPosition.lat,
			lng: lastPosition.lng,
			recorded_at: lastPosition.capturedAt,
		})
	}, [isCarrier, lastPosition, orderId, updateOrderGps])

	useEffect(() => {
		if (!isCarrier || !orderId) return
		if (permissionState === 'denied' || permissionState === 'unsupported') return

		const intervalId = window.setInterval(() => {
			requestLocation()
		}, 15 * 60 * 1000)

		return () => {
			window.clearInterval(intervalId)
		}
	}, [isCarrier, orderId, permissionState, requestLocation])
}

