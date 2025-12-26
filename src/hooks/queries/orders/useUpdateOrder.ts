import type { PatchedOrderDetailDto } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useUpdateOrder = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: updateOrder, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['order', 'update'],
		mutationFn: ({ id, data }: { id: string; data: PatchedOrderDetailDto }) => ordersService.patchOrder(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.orders.update.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.update.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ updateOrder, isLoadingUpdate }), [updateOrder, isLoadingUpdate])
}
