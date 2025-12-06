import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { IForgotPassword } from '@/shared/types/Login.interface'
import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useForgotPassword = () => {
	const { mutate: forgotPassword, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'forgot-password'],
		mutationFn: (data: IForgotPassword) => authService.forgotPassword(data),
		onSuccess() {
			toast.success('Письмо для сброса отправлено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отправить письмо для сброса'
			toast.error(message)
		},
	})

	return useMemo(() => ({ forgotPassword, isLoading }), [forgotPassword, isLoading])
}
