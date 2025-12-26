import type { OfferCreateDto } from '@/shared/types/Offer.interface'
import { offersService } from '@/services/offers.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateOffer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: createOffer, isPending: isLoadingCreateOffer } = useMutation({
		mutationKey: ['offer', 'create'],
		mutationFn: (data: OfferCreateDto) => offersService.createOffer(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.offers.create.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.offers.create.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ createOffer, isLoadingCreateOffer }), [createOffer, isLoadingCreateOffer])
}
