import { ordersService } from '@/services/orders.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOrder = () => {
	const params = useParams<{ id: string }>()

	const { data: order, isLoading } = useQuery({
		queryKey: ['get order', params.id],
		queryFn: () => ordersService.getOrder(params.id),
	})

	return useMemo(() => ({ order, isLoading }), [order, isLoading])
}
