import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth/auth.service'
import { useI18n } from '@/i18n/I18nProvider'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useAgreementRealtimeStore } from '@/store/useAgreementRealtimeStore'
import { useOfferRealtimeStore } from '@/store/useOfferRealtimeStore'

export const useLogout = () => {
	const { t } = useI18n()
	const router = useRouter()
	const resetOffers = useOfferRealtimeStore((state) => state.resetOffers)
	const resetAgreementUpdates = useAgreementRealtimeStore((state) => state.resetAgreementUpdates)

	const { mutate: logout, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'logout'],
		mutationFn: (refresh?: string) => authService.logout(refresh),
		onSuccess() {
			resetOffers()
			resetAgreementUpdates()
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
