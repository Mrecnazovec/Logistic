import { ratingsService } from '@/services/ratings.service'
import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

type UpdateRatingPayload = {
	id: string
	data: UserRatingRequestDto
}

export const useUpdateRating = () => {
	const queryClient = useQueryClient()

	const { mutate: updateRating, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['rating', 'update'],
		mutationFn: ({ id, data }: UpdateRatingPayload) => ratingsService.putRating(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			queryClient.invalidateQueries({ queryKey: ['get rating', id] })
			toast.success('Rating updated')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Unable to update rating'
			toast.error(message)
		},
	})

	return useMemo(() => ({ updateRating, isLoadingUpdate }), [updateRating, isLoadingUpdate])
}
