import { ordersService } from '@/services/orders.service'
import { OrderDetailRequestDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useCreateOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: createOrder, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['order', 'create'],
		mutationFn: (data: OrderDetailRequestDto) => ordersService.createOrder(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Заказ создан')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Unable to create order'
			toast.error(message)
		},
	})

	return useMemo(() => ({ createOrder, isLoadingCreate }), [createOrder, isLoadingCreate])
}
