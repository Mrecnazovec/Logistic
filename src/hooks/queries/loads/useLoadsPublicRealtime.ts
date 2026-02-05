import { useEffect } from 'react'

import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'
import { useQueryClient } from '@tanstack/react-query'

type LoadsActionPayload = {
	action?: string
	event?: string
	type?: string
}

const LOADS_ACTIONS = new Set(['create', 'update', 'remove'])
const OFFERS_ACTIONS = new Set(['offer_created', 'offer_updated', 'offer_deleted'])
const ORDERS_ACTIONS = new Set(['order_created', 'order_updated', 'order_deleted', 'order_documents_added'])

export const useLoadsPublicRealtime = () => {
	const queryClient = useQueryClient()

	useEffect(() => {
		const token = getAccessToken()
		if (!token) return

		const wsUrl = `wss://kad-one.com/ws/loads/?token=${token}`
		const client = new WSClient(wsUrl, {
			// onOpen: () => console.log('WebSocket loads connected'),
			// onError: () => console.log('WebSocket loads error'),
			// onClose: () => console.log('WebSocket loads closed'),
			onMessage: (direction, message) => {
				// console.log(`[loads ws][${direction}]`, message)
				if (direction !== 'in') return
				const data = message as LoadsActionPayload
				if (!data.action || !LOADS_ACTIONS.has(data.action) || !data.event || !OFFERS_ACTIONS.has(data.event))

					queryClient.invalidateQueries({ queryKey: ['get loads'] })
				queryClient.invalidateQueries({ queryKey: ['get offers'] })
				queryClient.invalidateQueries({ queryKey: ['get orders'] })
				queryClient.invalidateQueries({ queryKey: ['get order'] })
				queryClient.invalidateQueries({ queryKey: ['get order documents'] })
				queryClient.invalidateQueries({ queryKey: ['get order status history'] })
				queryClient.invalidateQueries({ queryKey: ['get agreements'] })
				queryClient.invalidateQueries({ queryKey: ['get shared order'] })
				queryClient.invalidateQueries({ queryKey: ['get shared order status history'] })
				queryClient.invalidateQueries({ queryKey: ['get agreement'] })
				queryClient.invalidateQueries({ queryKey: ['auth', 'dashboard-stats'] })
				queryClient.invalidateQueries({ queryKey: ['get rating'] })
				queryClient.invalidateQueries({ queryKey: ['get ratings'] })
				queryClient.invalidateQueries({ queryKey: ['get rating user'] })
				queryClient.invalidateQueries({ queryKey: ['get analytics'] })
				queryClient.invalidateQueries({ queryKey: ['payment'] })
				queryClient.invalidateQueries({ queryKey: ['order'] })

			},
		})

		client.connect()

		return () => {
			client.disconnect()
		}
	}, [queryClient])
}
