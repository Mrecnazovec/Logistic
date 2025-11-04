import { ordersService } from '@/services/orders.service'
import type { OrderDetailRequestDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type UpdateOrderPayload = {
	id: string
	data: OrderDetailRequestDto
}

export const useUpdateOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: updateOrder, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['order', 'update'],
		mutationFn: ({ id, data }: UpdateOrderPayload) => ordersService.putOrder(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			queryClient.invalidateQueries({ queryKey: ['get order', id] })
			toast.success('Order updated')
		},
		onError() {
			toast.error('Unable to update order')
		},
	})

	return useMemo(() => ({ updateOrder, isLoadingUpdate }), [updateOrder, isLoadingUpdate])
}
