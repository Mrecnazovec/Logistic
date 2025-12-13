import { ordersService } from '@/services/orders.service'
import { OrderDetailRequestDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useConfirmOrderTerms = () => {
	const queryClient = useQueryClient()

	const { mutate: confirmOrderTerms, isPending: isLoadingConfirmTerms } = useMutation({
		mutationKey: ['order', 'confirm-terms'],
		mutationFn: ({ id, data }: { id: string | number; data: OrderDetailRequestDto }) =>
			ordersService.confirmOrderTerms(id, data),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['get order', String(variables.id)] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Условия заказа подтверждены')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось подтвердить условия заказа'
			toast.error(message)
		},
	})

	return useMemo(() => ({ confirmOrderTerms, isLoadingConfirmTerms }), [confirmOrderTerms, isLoadingConfirmTerms])
}
