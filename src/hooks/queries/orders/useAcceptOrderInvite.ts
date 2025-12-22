import { DASHBOARD_URL } from '@/config/url.config'
import { ordersService } from '@/services/orders.service'
import { OrderInvitePayload } from '@/shared/types/Order.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useAcceptOrderInvite = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: acceptOrderInvite, isPending: isLoadingAcceptInvite } = useMutation({
		mutationKey: ['order', 'accept-invite'],
		mutationFn: (payload: OrderInvitePayload) => ordersService.acceptOrderInvite(payload),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(data.id)] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Приглашение принято.')
			router.push(DASHBOARD_URL.order(String(data.id)))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось принять приглашение.'
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptOrderInvite, isLoadingAcceptInvite }), [acceptOrderInvite, isLoadingAcceptInvite])
}
