import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { paymentsService } from '@/services/payments.service'
import type { PatchedPaymentRequestDto } from '@/shared/types/Payment.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ConfirmPaymentCustomerPayload = {
	id: number | string
	orderId?: number | string
	data?: PatchedPaymentRequestDto
}

export const useConfirmPaymentCustomer = () => {
	const queryClient = useQueryClient()

	const { mutate: confirmPaymentCustomer, isPending: isLoadingConfirmPaymentCustomer } = useMutation({
		mutationKey: ['payments', 'confirm', 'customer'],
		mutationFn: ({ id, data }: ConfirmPaymentCustomerPayload) => paymentsService.confirmPaymentCustomer(id, data),
		onSuccess(payment, variables) {
			const orderId = payment?.order ?? variables.orderId

			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(orderId)] })
			}

			toast.success('Payment confirmed by customer')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Failed to confirm payment as customer'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ confirmPaymentCustomer, isLoadingConfirmPaymentCustomer }),
		[confirmPaymentCustomer, isLoadingConfirmPaymentCustomer],
	)
}
