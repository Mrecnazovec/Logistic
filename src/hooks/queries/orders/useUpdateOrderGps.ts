import { ordersService } from '@/services/orders.service'
import type { OrderDetailRequestDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

type UpdateOrderGpsPayload = {
	id: string | number
	data: OrderDetailRequestDto
}

export const useUpdateOrderGps = () => {
	const queryClient = useQueryClient()

	const { mutate: updateOrderGps, isPending: isLoadingUpdateOrderGps } = useMutation({
		mutationKey: ['order', 'update-gps'],
		mutationFn: ({ id, data }: UpdateOrderGpsPayload) => ordersService.updateOrderGps(id, data),
		onSuccess(_, payload) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(payload.id)] })
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
		},
	})

	return useMemo(() => ({ updateOrderGps, isLoadingUpdateOrderGps }), [updateOrderGps, isLoadingUpdateOrderGps])
}
