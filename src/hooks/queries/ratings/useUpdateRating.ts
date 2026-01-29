import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { ratingsService } from '@/services/ratings.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'next/navigation'

type UpdateRatingPayload = {
	id: string
	data: UserRatingRequestDto
}

export const useUpdateRating = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const params = useParams<{ id: string }>()

	const { mutate: updateRating, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['rating', 'update'],
		mutationFn: ({ id, data }: UpdateRatingPayload) => ratingsService.putRating(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			queryClient.invalidateQueries({ queryKey: ['get rating', id] })
			queryClient.invalidateQueries({ queryKey: ['get order', params.id] })

			toast.success(t('hooks.ratings.update.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.ratings.update.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ updateRating, isLoadingUpdate }), [updateRating, isLoadingUpdate])
}
