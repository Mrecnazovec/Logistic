import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
export const useConfirmOrderTerms = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: confirmOrderTerms, isPending: isLoadingConfirmTerms } = useMutation({
		mutationKey: ['order', 'confirm-terms'],
		mutationFn: (id: string | number) => ordersService.confirmOrderTerms(id),
		onSuccess(_, id) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(id)] })
			toast.success(t('hooks.orders.confirmTerms.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.confirmTerms.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ confirmOrderTerms, isLoadingConfirmTerms }), [confirmOrderTerms, isLoadingConfirmTerms])
}
