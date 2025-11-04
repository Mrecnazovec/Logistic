import { ordersService } from '@/services/orders.service'
import type { PatchedOrderStatusUpdateDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type UpdateStatusPayload = {
	id: string
	data: PatchedOrderStatusUpdateDto
}

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient()

	const { mutate: updateOrderStatus, isPending: isLoadingUpdateStatus } = useMutation({
		mutationKey: ['order', 'status', 'update'],
		mutationFn: ({ id, data }: UpdateStatusPayload) => ordersService.updateOrderStatus(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			queryClient.invalidateQueries({ queryKey: ['get order', id] })
			toast.success('Order status updated')
		},
		onError() {
			toast.error('Unable to update order status')
		},
	})

	return useMemo(
		() => ({ updateOrderStatus, isLoadingUpdateStatus }),
		[updateOrderStatus, isLoadingUpdateStatus],
	)
}
