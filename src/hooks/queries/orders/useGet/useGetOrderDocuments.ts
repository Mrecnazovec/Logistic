import { ordersService } from '@/services/orders.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOrderDocuments = () => {
	const params = useParams<{ id: string }>()

	const { data: orderDocuments, isLoading } = useQuery({
		queryKey: ['get order documents', params.id],
		queryFn: () => ordersService.getOrderDocuments(params.id),
	})

	return useMemo(() => ({ orderDocuments, isLoading }), [orderDocuments, isLoading])
}
