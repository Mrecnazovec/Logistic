import { ordersService } from '@/services/orders.service'
import type { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import type { IOrderDetail } from '@/shared/types/Order.interface'

export const useGetOrder = (): { order: IOrderDetail | undefined; isLoading: boolean } => {
	const params = useParams<{ id: string }>()

	const { data: order, isLoading } = useQuery<IOrderDetail>({
		queryKey: ['get order', params.id],
		queryFn: async () => {
			try {
				return await ordersService.getOrder(params.id)
			} catch (error) {
				const axiosError = error as AxiosError<{ message?: string | string[]; detail?: string | string[] }>
				const status = axiosError.response?.status
				const rawMessage = axiosError.response?.data?.message ?? axiosError.response?.data?.detail
				const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage
				const shouldRetryAsCustomer = status === 404 && message === 'No Order matches the given query.'

				if (shouldRetryAsCustomer) {
					return ordersService.getOrder(params.id, { as_role: 'customer' })
				}

				throw error
			}
		},
		staleTime: 10000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { order, isLoading }
}
