import type { IOfferCounter } from '@/shared/types/Offer.interface'
import { offersService } from '@/services/offers.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCounterOffer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type Payload = {
		id: string
		data: IOfferCounter
	}
	const { mutate: counterOffer, isPending: isLoadingCounterOffer } = useMutation({
		mutationKey: ['offer', 'counter'],
		mutationFn: ({ id, data }: Payload) => offersService.counterOffer(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.offers.counter.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.offers.counter.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ counterOffer, isLoadingCounterOffer }), [counterOffer, isLoadingCounterOffer])
}
