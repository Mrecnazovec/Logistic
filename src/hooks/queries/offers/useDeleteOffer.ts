import { offerService } from '@/services/offers.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useDeleteOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: deleteOffer, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['offer', 'delete'],
		mutationFn: (id: string) => offerService.deleteOffer(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Оффер удалён')
		},
		onError() {
			toast.error('Ошибка при удалении оффера')
		},
	})

	return useMemo(() => ({ deleteOffer, isLoadingDelete }), [deleteOffer, isLoadingDelete])
}
