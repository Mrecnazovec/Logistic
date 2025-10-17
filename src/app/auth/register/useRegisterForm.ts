import { PUBLIC_URL } from '@/config/url.config'
import { authService } from '@/services/auth/auth.service'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface IErrorResponse {
	message: string
}

export function useRegisterForm() {
	const router = useRouter()

	const form = useForm<RegisterDto>({
		mode: 'onChange',
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['register user'],
		mutationFn: (data: RegisterDto) => authService.register(data),
		onSuccess(result) {
			form.reset()

			toast.success('Мы отправили письмо с кодом подтверждения')
			router.replace(PUBLIC_URL.auth('verification'))
		},
		onError(error) {
			const err = error as AxiosError<IErrorResponse>
			if (err.response) {
				toast.error(err.response.data?.message)
			} else {
				toast.error('Ошибка при регистрации')
			}
		},
	})

	const onSubmit: SubmitHandler<RegisterDto> = (data) => {
		// mutate(data)
		console.log(data);
		
	}

	return { onSubmit, form, isPending }
}
