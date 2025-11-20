import { ordersService } from '@/services/orders.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import type { IOrderStatusHistory } from '@/shared/types/Order.interface'

export const useGetOrderStatusHistory = () => {
	const params = useParams<{ id: string }>()

	const { data: orderStatusHistory, isLoading } = useQuery<IOrderStatusHistory[]>({
		queryKey: ['get order status history', params.id],
		queryFn: () => ordersService.getOrderStatusHistory(params.id),
	})

	return useMemo(() => ({ orderStatusHistory, isLoading }), [orderStatusHistory, isLoading])
}
