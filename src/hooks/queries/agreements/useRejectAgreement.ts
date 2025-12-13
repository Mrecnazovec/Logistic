import { agreementsService } from '@/services/agreements.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useRouter } from 'next/navigation'
import { DASHBOARD_URL } from '@/config/url.config'

export const useRejectAgreement = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: rejectAgreement, isPending: isLoadingRejectAgreement } = useMutation({
		mutationKey: ['agreement', 'reject'],
		mutationFn: (id: string | number) => agreementsService.rejectAgreement(id),
		onSuccess(_, agreementId) {
			queryClient.invalidateQueries({ queryKey: ['get agreements'] })
			queryClient.invalidateQueries({ queryKey: ['get agreement', agreementId] })
			toast.success('Соглашение отклонено')
			router.push(DASHBOARD_URL.transportation())
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отклонить соглашение'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ rejectAgreement, isLoadingRejectAgreement }),
		[rejectAgreement, isLoadingRejectAgreement],
	)
}
