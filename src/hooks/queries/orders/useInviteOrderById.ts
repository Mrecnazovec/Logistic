import { ordersService } from '@/services/orders.service'
import { OrderInvitePayload } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useInviteOrderById = () => {
	const queryClient = useQueryClient()

	const { mutate: inviteOrderById, isPending: isLoadingInviteById } = useMutation({
		mutationKey: ['order', 'invite-by-id'],
		mutationFn: ({ id, payload }: { id: string; payload: OrderInvitePayload }) =>
			ordersService.inviteOrderById(id, payload),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(data.id)] })
			toast.success('Приглашение отправлено пользователю.')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отправить приглашение.'
			toast.error(message)
		},
	})

	return useMemo(() => ({ inviteOrderById, isLoadingInviteById }), [inviteOrderById, isLoadingInviteById])
}
