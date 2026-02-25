import { useState } from 'react'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { useConfirmPaymentCarrier } from '@/hooks/queries/payments/useConfirmPaymentCarrier'
import { useConfirmPaymentCustomer } from '@/hooks/queries/payments/useConfirmPaymentCustomer'
import { useConfirmPaymentLogistic } from '@/hooks/queries/payments/useConfirmPaymentLogistic'
import { useI18n } from '@/i18n/I18nProvider'
import { buildConfirmAction, buildPaymentSections, isPaymentAvailableByStatus } from '../lib/paymentPage.utils'

export function usePaymentPage() {
	const { t } = useI18n()
	const { order, isLoading } = useGetOrder()
	const { me } = useGetMe()
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [isDisputeOpen, setIsDisputeOpen] = useState(false)
	const { confirmPaymentCustomer, isLoadingConfirmPaymentCustomer } = useConfirmPaymentCustomer()
	const { confirmPaymentCarrier, isLoadingConfirmPaymentCarrier } = useConfirmPaymentCarrier()
	const { confirmPaymentLogistic, isLoadingConfirmPaymentLogistic } = useConfirmPaymentLogistic()

	const isCustomer = Boolean(me?.id && order?.roles?.customer?.id === me.id)
	const isCarrier = Boolean(me?.id && order?.roles?.carrier?.id === me.id)
	const isLogistic = Boolean(me?.id && order?.roles?.logistic?.id === me.id)

	const payment = order?.payment ?? null
	const paymentId = payment?.id ?? null
	const isPaymentAvailable = order ? isPaymentAvailableByStatus(order.status) : false
	const sections = order ? buildPaymentSections(order, t) : []
	const confirmAction = order
		? buildConfirmAction({
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
			})
		: null

	return {
		t,
		order,
		isLoading,
		payment,
		paymentId,
		isPaymentAvailable,
		sections,
		confirmAction,
		isConfirmOpen,
		setIsConfirmOpen,
		isDisputeOpen,
		setIsDisputeOpen,
	}
}
