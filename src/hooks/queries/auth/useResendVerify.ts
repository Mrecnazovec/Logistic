import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useResendVerify = () => {
	const { t } = useI18n()
	const { mutate: resendVerify, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'resend-verify'],
		mutationFn: (email: string) => authService.resendVerify(email),
		onSuccess() {
			toast.success(t('hooks.auth.resendVerify.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.resendVerify.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ resendVerify, isLoading }), [resendVerify, isLoading])
}
