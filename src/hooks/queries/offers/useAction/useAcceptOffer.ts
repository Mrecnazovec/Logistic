import { offerService } from '@/services/offers.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useAcceptOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: acceptOffer, isPending: isLoadingAccept } = useMutation({
		mutationKey: ['offer', 'accept'],
		mutationFn: (id: string) => offerService.acceptOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Оффер принят')
		},
		onError() {
			toast.error('Ошибка при принятии оффера')
		},
	})

	return useMemo(() => ({ acceptOffer, isLoadingAccept }), [acceptOffer, isLoadingAccept])
}
