import { agreementsService } from '@/services/agreements.service'
import { DASHBOARD_URL } from '@/config/url.config'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useAcceptAgreement = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: acceptAgreement, isPending: isLoadingAcceptAgreement } = useMutation({
		mutationKey: ['agreement', 'accept'],
		mutationFn: (id: string | number) => agreementsService.acceptAgreement(id),
		onSuccess(_, agreementId) {
			queryClient.invalidateQueries({ queryKey: ['get agreements'] })
			queryClient.invalidateQueries({ queryKey: ['get agreement', agreementId] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success(t('hooks.agreements.accept.success'))
			router.push(DASHBOARD_URL.transportation())
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.agreements.accept.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptAgreement, isLoadingAcceptAgreement }), [acceptAgreement, isLoadingAcceptAgreement])
}
