import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { ILogin } from '@/shared/types/Login.interface'
import { authService } from '@/services/auth/auth.service'

export const useLogin = () => {
	const { mutate: login, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'login'],
		mutationFn: (data: ILogin) => authService.login(data),
		onSuccess() {
			toast.success('Вы успешно вошли')
		},
		onError() {
			toast.error('Ошибка при входе')
		},
	})

	return useMemo(() => ({ login, isLoading }), [login, isLoading])
}
