import { authService } from '@/services/auth/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useResendVerify = () => {
	const { mutate: resendVerify, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'resend-verify'],
		mutationFn: (email: string) => authService.resendVerify(email),
		onSuccess() {
			toast.success('Письмо подтверждения отправлено повторно')
		},
		onError() {
			toast.error('Не удалось отправить письмо подтверждения')
		},
	})

	return useMemo(() => ({ resendVerify, isLoading }), [resendVerify, isLoading])
}
