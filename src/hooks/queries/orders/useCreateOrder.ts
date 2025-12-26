import type { OrderDetailRequestDto } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateOrder = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: createOrder, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['order', 'create'],
		mutationFn: (data: OrderDetailRequestDto) => ordersService.createOrder(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get orders', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.orders.create.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.create.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ createOrder, isLoadingCreate }), [createOrder, isLoadingCreate])
}
