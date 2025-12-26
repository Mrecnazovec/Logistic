import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { OrderDetailRequestDto } from '@/shared/types/Order.interface'

export const useConfirmOrderTerms = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type ConfirmOrderTermsPayload = {
		id: string | number
		data: OrderDetailRequestDto
	}
	const { mutate: confirmOrderTerms, isPending: isLoadingConfirmTerms } = useMutation({
		mutationKey: ['order', 'confirm-terms'],
		mutationFn: ({ id, data }: ConfirmOrderTermsPayload) => ordersService.confirmOrderTerms(id, data),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(variables.id)] })
			toast.success(t('hooks.orders.confirmTerms.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.confirmTerms.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ confirmOrderTerms, isLoadingConfirmTerms }), [confirmOrderTerms, isLoadingConfirmTerms])
}
