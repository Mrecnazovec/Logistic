import { ordersService } from '@/services/orders.service'
import type { PatchedOrderDetailDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type PatchOrderPayload = {
	id: string
	data: PatchedOrderDetailDto
}

export const usePatchOrder = () => {
	const queryClient = useQueryClient()

	const { mutate: patchOrder, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['order', 'patch'],
		mutationFn: ({ id, data }: PatchOrderPayload) => ordersService.patchOrder(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			queryClient.invalidateQueries({ queryKey: ['get order', id] })
			toast.success('Order updated')
		},
		onError() {
			toast.error('Unable to update order')
		},
	})

	return useMemo(() => ({ patchOrder, isLoadingPatch }), [patchOrder, isLoadingPatch])
}
