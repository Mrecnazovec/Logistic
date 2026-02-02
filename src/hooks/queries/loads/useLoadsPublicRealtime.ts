import { useEffect } from 'react'

import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'
import { useQueryClient } from '@tanstack/react-query'

export const useLoadsPublicRealtime = () => {
	const queryClient = useQueryClient()

	useEffect(() => {
		const token = getAccessToken()
		if (!token) return

		const wsUrl = `wss://kad-one.com/ws/loads/?token=${token}`
		const client = new WSClient(wsUrl, {
			onOpen: () => console.log('Соединение установлено'),
			onError: () => console.log('Ошибка сокета'),
			onClose: () => console.log('Соединение закрыто'),
		})

		client.connect()

		const invalidateLoads = () => {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
		}

		const offCreated = client.on('loads.created', invalidateLoads)
		const offUpdated = client.on('loads.updated', invalidateLoads)
		const offDeleted = client.on('loads.deleted', invalidateLoads)

		return () => {
			offCreated()
			offUpdated()
			offDeleted()
			client.disconnect()
		}
	}, [queryClient])
}
