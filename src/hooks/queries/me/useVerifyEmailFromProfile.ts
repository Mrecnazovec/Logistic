import type { VerifyEmailFromProfileDto } from '@/shared/types/Me.interface'
import { meService } from '@/services/me.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useVerifyEmailFromProfile = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: verifyEmail, isPending: isLoading } = useMutation({
		mutationKey: ['me', 'email-verify'],
		mutationFn: (data: VerifyEmailFromProfileDto) => meService.verifyEmailFromProfile(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get profile'] })
			toast.success(t('hooks.me.emailVerify.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.me.emailVerify.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ verifyEmail, isLoading }), [verifyEmail, isLoading])
}
