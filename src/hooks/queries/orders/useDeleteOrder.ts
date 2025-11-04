import { ordersService } from '@/services/orders.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useDeleteOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: deleteOrder, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['order', 'delete'],
		mutationFn: (id: string) => ordersService.deleteOrder(id),
		onSuccess(_, id) {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			queryClient.invalidateQueries({ queryKey: ['get order', id] })
			queryClient.invalidateQueries({ queryKey: ['get order documents', id] })
			toast.success('Order deleted')
		},
		onError() {
			toast.error('Unable to delete order')
		},
	})

	return useMemo(() => ({ deleteOrder, isLoadingDelete }), [deleteOrder, isLoadingDelete])
}
