import type { PatchedPaymentRequestDto } from '@/shared/types/Payment.interface'
import { paymentsService } from '@/services/payments.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type ConfirmPaymentLogisticPayload = {
	id: number | string
	orderId?: number | string
	data?: PatchedPaymentRequestDto
}

export const useConfirmPaymentLogistic = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()

	const { mutate: confirmPaymentLogistic, isPending: isLoadingConfirmPaymentLogistic } = useMutation({
		mutationKey: ['payments', 'confirm', 'logistic'],
		mutationFn: ({ id, data }: ConfirmPaymentLogisticPayload) => paymentsService.confirmPaymentLogistic(id, data),
		onSuccess(payment, variables) {
			const orderId = payment?.order ?? variables.orderId

			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(orderId)] })
			}

			toast.success(t('hooks.payments.confirm.logistic.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.payments.confirm.logistic.error')
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ confirmPaymentLogistic, isLoadingConfirmPaymentLogistic }),
		[confirmPaymentLogistic, isLoadingConfirmPaymentLogistic],
	)
}
