import { offerService } from '@/services/offers.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useRejectOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: rejectOffer, isPending: isLoadingReject } = useMutation({
		mutationKey: ['offer', 'reject'],
		mutationFn: (id: string) => offerService.rejectOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Оффер отклонён')
		},
		onError() {
			toast.error('Ошибка при отклонении оффера')
		},
	})

	return useMemo(() => ({ rejectOffer, isLoadingReject }), [rejectOffer, isLoadingReject])
}
