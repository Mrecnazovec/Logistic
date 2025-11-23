import { ordersService } from '@/services/orders.service'
import type { PatchedOrderDriverStatusUpdateDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type UpdateStatusPayload = {
	id: string
	data: PatchedOrderDriverStatusUpdateDto
}

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient()

	const { mutate: updateDriverStatus, isPending: isLoadingUpdateStatus } = useMutation({
		mutationKey: ['order', 'driver-status', 'update'],
		mutationFn: ({ id, data }: UpdateStatusPayload) => ordersService.updateDriverStatus(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			queryClient.invalidateQueries({ queryKey: ['get order', id] })
			toast.success('Статус водителя обновлён')
		},
		onError() {
			toast.error('Ошибка при обновлении статуса водителя')
		},
	})

	return useMemo(
		() => ({ updateDriverStatus, isLoadingUpdateStatus }),
		[updateDriverStatus, isLoadingUpdateStatus],
	)
}
