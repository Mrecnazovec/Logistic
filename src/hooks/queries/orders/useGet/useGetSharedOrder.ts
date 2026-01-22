import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import type { AxiosError } from 'axios'

import { ordersService } from '@/services/orders.service'
import type { IOrderDetail } from '@/shared/types/Order.interface'

export const useGetSharedOrder = (): { order: IOrderDetail | undefined; isLoading: boolean } => {
	const params = useParams<{ share_token: string }>()
	const shareToken = params.share_token

	const { data: order, isLoading } = useQuery<IOrderDetail | undefined>({
		queryKey: ['get shared order', shareToken],
		queryFn: async () => {
			try {
				return await ordersService.getSharedOrder(shareToken)
			} catch (error) {
				const axiosError = error as AxiosError
				if (axiosError.response?.status === 404) {
					return undefined
				}
				throw error
			}
		},
		enabled: Boolean(shareToken),
		staleTime: 10000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { order, isLoading }
}
