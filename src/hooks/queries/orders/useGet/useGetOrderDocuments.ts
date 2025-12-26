import { ordersService } from '@/services/orders.service'
import type { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import type { IOrderDetail, IOrderDocument } from '@/shared/types/Order.interface'

export const useGetOrderDocuments = () => {
	const params = useParams<{ id: string }>()

	const { data: orderDocuments, isLoading } = useQuery<IOrderDocument[] | IOrderDetail>({
		queryKey: ['get order documents', params.id],
		queryFn: async () => {
			try {
				return await ordersService.getOrderDocuments(params.id)
			} catch (error) {
				const axiosError = error as AxiosError<{ message?: string | string[]; detail?: string | string[] }>
				const status = axiosError.response?.status
				const rawMessage = axiosError.response?.data?.message ?? axiosError.response?.data?.detail
				const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage
				const shouldRetryAsCustomer = status === 404 && message === 'No Order matches the given query.'

				if (shouldRetryAsCustomer) {
					return ordersService.getOrderDocuments(params.id, { as_role: 'customer' })
				}

				throw error
			}
		},
	})

	return useMemo(() => ({ orderDocuments, isLoading }), [orderDocuments, isLoading])
}
