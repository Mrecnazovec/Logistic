import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth/auth.service'
import { useI18n } from '@/i18n/I18nProvider'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useRegister = () => {
	const { t } = useI18n()
	const { mutate: register, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'register'],
		mutationFn: (data: RegisterDto) => authService.register(data),
		onSuccess() {
			toast.success(t('hooks.auth.register.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.register.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ register, isLoading }), [register, isLoading])
}
