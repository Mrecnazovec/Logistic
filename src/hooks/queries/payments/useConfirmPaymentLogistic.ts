import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { paymentsService } from '@/services/payments.service'
import type { PatchedPaymentRequestDto } from '@/shared/types/Payment.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ConfirmPaymentLogisticPayload = {
	id: number | string
	orderId?: number | string
	data?: PatchedPaymentRequestDto
}

export const useConfirmPaymentLogistic = () => {
	const queryClient = useQueryClient()

	const { mutate: confirmPaymentLogistic, isPending: isLoadingConfirmPaymentLogistic } = useMutation({
		mutationKey: ['payments', 'confirm', 'logistic'],
		mutationFn: ({ id, data }: ConfirmPaymentLogisticPayload) => paymentsService.confirmPaymentLogistic(id, data),
		onSuccess(payment, variables) {
			const orderId = payment?.order ?? variables.orderId

			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(orderId)] })
			}

			toast.success('Оплата подтверждена логистом')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Failed to confirm payment as logistic'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ confirmPaymentLogistic, isLoadingConfirmPaymentLogistic }),
		[confirmPaymentLogistic, isLoadingConfirmPaymentLogistic],
	)
}