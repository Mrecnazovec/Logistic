import type { OrderInvitePayload } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useInviteOrderById = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type InviteOrderByIdPayload = {
		id: string | number
		payload: OrderInvitePayload
	}
	const { mutate: inviteOrderById, isPending: isLoadingInviteById } = useMutation({
		mutationKey: ['order', 'invite-by-id'],
		mutationFn: ({ id, payload }: InviteOrderByIdPayload) => ordersService.inviteOrderById(id, payload),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(variables.id)] })
			toast.success(t('hooks.orders.inviteById.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.inviteById.error')
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ inviteOrderById, isLoadingInviteById }),
		[inviteOrderById, isLoadingInviteById],
	)
}
