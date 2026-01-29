import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { OrderInvitePayload } from '@/shared/types/Order.interface'

export const useDeclineOrderInvite = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: declineOrderInvite, isPending: isLoadingDecline } = useMutation({
		mutationKey: ['order', 'decline-invite'],
		mutationFn: (payload: OrderInvitePayload) => ordersService.declineOrderInvite(payload),
		onSuccess(order) {
			if (order?.id) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(order.id)] })
			}
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.orders.declineInvite.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.declineInvite.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ declineOrderInvite, isLoadingDecline }), [declineOrderInvite, isLoadingDecline])
}
