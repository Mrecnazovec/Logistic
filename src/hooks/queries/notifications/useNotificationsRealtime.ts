import { useEffect } from 'react'

import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'
import { useQueryClient } from '@tanstack/react-query'

type UseNotificationsRealtimeOptions = {
	onEvent?: () => void
}

type NotificationsRealtimePayload = {
	type?: string
	name?: string
	event?: string
	action?: string
	payload?: unknown
}

const hasEventOrAction = (message: NotificationsRealtimePayload) => {
	if (message.type === 'event' && typeof message.name === 'string') return true
	if (typeof message.event === 'string' || typeof message.action === 'string') return true
	if (!message.payload || typeof message.payload !== 'object') return false
	const payloadData = message.payload as { event?: string; action?: string }
	return typeof payloadData.event === 'string' || typeof payloadData.action === 'string'
}

export const useNotificationsRealtime = (enabled: boolean, options?: UseNotificationsRealtimeOptions) => {
	const queryClient = useQueryClient()
	const onEvent = options?.onEvent

	useEffect(() => {
		if (!enabled) return
		const token = getAccessToken()
		if (!token) return

		const wsUrl = `wss://kad-one.com/ws/notifications/?token=${token}`
		const client = new WSClient(wsUrl, {
			// onOpen: () => console.log('WebSocket notifications connected'),
			// onError: () => console.log('WebSocket notifications error'),
			// onClose: () => console.log('WebSocket notifications closed'),
			onMessage: (direction, message) => {
				console.log(`[notifications ws][${direction}]`, message)
				if (direction !== 'in') return
				const data = message as NotificationsRealtimePayload
				if (!hasEventOrAction(data)) return
				onEvent?.()
				queryClient.invalidateQueries({ queryKey: ['notifications'] })
			},
		})

		client.connect()

		return () => {
			client.disconnect()
		}
	}, [enabled, onEvent, queryClient])
}
