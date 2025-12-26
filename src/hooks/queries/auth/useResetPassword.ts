import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { IResetPassword } from '@/shared/types/Login.interface'

export const useResetPassword = () => {
	const { t } = useI18n()
	const { mutate: resetPassword, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'reset-password'],
		mutationFn: (data: IResetPassword) => authService.resetPassword(data),
		onSuccess() {
			toast.success(t('hooks.auth.resetPassword.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.resetPassword.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ resetPassword, isLoading }), [resetPassword, isLoading])
}
