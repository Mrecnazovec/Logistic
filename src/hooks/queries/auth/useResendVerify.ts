import { authService } from '@/services/auth/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useResendVerify = () => {
	const { mutate: resendVerify, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'resend-verify'],
		mutationFn: (email: string) => authService.resendVerify(email),
		onSuccess() {
			toast.success('Письмо подтверждения отправлено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отправить письмо подтверждения'
			toast.error(message)
		},
	})

	return useMemo(() => ({ resendVerify, isLoading }), [resendVerify, isLoading])
}
