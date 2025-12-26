import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { IVerifyEmail } from '@/shared/types/Registration.interface'

export const useVerifyEmail = () => {
	const { t } = useI18n()
	const { mutate: verifyEmail, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'verify-email'],
		mutationFn: (data: IVerifyEmail) => authService.verifyEmail(data),
		onSuccess() {
			toast.success(t('hooks.auth.verifyEmail.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.verifyEmail.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ verifyEmail, isLoading }), [verifyEmail, isLoading])
}
