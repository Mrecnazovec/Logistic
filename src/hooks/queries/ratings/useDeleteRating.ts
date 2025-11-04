import { ratingsService } from '@/services/ratings.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useDeleteRating = () => {
	const queryClient = useQueryClient()

	const { mutate: deleteRating, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['rating', 'delete'],
		mutationFn: (id: string) => ratingsService.deleteRating(id),
		onSuccess(_, id) {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			queryClient.invalidateQueries({ queryKey: ['get rating', id] })
			toast.success('Rating deleted')
		},
		onError() {
			toast.error('Unable to delete rating')
		},
	})

	return useMemo(() => ({ deleteRating, isLoadingDelete }), [deleteRating, isLoadingDelete])
}
