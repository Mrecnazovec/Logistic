import { offersService } from '@/services/offers.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useAcceptOffer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: acceptOffer, isPending: isLoadingAcceptOffer } = useMutation({
		mutationKey: ['offer', 'accept'],
		mutationFn: (id: string) => offersService.acceptOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.offers.accept.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.offers.accept.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptOffer, isLoadingAcceptOffer }), [acceptOffer, isLoadingAcceptOffer])
}
