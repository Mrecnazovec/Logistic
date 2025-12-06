import { offerService } from '@/services/offers.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useRejectOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: rejectOffer, isPending: isLoadingReject } = useMutation({
		mutationKey: ['offer', 'reject'],
		mutationFn: (id: string) => offerService.rejectOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Предложение отклонено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отклонить предложение'
			toast.error(message)
		},
	})

	return useMemo(() => ({ rejectOffer, isLoadingReject }), [rejectOffer, isLoadingReject])
}
