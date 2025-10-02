import { offerService } from '@/services/offers.service'
import { IOfferDetail } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePutOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: putOffer, isPending: isLoadingPut } = useMutation({
		mutationKey: ['offer', 'put'],
		mutationFn: ({ id, data }: { id: string; data: IOfferDetail }) => offerService.putOffer(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Оффер обновлён')
		},
		onError() {
			toast.error('Ошибка при обновлении оффера')
		},
	})

	return useMemo(() => ({ putOffer, isLoadingPut }), [putOffer, isLoadingPut])
}
