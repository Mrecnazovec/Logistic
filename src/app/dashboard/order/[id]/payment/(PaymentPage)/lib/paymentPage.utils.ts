import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import type { PaymentConfirmAction, PaymentPageTranslator, PaymentSection } from '../types/paymentPage.types'

type BuildConfirmActionParams = {
	order: IOrderDetail
	isCustomer: boolean
	isCarrier: boolean
	isLogistic: boolean
	t: PaymentPageTranslator
	confirmPaymentCustomer: (params: { id: number; orderId: number; data: { order: number } }) => void
	confirmPaymentCarrier: (params: { id: number; orderId: number; data: { order: number } }) => void
	confirmPaymentLogistic: (params: { id: number; orderId: number; data: { order: number } }) => void
	isLoadingConfirmPaymentCustomer: boolean
	isLoadingConfirmPaymentCarrier: boolean
	isLoadingConfirmPaymentLogistic: boolean
}

export const withFallback = (value?: string | number | null) =>
	value === null || value === undefined || value === '' ? DEFAULT_PLACEHOLDER : String(value)

export const isPaymentAvailableByStatus = (status: OrderStatusEnum) =>
	status === OrderStatusEnum.DELIVERED || status === OrderStatusEnum.PAID

export const buildPaymentSections = (order: IOrderDetail, t: PaymentPageTranslator): PaymentSection[] => {
	const payment = order.payment
	const sections: PaymentSection[] = [
		{
			key: 'customer',
			title: t('order.payment.section.customer'),
			role: order.roles?.customer ?? null,
			confirmation: Boolean(payment?.confirmed_by_customer),
		},
		{
			key: 'carrier',
			title: t('order.payment.section.carrier'),
			role: order.roles?.carrier ?? null,
			confirmation: Boolean(payment?.confirmed_by_carrier),
		},
		{
			key: 'logistic',
			title: t('order.payment.section.logistic'),
			role: order.roles?.logistic ?? null,
			confirmation: Boolean(payment?.confirmed_by_logistic),
		},
	]

	return sections.filter((section) => (section.key === 'logistic' ? Boolean(order.roles?.logistic?.id) : true))
}

export const buildConfirmAction = ({
	order,
	isCustomer,
	isCarrier,
	isLogistic,
	t,
	confirmPaymentCustomer,
	confirmPaymentCarrier,
	confirmPaymentLogistic,
	isLoadingConfirmPaymentCustomer,
	isLoadingConfirmPaymentCarrier,
	isLoadingConfirmPaymentLogistic,
}: BuildConfirmActionParams): PaymentConfirmAction | null => {
	const payment = order.payment
	const paymentId = payment?.id

	if (!payment || !paymentId) return null

	if (isCustomer) {
		return {
			label: t('order.payment.confirm.customer'),
			isConfirmed: Boolean(payment.confirmed_by_customer),
			isLoading: isLoadingConfirmPaymentCustomer,
			onConfirm: () => confirmPaymentCustomer({ id: paymentId, orderId: order.id, data: { order: order.id } }),
		}
	}

	if (isCarrier) {
		return {
			label: t('order.payment.confirm.carrier'),
			isConfirmed: Boolean(payment.confirmed_by_carrier),
			isLoading: isLoadingConfirmPaymentCarrier,
			onConfirm: () => confirmPaymentCarrier({ id: paymentId, orderId: order.id, data: { order: order.id } }),
		}
	}

	if (isLogistic) {
		return {
			label: t('order.payment.confirm.logistic'),
			isConfirmed: Boolean(payment.confirmed_by_logistic),
			isLoading: isLoadingConfirmPaymentLogistic,
			onConfirm: () => confirmPaymentLogistic({ id: paymentId, orderId: order.id, data: { order: order.id } }),
		}
	}

	return null
}
