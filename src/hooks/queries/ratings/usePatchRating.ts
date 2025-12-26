import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { ratingsService } from '@/services/ratings.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type PatchRatingPayload = {
	id: string
	data: UserRatingRequestDto
}

export const usePatchRating = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()

	const { mutate: patchRating, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['rating', 'patch'],
		mutationFn: ({ id, data }: PatchRatingPayload) => ratingsService.patchRating(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get ratings'] })
			queryClient.invalidateQueries({ queryKey: ['get rating', id] })
			toast.success(t('hooks.ratings.patch.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.ratings.patch.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ patchRating, isLoadingPatch }), [patchRating, isLoadingPatch])
}
