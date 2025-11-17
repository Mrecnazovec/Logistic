import { ordersService } from '@/services/orders.service'
import type { OrdersListQuery } from '@/shared/types/Order.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOrders = () => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		if (!obj.status) {
			obj.status = 'no_driver'
		}

		return obj as OrdersListQuery
	}, [searchParams])

	const { data, isLoading } = useQuery({
		queryKey: ['get orders', paramsObject],
		queryFn: () => ordersService.getOrders(paramsObject),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
