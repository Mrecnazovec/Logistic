import { useEffect } from 'react'

import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'
import type { IMe } from '@/shared/types/Me.interface'
import type { Offer, Order } from '@/shared/types/RealtimeEvents.interface'
import { useAgreementRealtimeStore } from '@/store/useAgreementRealtimeStore'
import { useOfferRealtimeStore } from '@/store/useOfferRealtimeStore'
import { useQueryClient } from '@tanstack/react-query'

type LoadsActionPayload = {
	action?: string
	event?: string
	type?: string
}

const LOADS_ACTIONS = new Set(['create', 'update', 'remove'])
const OFFERS_ACTIONS = new Set(['offer_created', 'offer_updated', 'offer_deleted'])
const ORDERS_ACTIONS = new Set([
	'driver_status_changed',
	'order_documents_added',
	'order_confirmed',
	'order_invited_carrier',
	'invite_generated',
	'order_invite_accepted',
	'order_invite_declined',
	'order_canceled',
])

type OffersEventPayload = {
	event: string
	offer?: Offer
}

type OrdersEventPayload = {
	event: string
	order?: Order
}

export const useLoadsPublicRealtime = () => {
	const queryClient = useQueryClient()
	const addOffer = useOfferRealtimeStore((state) => state.addOffer)
	const markAgreementUpdate = useAgreementRealtimeStore((state) => state.markAgreementUpdate)

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
				const data = message as LoadsActionPayload | OffersEventPayload | OrdersEventPayload
				const action = 'action' in data ? data.action : undefined
				const event = 'event' in data ? data.event : undefined
				if (!action && !event) return

				const isLoadAction = Boolean(action && LOADS_ACTIONS.has(action))
				const isOfferEvent = Boolean(event && OFFERS_ACTIONS.has(event))
				const isOrderEvent = Boolean(event && ORDERS_ACTIONS.has(event))
				if (!isLoadAction && !isOfferEvent && !isOrderEvent) return

				if (isOfferEvent && 'offer' in data && data.offer) {
					const me = queryClient.getQueryData<IMe>(['get profile'])
					const isAcceptedCarrierCustomer = data.offer.accepted_by_carrier && data.offer.accepted_by_customer
					const isAcceptedCustomerLogistic = data.offer.accepted_by_customer && data.offer.accepted_by_logistic
					if (isAcceptedCarrierCustomer || isAcceptedCustomerLogistic) {
						markAgreementUpdate()
					}
					if (typeof me?.id === 'number' && typeof data.offer.customer_id === 'number') {
						const target = data.offer.customer_id === me.id ? 'desk' : 'myOffers'
						addOffer({ offerId: data.offer.id, cargoId: data.offer.cargo, target })
					}
				}

				queryClient.invalidateQueries({ queryKey: ['get loads'] })
				queryClient.invalidateQueries({ queryKey: ['get offers'] })
				queryClient.invalidateQueries({ queryKey: ['get orders'] })
				queryClient.invalidateQueries({ queryKey: ['get orders count'] })
				queryClient.invalidateQueries({ queryKey: ['get order'] })
				queryClient.invalidateQueries({ queryKey: ['get order documents'] })
				queryClient.invalidateQueries({ queryKey: ['get order status history'] })
				queryClient.invalidateQueries({ queryKey: ['get agreements'] })
				queryClient.invalidateQueries({ queryKey: ['get shared order'] })
				queryClient.invalidateQueries({ queryKey: ['get shared order status history'] })
				queryClient.invalidateQueries({ queryKey: ['get agreement'] })
				queryClient.invalidateQueries({ queryKey: ['payment'] })
				queryClient.invalidateQueries({ queryKey: ['order'] })
				queryClient.invalidateQueries({ queryKey: ['auth', 'dashboard-stats'] })
				queryClient.invalidateQueries({ queryKey: ['get analytics'] })
				queryClient.invalidateQueries({ queryKey: ['get rating'] })
				queryClient.invalidateQueries({ queryKey: ['get ratings'] })
				queryClient.invalidateQueries({ queryKey: ['get rating user'] })

			},
		})

		client.connect()

		return () => {
			client.disconnect()
		}
	}, [addOffer, markAgreementUpdate, queryClient])
}
