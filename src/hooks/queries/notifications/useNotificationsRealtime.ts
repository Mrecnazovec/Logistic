import { useEffect, useRef } from 'react'

import { AUTH_TOKENS_REFRESHED_EVENT } from '@/constants/auth-events'
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
	const onEventRef = useRef<UseNotificationsRealtimeOptions['onEvent']>(options?.onEvent)

	useEffect(() => {
		onEventRef.current = options?.onEvent
	}, [options?.onEvent])

	useEffect(() => {
		if (!enabled) return
		let client: WSClient | null = null

		const handleMessage = (direction: 'in' | 'out', message: unknown) => {
			if (direction !== 'in') return
			const data = message as NotificationsRealtimePayload
			if (!hasEventOrAction(data)) return
			onEventRef.current?.()
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		}

		const reconnectWithLatestToken = () => {
			const token = getAccessToken()
			client?.disconnect()
			client = null
			if (!token) return
			const wsUrl = `wss://kad-one.com/ws/notifications/?token=${token}`
			client = new WSClient(wsUrl, { onMessage: handleMessage })
			client.connect()
		}

		reconnectWithLatestToken()
		window.addEventListener(AUTH_TOKENS_REFRESHED_EVENT, reconnectWithLatestToken)

		return () => {
			window.removeEventListener(AUTH_TOKENS_REFRESHED_EVENT, reconnectWithLatestToken)
			client?.disconnect()
		}
	}, [enabled, queryClient])
}
