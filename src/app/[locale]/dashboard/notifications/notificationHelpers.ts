import { getOrderStatusLabel } from '@/app/dashboard/history/orderStatusConfig'
import { DASHBOARD_URL, withLocale } from '@/config/url.config'
import type { Locale } from '@/i18n/config'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { INotification } from '@/shared/types/Notification.interface'
import type { IOfferDetail } from '@/shared/types/Offer.interface'

type Translate = (key: string, params?: Record<string, string | number>) => string

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
	offer_my_response_sent: 'notifications.types.offerMyResponseSent',
	offer_sent: 'notifications.types.offerSent',
	deal_success: 'notifications.types.dealSuccess',
	deal_confirm_required_by_other: 'notifications.types.dealConfirmRequiredByOther',
}

export const getNotificationDetailsText = (notification: INotification, t: Translate) => {
	return notification.message ?? ''
}

export const getNotificationTypeLabel = (notification: INotification, t: Translate) => {
	return t(NOTIFICATION_TYPE_LABELS[notification.type] ?? 'notifications.types.unknown')
}

export const getNotificationOrderId = (notification: INotification) => {
	const payload = notification.payload as Record<string, unknown> | undefined
	if (!payload) return null
	const orderId = payload.order_id
	if (typeof orderId === 'number' || typeof orderId === 'string') {
		return String(orderId)
	}
	return null
}

export const getNotificationOfferId = (notification: INotification) => {
	if (notification.type === 'offer_my_response_sent' || notification.type === 'offer_sent') {
		return notification.offer_id ? String(notification.offer_id) : null
	}
	return null
}

export const getNotificationRatedById = (notification: INotification) => {
	const payload = notification.payload as Record<string, unknown> | undefined
	if (!payload) return null
	const ratedBy = payload.rated_by
	if (typeof ratedBy === 'number' || typeof ratedBy === 'string') {
		return String(ratedBy)
	}
	return null
}

export const getNotificationRatedUserId = (notification: INotification) => {
	const payload = notification.payload as Record<string, unknown> | undefined
	if (!payload) return null
	const ratedUser = payload.rated_user
	if (typeof ratedUser === 'number' || typeof ratedUser === 'string') {
		return String(ratedUser)
	}
	return null
}

export const getNotificationCargoId = (notification: INotification) => {
	const payload = notification.payload as Record<string, unknown> | undefined
	if (!payload) return null
	const cargoId = payload.cargo_id ?? notification.cargo_id
	if (typeof cargoId === 'number' || typeof cargoId === 'string') {
		return String(cargoId)
	}
	return null
}

export const getNotificationStatusChange = (notification: INotification, t: Translate) => {
	const payload = notification.payload as Record<string, unknown> | undefined
	if (!payload) return null
	const oldStatus = payload.old_status
	const newStatus = payload.new_status
	if (typeof oldStatus !== 'string' || typeof newStatus !== 'string') return null

	return {
		from: getOrderStatusLabel(oldStatus as never, t),
		to: getOrderStatusLabel(newStatus as never, t),
		labelKey: notification.type === 'cargo_status_changed' ? 'notifications.details.orderStatusUpdated' : 'notifications.details.statusChange',
	}
}

type NotificationAction = {
	href: string
	labelKey: string
}

type NotificationDetailsContext = {
	offer?: IOfferDetail
	currentUserId?: number
	role?: RoleEnum
}

const NOTIFICATION_INSTRUCTION_LABELS: Record<string, string> = {
	offer_my_response_sent: 'notifications.instructions.offerMyResponseSent',
	offer_sent: 'notifications.instructions.offerSent',
	deal_success: 'notifications.instructions.dealSuccess',
	cargo_status_changed: 'notifications.instructions.cargoStatusChanged',
	deal_confirm_required_by_other: 'notifications.instructions.dealConfirmRequiredByOther',
	order_published: 'notifications.instructions.orderPublished',
	rating_received: 'notifications.instructions.ratingReceived',
	rating_sent: 'notifications.instructions.ratingSent',
	rating_required: 'notifications.instructions.ratingRequired',
	order_created: 'notifications.instructions.orderCreated',
	offer_received_from_carrier: 'notifications.instructions.offerReceivedFromCarrier',
	offer_received_from_logistic: 'notifications.instructions.offerReceivedFromLogistic',
	deal_rejected_by_other: 'notifications.instructions.dealRejectedByOther',
	offer_response_to_me: 'notifications.instructions.offerResponseToMe',
	payment_required: 'notifications.instructions.paymentRequired',
	document_added: 'notifications.instructions.documentAdded',
}

export const getNotificationDetailsModel = (notification: INotification, t: Translate, locale: Locale, context?: NotificationDetailsContext) => {
	const typeLabel = getNotificationTypeLabel(notification, t)
	let text = getNotificationDetailsText(notification, t)
	const actions: NotificationAction[] = []
	let instruction = NOTIFICATION_INSTRUCTION_LABELS[notification.type]
		? t(NOTIFICATION_INSTRUCTION_LABELS[notification.type])
		: t('notifications.instructions.default')
	let statusChange =
		notification.type === 'rating_required' || notification.type === 'cargo_status_changed' ? getNotificationStatusChange(notification, t) : null

	const offerId = getNotificationOfferId(notification)
	if (offerId) {
		actions.push({
			href: `${withLocale(DASHBOARD_URL.desk('my'), locale)}?id=${offerId}`,
			labelKey: 'notifications.actions.goToOffer',
		})
	}

	const orderId = getNotificationOrderId(notification)
	const hasOrderForCargo = notification.type === 'cargo_status_changed' && Boolean(orderId)

	if (hasOrderForCargo) {
		text = ''
		instruction = t('notifications.instructions.cargoStatusChangedWithOrder')
		statusChange = getNotificationStatusChange(notification, t)
	} else if (notification.type === 'cargo_status_changed') {
		instruction = t('notifications.instructions.cargoStatusChangedNoOrder')
		statusChange = null
	}
	if (notification.type === 'deal_success' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(orderId), locale),
			labelKey: 'notifications.actions.goToOrder',
		})
	}

	if (notification.type === 'rating_received' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(orderId), locale),
			labelKey: 'notifications.actions.goToOrder',
		})
	}

	if (notification.type === 'rating_sent' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(orderId), locale),
			labelKey: 'notifications.actions.goToOrder',
		})
	}

	if (notification.type === 'rating_required' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(orderId), locale),
			labelKey: 'notifications.actions.goToOrder',
		})
	}

	if (notification.type === 'payment_required' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(`${orderId}/payment`), locale),
			labelKey: 'notifications.actions.goToPayment',
		})
	}

	if (notification.type === 'document_added' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(`${orderId}/docs`), locale),
			labelKey: 'notifications.actions.goToDocuments',
		})
	}

	const cargoId = getNotificationCargoId(notification)
	if (notification.type === 'cargo_status_changed' && cargoId && !hasOrderForCargo) {
		actions.push({
			href: withLocale(DASHBOARD_URL.home(`desk?id=${cargoId}`), locale),
			labelKey: 'notifications.actions.viewCargo',
		})
	}

	if (notification.type === 'cargo_status_changed' && orderId) {
		actions.push({
			href: withLocale(DASHBOARD_URL.order(orderId), locale),
			labelKey: 'notifications.actions.goToOrder',
		})
	}

	if (notification.type === 'order_published') {
		actions.push({
			href: withLocale(DASHBOARD_URL.desk(), locale),
			labelKey: 'notifications.actions.goToDesk',
		})
	}

	if (notification.type === 'order_created') {
		actions.push({
			href: withLocale(DASHBOARD_URL.desk(), locale),
			labelKey: 'notifications.actions.goToDesk',
		})
	}

	if (notification.type === 'offer_response_to_me' && context?.role) {
		const deskHref = context.role === RoleEnum.CARRIER ? withLocale(DASHBOARD_URL.desk('my'), locale) : withLocale(DASHBOARD_URL.desk(), locale)

		actions.push({
			href: deskHref,
			labelKey: 'notifications.actions.goToDesk',
		})
	}

	if (notification.type === 'offer_received_from_logistic' || notification.type === 'offer_received_from_carrier') {
		actions.push({
			href: withLocale(DASHBOARD_URL.desk(), locale),
			labelKey: 'notifications.actions.goToDesk',
		})
	}

	if (notification.type === 'offer_from_customer') {
		actions.push({
			href: withLocale(DASHBOARD_URL.desk('my'), locale),
			labelKey: 'notifications.actions.goToDesk',
		})
	}

	if (notification.type === 'deal_confirm_required_by_other' && notification.offer_id && context?.offer && context.currentUserId) {
		const offerId = String(notification.offer_id)
		const { customer_id, carrier_id, logistic_id } = context.offer
		const userId = context.currentUserId
		const replyHref =
			userId === customer_id
				? withLocale(DASHBOARD_URL.home(`desk`), locale)
				: userId === carrier_id || userId === logistic_id
				? withLocale(DASHBOARD_URL.desk(`my`), locale)
				: null

		if (replyHref) {
			actions.push({
				href: replyHref,
				labelKey: 'notifications.actions.replyToOffer',
			})
		}
	}

	return { text, typeLabel, actions, instruction, statusChange }
}
