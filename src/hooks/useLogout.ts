import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth/auth.service'
import { useI18n } from '@/i18n/I18nProvider'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useLogout = () => {
	const { t } = useI18n()
	const router = useRouter()

	const { mutate: logout, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'logout'],
		mutationFn: (refresh?: string) => authService.logout(refresh),
		onSuccess() {
			toast.success(t('hooks.auth.logout.success'))
			router.refresh()
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.logout.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ logout, isLoading }), [logout, isLoading])
}
