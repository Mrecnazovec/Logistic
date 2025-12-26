import { offersService } from '@/services/offers.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useRejectOffer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: rejectOffer, isPending: isLoadingRejectOffer } = useMutation({
		mutationKey: ['offer', 'reject'],
		mutationFn: (id: string) => offersService.rejectOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.offers.reject.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.offers.reject.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ rejectOffer, isLoadingRejectOffer }), [rejectOffer, isLoadingRejectOffer])
}
