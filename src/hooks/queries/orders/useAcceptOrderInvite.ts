import { ordersService } from '@/services/orders.service'
import { OrderInvitePayload } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useAcceptOrderInvite = () => {
	const queryClient = useQueryClient()

	const { mutate: acceptOrderInvite, isPending: isLoadingAcceptInvite } = useMutation({
		mutationKey: ['order', 'accept-invite'],
		mutationFn: (payload: OrderInvitePayload) => ordersService.acceptOrderInvite(payload),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(data.id)] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Приглашение принято.')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось принять приглашение.'
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptOrderInvite, isLoadingAcceptInvite }), [acceptOrderInvite, isLoadingAcceptInvite])
}
