import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import { authService } from '@/services/auth/auth.service'
import { ILogin } from '@/shared/types/Login.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export function useAuthForm() {
	const { t } = useI18n()
	const router = useRouter()
	const searchParams = useSearchParams()
	const nextParam = searchParams.get('next')
	const safeNext = nextParam && nextParam.startsWith('/') ? nextParam : null

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

			toast.success(t('auth.toast.success'))
			setTimeout(() => router.refresh(), 3000)
			router.push(safeNext ?? DASHBOARD_URL.home())
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('auth.toast.error')
			toast.error(message)
		},
	})

	const onSubmit: SubmitHandler<ILogin> = (data) => {
		mutate(data)
	}

	return { onSubmit, form, isPending }
}
