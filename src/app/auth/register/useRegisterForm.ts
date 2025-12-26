import { PUBLIC_URL } from '@/config/url.config'
import { authService } from '@/services/auth/auth.service'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function useRegisterForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const nextParam = searchParams.get('next')
	const safeNext = nextParam && nextParam.startsWith('/') ? nextParam : null

	const form = useForm<RegisterDto>({
		mode: 'onChange',
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['register user'],
		mutationFn: (data: RegisterDto) => authService.register(data),
		onSuccess() {
			form.reset()

			toast.success('Регистрация прошла успешно')
			router.replace(safeNext ?? PUBLIC_URL.auth('verification'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось завершить регистрацию'
			toast.error(message)
		},
	})

	const onSubmit: SubmitHandler<RegisterDto> = (data) => {
		mutate({
			...data,
			username: data.username ?? data.email,
		})
	}

	return { onSubmit, form, isPending }
}
