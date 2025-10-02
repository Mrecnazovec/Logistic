import { offerService } from '@/services/offers.service'
import { IOfferCounter } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCounterOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: counterOffer, isPending: isLoadingCounter } = useMutation({
		mutationKey: ['offer', 'counter'],
		mutationFn: ({ id, data }: { id: string; data: IOfferCounter }) => offerService.counterOffer(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Контр-предложение отправлено')
		},
		onError() {
			toast.error('Ошибка при контр-предложении')
		},
	})

	return useMemo(() => ({ counterOffer, isLoadingCounter }), [counterOffer, isLoadingCounter])
}
