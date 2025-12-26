import type { IOrderDetail, OrderInvitePayload } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export const useGenerateOrderInvite = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const [generatedOrder, setGeneratedOrder] = useState<IOrderDetail | null>(null)
	const resetGenerateInvite = () => setGeneratedOrder(null)
	type GenerateOrderInvitePayload = {
		id: string | number
		payload: OrderInvitePayload
	}
	const { mutate: generateOrderInvite, isPending: isLoadingGenerateInvite } = useMutation({
		mutationKey: ['order', 'generate-invite'],
		mutationFn: ({ id, payload }: GenerateOrderInvitePayload) => ordersService.generateOrderInvite(id, payload),
		onSuccess(order, variables) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(variables.id)] })
			setGeneratedOrder(order)
			toast.success(t('hooks.orders.generateInvite.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.generateInvite.error')
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ generateOrderInvite, generatedOrder, isLoadingGenerateInvite, resetGenerateInvite }),
		[generateOrderInvite, generatedOrder, isLoadingGenerateInvite],
	)
}
