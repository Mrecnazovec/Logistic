import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ILogin } from '@/shared/types/Login.interface'
import { authService } from '@/services/auth/auth.service'
import { useI18n } from '@/i18n/I18nProvider'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useLogin = () => {
	const { t } = useI18n()
	const { mutate: login, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'login'],
		mutationFn: (data: ILogin) => authService.login(data),
		onSuccess() {
			toast.success(t('hooks.auth.login.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.login.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ login, isLoading }), [login, isLoading])
}
