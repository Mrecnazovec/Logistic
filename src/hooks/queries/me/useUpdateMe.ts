import type { UpdateMeDto } from '@/shared/types/Me.interface'
import { meService } from '@/services/me.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useUpdateMe = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: updateMe, isPending: isLoadingUpdateMe } = useMutation({
		mutationKey: ['me', 'update'],
		mutationFn: (data: UpdateMeDto) => meService.updateMe(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get profile'] })
			toast.success(t('hooks.me.update.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.me.update.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ updateMe, isLoadingUpdateMe }), [updateMe, isLoadingUpdateMe])
}
