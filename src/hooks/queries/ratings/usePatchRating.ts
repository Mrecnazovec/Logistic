import { ratingsService } from '@/services/ratings.service'
import type { PatchedUserRatingRequestDto } from '@/shared/types/Rating.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type PatchRatingPayload = {
	id: string
	data: PatchedUserRatingRequestDto
}

export const usePatchRating = () => {
	const queryClient = useQueryClient()

	const { mutate: patchRating, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['rating', 'patch'],
		mutationFn: ({ id, data }: PatchRatingPayload) => ratingsService.patchRating(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			queryClient.invalidateQueries({ queryKey: ['get rating', id] })
			toast.success('Rating updated')
		},
		onError() {
			toast.error('Unable to update rating')
		},
	})

	return useMemo(() => ({ patchRating, isLoadingPatch }), [patchRating, isLoadingPatch])
}
