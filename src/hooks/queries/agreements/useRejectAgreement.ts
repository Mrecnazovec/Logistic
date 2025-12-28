import { agreementsService } from '@/services/agreements.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const useRejectAgreement = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: rejectAgreement, isPending: isLoadingRejectAgreement } = useMutation({
		mutationKey: ['agreement', 'reject'],
		mutationFn: (id: string | number) => agreementsService.rejectAgreement(id),
		onSuccess(_, agreementId) {
			queryClient.invalidateQueries({ queryKey: ['get agreements'] })
			queryClient.invalidateQueries({ queryKey: ['get agreement', agreementId] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			router.back()
			toast.success(t('hooks.agreements.reject.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.agreements.reject.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ rejectAgreement, isLoadingRejectAgreement }), [rejectAgreement, isLoadingRejectAgreement])
}
