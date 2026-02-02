import { useEffect } from 'react'

import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'
import { useQueryClient } from '@tanstack/react-query'

export const useNotificationsRealtime = (enabled: boolean) => {
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!enabled) return
		const token = getAccessToken()
		if (!token) return

		const wsUrl = `wss://kad-one.com/ws/notifications/?token=${token}`
		const client = new WSClient(wsUrl)

		client.connect()

		const invalidateNotifications = () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		}

		const offCreated = client.on('notifications.created', invalidateNotifications)
		const offUpdated = client.on('notifications.updated', invalidateNotifications)
		const offDeleted = client.on('notifications.deleted', invalidateNotifications)

		return () => {
			offCreated()
			offUpdated()
			offDeleted()
			client.disconnect()
		}
	}, [enabled, queryClient])
}
