import { agreementsService } from '@/services/agreements.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useRouter } from 'next/navigation'
import { DASHBOARD_URL } from '@/config/url.config'

export const useAcceptAgreement = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: acceptAgreement, isPending: isLoadingAcceptAgreement } = useMutation({
		mutationKey: ['agreement', 'accept'],
		mutationFn: (id: string | number) => agreementsService.acceptAgreement(id),
		onSuccess(_, agreementId) {
			queryClient.invalidateQueries({ queryKey: ['get agreements'] })
			queryClient.invalidateQueries({ queryKey: ['get agreement', agreementId] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Соглашение подтверждено')
			router.push(DASHBOARD_URL.transportation())
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось подтвердить соглашение'
			toast.error(message)
		},
	})

	return useMemo(() => ({ acceptAgreement, isLoadingAcceptAgreement }), [acceptAgreement, isLoadingAcceptAgreement])
}
