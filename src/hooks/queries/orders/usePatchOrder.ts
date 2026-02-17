import type { PatchedOrderDetailDto } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePatchOrder = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type Payload = {
		id: string | number
		data: PatchedOrderDetailDto
	}
	const { mutate: patchOrder, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['order', 'patch'],
		mutationFn: ({ id, data }: Payload) => ordersService.patchOrder(id, data),
		onSuccess(_, variables) {
			const orderId = String(variables.id)
			queryClient.invalidateQueries({ queryKey: ['get order', orderId] })
			queryClient.invalidateQueries({ queryKey: ['get order status history', orderId] })
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.orders.patch.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.patch.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ patchOrder, isLoadingPatch }), [patchOrder, isLoadingPatch])
}
