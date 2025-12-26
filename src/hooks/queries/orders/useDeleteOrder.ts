import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useDeleteOrder = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: deleteOrder, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['order', 'delete'],
		mutationFn: (id: string | number) => ordersService.deleteOrder(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.orders.delete.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.delete.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ deleteOrder, isLoadingDelete }), [deleteOrder, isLoadingDelete])
}
