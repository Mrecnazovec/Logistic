import { offerService } from '@/services/offers.service'
import { IOfferDetail } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePatchOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: patchOffer, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['offer', 'patch'],
		mutationFn: ({ id, data }: { id: string; data: IOfferDetail }) => offerService.patchOffer(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Оффер частично обновлён')
		},
		onError() {
			toast.error('Ошибка при обновлении оффера')
		},
	})

	return useMemo(() => ({ patchOffer, isLoadingPatch }), [patchOffer, isLoadingPatch])
}
