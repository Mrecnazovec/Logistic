import { ratingsService } from '@/services/ratings.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useDeleteRating = () => {
	const queryClient = useQueryClient()

	const { mutate: deleteRating, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['rating', 'delete'],
		mutationFn: (id: string) => ratingsService.deleteRating(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			toast.success('Оценка удалена')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Unable to delete rating'
			toast.error(message)
		},
	})

	return useMemo(() => ({ deleteRating, isLoadingDelete }), [deleteRating, isLoadingDelete])
}
