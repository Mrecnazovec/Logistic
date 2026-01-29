import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { ratingsService } from '@/services/ratings.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'next/navigation'

export const useCreateRating = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const params = useParams<{ id: string }>()

	const { mutate: createRating, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['rating', 'create'],
		mutationFn: (data: UserRatingRequestDto) => ratingsService.createRating(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get ratings', 'carrier'] })
			queryClient.invalidateQueries({ queryKey: ['get ratings', 'customer'] })
			queryClient.invalidateQueries({ queryKey: ['get order', params.id] })
			toast.success(t('hooks.ratings.create.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.ratings.create.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ createRating, isLoadingCreate }), [createRating, isLoadingCreate])
}
