import { ordersService } from '@/services/orders.service'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetOrderTracking = (id?: string | number): { orderTracking: IOrderDetail | undefined; isLoading: boolean } => {
	const { data: orderTracking, isLoading } = useQuery<IOrderDetail>({
		queryKey: ['get order tracking', String(id ?? '')],
		queryFn: () => ordersService.getOrderTracking(id as string | number),
		enabled: Boolean(id),
		staleTime: 10000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return useMemo(() => ({ orderTracking, isLoading }), [orderTracking, isLoading])
}
