import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { IForgotPassword } from '@/shared/types/Login.interface'

export const useForgotPassword = () => {
	const { t } = useI18n()
	const { mutate: forgotPassword, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'forgot-password'],
		mutationFn: (data: IForgotPassword) => authService.forgotPassword(data),
		onSuccess() {
			toast.success(t('hooks.auth.forgotPassword.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.forgotPassword.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ forgotPassword, isLoading }), [forgotPassword, isLoading])
}
