import type { PatchedOrderDriverStatusUpdateDto } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useUpdateOrderStatus = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: updateOrderStatus, isPending: isLoadingUpdateStatus } = useMutation({
		mutationKey: ['order', 'update-status'],
		mutationFn: ({ id, data }: { id: string; data: PatchedOrderDriverStatusUpdateDto }) => ordersService.updateDriverStatus(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get order'] })
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.orders.updateStatus.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.updateStatus.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ updateOrderStatus, isLoadingUpdateStatus }), [updateOrderStatus, isLoadingUpdateStatus])
}
