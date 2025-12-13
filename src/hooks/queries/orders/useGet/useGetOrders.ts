import { ordersService } from '@/services/orders.service'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { OrdersListQuery } from '@/shared/types/Order.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOrders = (defaultStatus: OrderStatusEnum = 'no_driver') => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})

		const allowedStatuses = new Set<OrderStatusEnum>([
			OrderStatusEnum.NODRIVER,
			OrderStatusEnum.PENDING,
			OrderStatusEnum.IN_PROCESS,
			OrderStatusEnum.DELIVERED,
			OrderStatusEnum.PAID,
		])

		if (!obj.status || !allowedStatuses.has(obj.status as OrderStatusEnum)) {
			obj.status = defaultStatus ?? OrderStatusEnum.NODRIVER
		}

		return obj as OrdersListQuery
	}, [defaultStatus, searchParams])

	const { data, isLoading } = useQuery({
		queryKey: ['get orders', paramsObject],
		queryFn: () => ordersService.getOrders(paramsObject),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
