import { offerService } from '@/services/offers.service'
import { OfferCreateDto } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: createOffer, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['offer', 'create'],
		mutationFn: (data: OfferCreateDto) => offerService.createOffer(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Оффер создан')
		},
		onError() {
			toast.error('Ошибка при создании оффера')
		},
	})

	return useMemo(() => ({ createOffer, isLoadingCreate }), [createOffer, isLoadingCreate])
}
