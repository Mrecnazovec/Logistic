import type { UpdateMeDto } from '@/shared/types/Me.interface'
import { meService } from '@/services/me.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePatchMe = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: patchMe, isPending: isLoadingPatchMe } = useMutation({
		mutationKey: ['me', 'patch'],
		mutationFn: (data: UpdateMeDto) => meService.patchMe(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get profile'] })
			toast.success(t('hooks.me.patch.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.me.patch.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ patchMe, isLoadingPatchMe }), [patchMe, isLoadingPatchMe])
}
