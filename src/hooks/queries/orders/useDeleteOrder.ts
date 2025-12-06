import { ordersService } from '@/services/orders.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useDeleteOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: deleteOrder, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['order', 'delete'],
		mutationFn: (id: string) => ordersService.deleteOrder(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Заказ удален')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Unable to delete order'
			toast.error(message)
		},
	})

	return useMemo(() => ({ deleteOrder, isLoadingDelete }), [deleteOrder, isLoadingDelete])
}
