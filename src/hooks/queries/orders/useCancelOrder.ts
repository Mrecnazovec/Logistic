import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCancelOrder = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: cancelOrder, isPending: isLoadingCancel } = useMutation({
		mutationKey: ['order', 'cancel'],
		mutationFn: (id: string | number) => ordersService.cancelOrder(id),
		onSuccess(_, id) {
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['get order', String(id)] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.orders.cancel.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.cancel.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ cancelOrder, isLoadingCancel }), [cancelOrder, isLoadingCancel])
}
