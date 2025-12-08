import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { paymentsService } from '@/services/payments.service'
import type { PaymentCreateDto } from '@/shared/types/Payment.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useCreatePayment = () => {
	const queryClient = useQueryClient()

	const { mutate: createPayment, isPending: isLoadingCreatePayment } = useMutation({
		mutationKey: ['payments', 'create'],
		mutationFn: (data: PaymentCreateDto) => paymentsService.createPayment(data),
		onSuccess(payment, variables) {
			const orderId = payment?.order ?? variables.order

			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(orderId)] })
			}

			toast.success('Payment created')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Failed to create payment'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ createPayment, isLoadingCreatePayment }),
		[createPayment, isLoadingCreatePayment],
	)
}
