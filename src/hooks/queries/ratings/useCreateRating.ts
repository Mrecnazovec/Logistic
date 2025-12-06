import { ratingsService } from '@/services/ratings.service'
import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useCreateRating = () => {
	const queryClient = useQueryClient()

	const { mutate: createRating, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['rating', 'create'],
		mutationFn: (data: UserRatingRequestDto) => ratingsService.createRating(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			toast.success('Оценка отправлена')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отправить оценку'
			toast.error(message)
		},
	})

	return useMemo(() => ({ createRating, isLoadingCreate }), [createRating, isLoadingCreate])
}
