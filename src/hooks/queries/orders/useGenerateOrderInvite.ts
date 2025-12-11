import { ordersService } from '@/services/orders.service'
import { OrderInvitePayload } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useGenerateOrderInvite = () => {
	const queryClient = useQueryClient()

	const {
		mutate: generateOrderInvite,
		mutateAsync: generateOrderInviteAsync,
		data: generatedOrder,
		isPending: isLoadingGenerateInvite,
		reset,
	} = useMutation({
		mutationKey: ['order', 'generate-invite'],
		mutationFn: ({ id, payload }: { id: string; payload: OrderInvitePayload }) =>
			ordersService.generateOrderInvite(id, payload),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(data.id)] })
			toast.success('Приглашение по заказу обновлено.')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось создать приглашение для заказа.'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({
			generateOrderInvite,
			generateOrderInviteAsync,
			generatedOrder,
			isLoadingGenerateInvite,
			resetGenerateInvite: reset,
		}),
		[generateOrderInvite, generateOrderInviteAsync, generatedOrder, isLoadingGenerateInvite, reset],
	)
}
