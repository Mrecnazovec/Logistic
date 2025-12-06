import { offerService } from '@/services/offers.service'
import { PatchedOfferDetailDto } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const usePatchOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: patchOffer, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['offer', 'patch'],
		mutationFn: ({ id, data }: { id: string; data: PatchedOfferDetailDto }) => offerService.patchOffer(id, data),
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

	return useMemo(() => ({ patchOffer, isLoadingPatch }), [patchOffer, isLoadingPatch])
}
