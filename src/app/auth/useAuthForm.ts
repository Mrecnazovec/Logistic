import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import { authService } from '@/services/auth/auth.service'
import { IErrorResponse } from '@/shared/types/Error.interface'
import { ILogin } from '@/shared/types/Login.interface'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export function useAuthForm() {
	const router = useRouter()

	const form = useForm<ILogin>({
		mode: 'onChange',
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['auth user'],
		mutationFn: (data: ILogin) => authService.login(data),
		onSuccess(result) {
			form.reset()
			const isVerified = result.user.is_email_verified

			if (isVerified === false) {
				router.replace(PUBLIC_URL.auth('verification'))
				return
			}

			toast.success('Успешная авторизация')
			router.refresh()
			router.push(DASHBOARD_URL.announcements())
		},
		onError(error) {
			const err = error as AxiosError<IErrorResponse>

			if (err.response) {
				toast.error(err.response.data.detail)
			} else {
				toast.error('Ошибка при авторизации')
			}
		},
	})

	const onSubmit: SubmitHandler<ILogin> = (data) => {
		mutate(data)
	}

	return { onSubmit, form, isPending }
}
