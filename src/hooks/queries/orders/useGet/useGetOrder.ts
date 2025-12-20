import { ordersService } from '@/services/orders.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import type { IOrderDetail } from '@/shared/types/Order.interface'

export const useGetOrder = (): { order: IOrderDetail | undefined; isLoading: boolean } => {
	const params = useParams<{ id: string }>()

	const { data: order, isLoading } = useQuery<IOrderDetail>({
		queryKey: ['get order', params.id],
		queryFn: () => ordersService.getOrder(params.id),
		staleTime: 10000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { order, isLoading }
}
