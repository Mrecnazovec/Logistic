import { useQuery } from '@tanstack/react-query'

import { paymentsService } from '@/services/payments.service'
import type { IPayment } from '@/shared/types/Payment.interface'

export const useGetPayment = (id?: number | string, enabled = true) => {
	const { data: payment, isLoading, isFetching, isError } = useQuery<IPayment>({
		queryKey: ['payment', id],
		queryFn: () => {
			if (!id) throw new Error('Payment id is required')
			return paymentsService.getPayment(id)
		},
		enabled: enabled && Boolean(id),
	})

	return { payment, isLoading, isFetching, isError }
}
