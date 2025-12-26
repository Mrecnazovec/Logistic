import { ratingsService } from '@/services/ratings.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useDeleteRating = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: deleteRating, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['rating', 'delete'],
		mutationFn: (id: string | number) => ratingsService.deleteRating(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get ratings', 'carrier'] })
			queryClient.invalidateQueries({ queryKey: ['get ratings', 'customer'] })
			toast.success(t('hooks.ratings.delete.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.ratings.delete.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ deleteRating, isLoadingDelete }), [deleteRating, isLoadingDelete])
}
