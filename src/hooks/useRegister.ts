import { authService } from '@/services/auth/auth.service'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useRegister = () => {
	const { mutate: register, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'register'],
		mutationFn: (data: RegisterDto) => authService.register(data),
		onSuccess() {
			toast.success('Регистрация прошла успешно')
		},
		onError() {
			toast.error('Ошибка при регистрации')
		},
	})

	return useMemo(() => ({ register, isLoading }), [register, isLoading])
}
