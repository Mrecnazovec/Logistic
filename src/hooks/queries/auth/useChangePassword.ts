import type { IChangePassword } from '@/shared/types/Login.interface'
import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useChangePassword = () => {
	const { t } = useI18n()
	const { mutate: changePassword, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'change-password'],
		mutationFn: (data: IChangePassword) => authService.changePassword(data),
		onSuccess() {
			toast.success(t('hooks.auth.changePassword.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.changePassword.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ changePassword, isLoading }), [changePassword, isLoading])
}
