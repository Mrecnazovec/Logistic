import { ordersService } from '@/services/orders.service'
import type { PatchedOrderDriverStatusUpdateDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient()

	const { mutate: updateDriverStatus, isPending: isLoadingUpdateStatus } = useMutation({
		mutationKey: ['order', 'driver-status'],
		mutationFn: ({ id, data }: { id: string; data: PatchedOrderDriverStatusUpdateDto }) =>
			ordersService.updateDriverStatus(id, data),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['get order', variables.id] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Driver status updated')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Failed to update driver status'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ updateDriverStatus, isLoadingUpdateStatus }),
		[updateDriverStatus, isLoadingUpdateStatus],
	)
}
