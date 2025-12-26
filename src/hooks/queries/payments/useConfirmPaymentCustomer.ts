import type { PatchedPaymentRequestDto } from '@/shared/types/Payment.interface'
import { paymentsService } from '@/services/payments.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type ConfirmPaymentCustomerPayload = {
	id: number | string
	orderId?: number | string
	data?: PatchedPaymentRequestDto
}

export const useConfirmPaymentCustomer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()

	const { mutate: confirmPaymentCustomer, isPending: isLoadingConfirmPaymentCustomer } = useMutation({
		mutationKey: ['payments', 'confirm', 'customer'],
		mutationFn: ({ id, data }: ConfirmPaymentCustomerPayload) => paymentsService.confirmPaymentCustomer(id, data),
		onSuccess(payment, variables) {
			const orderId = payment?.order ?? variables.orderId

			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ['get order', String(orderId)] })
			}

			toast.success(t('hooks.payments.confirm.customer.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.payments.confirm.customer.error')
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ confirmPaymentCustomer, isLoadingConfirmPaymentCustomer }),
		[confirmPaymentCustomer, isLoadingConfirmPaymentCustomer],
	)
}
