import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { ILogin } from '@/shared/types/Login.interface'
import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useLogin = () => {
	const { mutate: login, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'login'],
		mutationFn: (data: ILogin) => authService.login(data),
		onSuccess() {
			toast.success('Вход выполнен')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось выполнить вход'
			toast.error(message)
		},
	})

	return useMemo(() => ({ login, isLoading }), [login, isLoading])
}
