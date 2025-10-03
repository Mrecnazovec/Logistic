import { authService } from '@/services/auth/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useLogout = () => {
	const { mutate: logout, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'logout'],
		mutationFn: (refresh?: string) => authService.logout(refresh),
		onSuccess() {
			toast.success('Вы вышли из аккаунта')
		},
		onError() {
			toast.error('Ошибка при выходе')
		},
	})

	return useMemo(() => ({ logout, isLoading }), [logout, isLoading])
}
