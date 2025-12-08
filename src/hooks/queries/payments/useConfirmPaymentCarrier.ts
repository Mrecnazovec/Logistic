import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { paymentsService } from '@/services/payments.service'
import type { PatchedPaymentRequestDto } from '@/shared/types/Payment.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ConfirmPaymentCarrierPayload = {
	id: number | string
	orderId?: number | string
	data?: PatchedPaymentRequestDto
}

export const useConfirmPaymentCarrier = () => {
	const queryClient = useQueryClient()

	const { mutate: confirmPaymentCarrier, isPending: isLoadingConfirmPaymentCarrier } = useMutation({
		mutationKey: ['payments', 'confirm', 'carrier'],
		mutationFn: ({ id, data }: ConfirmPaymentCarrierPayload) => paymentsService.confirmPaymentCarrier(id, data),
		onSuccess(payment, variables) {
			const orderId = payment?.order ?? variables.orderId

			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(orderId)] })
			}

			toast.success('Payment confirmed by carrier')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Failed to confirm payment as carrier'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ confirmPaymentCarrier, isLoadingConfirmPaymentCarrier }),
		[confirmPaymentCarrier, isLoadingConfirmPaymentCarrier],
	)
}
