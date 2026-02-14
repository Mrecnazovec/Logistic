import { ordersService } from '@/services/orders.service'
import { useI18n } from '@/i18n/I18nProvider'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useToggleOrderPrivacy = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()

	const { mutate: toggleOrderPrivacy, isPending: isLoadingToggleOrderPrivacy } = useMutation({
		mutationKey: ['order', 'toggle-privacy'],
		mutationFn: ({id, isHidden}:{id: string, isHidden: boolean}) => ordersService.toggleOrderPrivacy(id, isHidden),
		onSuccess(_, id) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(id)] })
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			toast.success(t('hooks.orders.togglePrivacy.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.togglePrivacy.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ toggleOrderPrivacy, isLoadingToggleOrderPrivacy }), [toggleOrderPrivacy, isLoadingToggleOrderPrivacy])
}
