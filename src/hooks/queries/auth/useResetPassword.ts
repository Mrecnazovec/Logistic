import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { IResetPassword } from '@/shared/types/Login.interface'
import { authService } from '@/services/auth/auth.service'

export const useResetPassword = () => {
	const { mutate: resetPassword, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'reset-password'],
		mutationFn: (data: IResetPassword) => authService.resetPassword(data),
		onSuccess() {
			toast.success('Пароль успешно изменён')
		},
		onError() {
			toast.error('Ошибка при смене пароля')
		},
	})

	return useMemo(() => ({ resetPassword, isLoading }), [resetPassword, isLoading])
}
