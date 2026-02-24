import { useEffect } from 'react'

import { AUTH_TOKENS_REFRESHED_EVENT } from '@/constants/auth-events'
import { getAccessToken } from '@/services/auth/auth-token.service'
import { WSClient } from '@/services/ws.service'
import { OrderDriverStatusEnum, OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
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
	'gps_updated',
])

type OffersEventPayload = {
	event: string
	offer?: Offer
}

type OrdersEventPayload = {
	event: string
	order?: Order
}

const ORDER_STATUS_VALUES = new Set<string>(Object.values(OrderStatusEnum))
const ORDER_DRIVER_STATUS_VALUES = new Set<string>(Object.values(OrderDriverStatusEnum))

const normalizeOrderStatus = (value?: string) =>
	value && ORDER_STATUS_VALUES.has(value) ? (value as OrderStatusEnum) : undefined

const normalizeDriverStatus = (value?: string) =>
	value && ORDER_DRIVER_STATUS_VALUES.has(value) ? (value as OrderDriverStatusEnum) : undefined

export const useLoadsPublicRealtime = () => {
	const queryClient = useQueryClient()
	const addOffer = useOfferRealtimeStore((state) => state.addOffer)
	const markAgreementUpdate = useAgreementRealtimeStore((state) => state.markAgreementUpdate)

	useEffect(() => {
		let client: WSClient | null = null

		const handleMessage = (direction: 'in' | 'out', message: unknown) => {
			if (direction !== 'in') return
			const data = message as LoadsActionPayload | OffersEventPayload | OrdersEventPayload
			const action = 'action' in data ? data.action : undefined
			const event = 'event' in data ? data.event : undefined
			if (!action && !event) return

			const isLoadAction = Boolean(action && LOADS_ACTIONS.has(action))
			const isOfferEvent = Boolean(event && OFFERS_ACTIONS.has(event))
			const isOrderEvent = Boolean(event && ORDERS_ACTIONS.has(event))

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

			if (isOrderEvent && 'order' in data && data.order?.id) {
				const orderId = String(data.order.id)
				const nextStatus = normalizeOrderStatus(data.order.status)
				const nextDriverStatus = normalizeDriverStatus(data.order.driver_status)

				queryClient.setQueryData<IOrderDetail | undefined>(['get order', orderId], (current) => {
					if (!current) return current
					return {
						...current,
						status: nextStatus ?? current.status,
						driver_status: nextDriverStatus ?? current.driver_status,
					}
				})

				queryClient.invalidateQueries({ queryKey: ['get order', orderId] })
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
		}

		const reconnectWithLatestToken = () => {
			const token = getAccessToken()
			client?.disconnect()
			client = null
			if (!token) return
			const wsUrl = `wss://kad-one.com/ws/loads/?token=${token}`
			client = new WSClient(wsUrl, { onMessage: handleMessage })
			client.connect()
		}

		reconnectWithLatestToken()
		window.addEventListener(AUTH_TOKENS_REFRESHED_EVENT, reconnectWithLatestToken)

		return () => {
			window.removeEventListener(AUTH_TOKENS_REFRESHED_EVENT, reconnectWithLatestToken)
			client?.disconnect()
		}
	}, [addOffer, markAgreementUpdate, queryClient])
}
