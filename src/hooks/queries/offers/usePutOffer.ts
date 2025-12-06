import { offerService } from '@/services/offers.service'
import { OfferDetailDto } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const usePutOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: putOffer, isPending: isLoadingPut } = useMutation({
		mutationKey: ['offer', 'put'],
		mutationFn: ({ id, data }: { id: string; data: OfferDetailDto }) => offerService.putOffer(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			queryClient.invalidateQueries({ queryKey: ['get offer', id] })
			toast.success('Оффер обновлен')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Ошибка при обновлении оффера'
			toast.error(message)
		},
	})

	return useMemo(() => ({ putOffer, isLoadingPut }), [putOffer, isLoadingPut])
}
