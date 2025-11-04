import { ordersService } from '@/services/orders.service'
import type { OrderDetailRequestDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: createOrder, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['order', 'create'],
		mutationFn: (data: OrderDetailRequestDto) => ordersService.createOrder(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Order created')
		},
		onError() {
			toast.error('Unable to create order')
		},
	})

	return useMemo(() => ({ createOrder, isLoadingCreate }), [createOrder, isLoadingCreate])
}
