import { offersService } from '@/services/offers.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useDeleteOffer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()

	const { mutate: deleteOffer, isPending: isLoadingDeleteOffer } = useMutation({
		mutationKey: ['offer', 'delete'],
		mutationFn: (id: string) => offersService.deleteOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.offers.delete.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.offers.delete.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ deleteOffer, isLoadingDeleteOffer }), [deleteOffer, isLoadingDeleteOffer])
}
