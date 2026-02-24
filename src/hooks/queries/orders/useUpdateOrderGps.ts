import { ordersService } from '@/services/orders.service'
import type { GpsUpdateRequestDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

type UpdateOrderGpsPayload = {
	orderId?: string | number
	data: GpsUpdateRequestDto
}

export const useUpdateOrderGps = () => {
	const queryClient = useQueryClient()

	const { mutate: updateOrderGps, isPending: isLoadingUpdateOrderGps } = useMutation({
		mutationKey: ['order', 'update-gps'],
		mutationFn: ({ data }: UpdateOrderGpsPayload) => ordersService.updateOrderGps(data),
		onSuccess(_, payload) {
			if (payload.orderId !== undefined) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(payload.orderId)] })
			}
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
		},
	})

	return useMemo(() => ({ updateOrderGps, isLoadingUpdateOrderGps }), [updateOrderGps, isLoadingUpdateOrderGps])
}
