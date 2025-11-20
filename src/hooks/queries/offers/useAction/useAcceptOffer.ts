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
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Предложение принято')
		},
		onError() {
			toast.error('Не удалось принять предложение')
		},
	})

	return useMemo(() => ({ acceptOffer, isLoadingAccept }), [acceptOffer, isLoadingAccept])
}
