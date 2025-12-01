import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { IVerifyEmail } from '@/shared/types/Registration.interface'
import { authService } from '@/services/auth/auth.service'

export const useVerifyEmail = () => {
	const { mutate: verifyEmail, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'verify-email'],
		mutationFn: (data: IVerifyEmail) => authService.verifyEmail(data),
		onSuccess() {
			toast.success('Email успешно подтвержден')
		},
		onError() {
			toast.error('Не удалось подтвердить Email')
		},
	})

	return useMemo(() => ({ verifyEmail, isLoading }), [verifyEmail, isLoading])
}
