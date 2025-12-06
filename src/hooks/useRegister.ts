import { authService } from '@/services/auth/auth.service'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useRegister = () => {
	const { mutate: register, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'register'],
		mutationFn: (data: RegisterDto) => authService.register(data),
		onSuccess() {
			toast.success('Регистрация завершена')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось завершить регистрацию'
			toast.error(message)
		},
	})

	return useMemo(() => ({ register, isLoading }), [register, isLoading])
}
