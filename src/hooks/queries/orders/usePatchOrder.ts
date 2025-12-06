import { ordersService } from '@/services/orders.service'
import { PatchedOrderDetailDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const usePatchOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: patchOrder, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['order', 'patch'],
		mutationFn: ({ id, data }: { id: string; data: PatchedOrderDetailDto }) => ordersService.patchOrder(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Заказ обновлен')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось обновить заказ'
			toast.error(message)
		},
	})

	return useMemo(() => ({ patchOrder, isLoadingPatch }), [patchOrder, isLoadingPatch])
}
