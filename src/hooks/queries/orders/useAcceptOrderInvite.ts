import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { OrderInvitePayload } from '@/shared/types/Order.interface'

export const useAcceptOrderInvite = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: acceptOrderInvite, isPending: isLoadingAccept } = useMutation({
		mutationKey: ['order', 'accept-invite'],
		mutationFn: (payload: OrderInvitePayload) => ordersService.acceptOrderInvite(payload),
		onSuccess(order) {
			if (order?.id) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(order.id)] })
			}
			toast.success(t('hooks.orders.acceptInvite.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.acceptInvite.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptOrderInvite, isLoadingAccept }), [acceptOrderInvite, isLoadingAccept])
}
