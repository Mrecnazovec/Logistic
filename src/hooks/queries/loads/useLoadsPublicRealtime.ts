import { useEffect } from 'react'

import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'

export const useLoadsPublicRealtime = () => {
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

		const offCreated = client.on('loads.created', (payload) => console.log('loads.created', payload))
		const offUpdated = client.on('loads.updated', (payload) => console.log('loads.updated', payload))
		const offDeleted = client.on('loads.deleted', (payload) => console.log('loads.deleted', payload))

		return () => {
			offCreated()
			offUpdated()
			offDeleted()
			client.disconnect()
		}
	}, [])
}
