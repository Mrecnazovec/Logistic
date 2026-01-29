import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { OrderAcceptInviteResponse, OrderInvitePayload } from '@/shared/types/Order.interface'
import { useRouter } from 'next/navigation'
import { DASHBOARD_URL } from '@/config/url.config'

export const useAcceptOrderInvite = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate: acceptOrderInvite, isPending: isLoadingAccept } = useMutation<OrderAcceptInviteResponse, unknown, OrderInvitePayload>({
		mutationKey: ['order', 'accept-invite'],
		mutationFn: (payload: OrderInvitePayload) => ordersService.acceptOrderInvite(payload),
		onSuccess(order) {
			if (order?.order_id) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(order.order_id)] })
			}
			toast.success(t('hooks.orders.acceptInvite.success'))
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			if (order?.order_id) {
				router.push(DASHBOARD_URL.order(String(order.order_id)))
			}
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.acceptInvite.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptOrderInvite, isLoadingAccept }), [acceptOrderInvite, isLoadingAccept])
}
