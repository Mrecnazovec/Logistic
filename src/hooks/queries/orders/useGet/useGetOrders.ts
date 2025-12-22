import { ordersService } from '@/services/orders.service'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { OrdersListQuery } from '@/shared/types/Order.interface'
import type { IPaginatedOrderListList } from '@/shared/types/PaginatedList.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOrders = (
	defaultStatus: OrderStatusEnum = 'no_driver',
	queryOverrides?: Partial<OrdersListQuery>,
): { data: IPaginatedOrderListList | undefined; isLoading: boolean } => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})

		const merged = { ...obj, ...(queryOverrides ?? {}) } as Record<string, string>

		const allowedStatuses = new Set<OrderStatusEnum>([
			OrderStatusEnum.NODRIVER,
			OrderStatusEnum.PENDING,
			OrderStatusEnum.IN_PROCESS,
			OrderStatusEnum.DELIVERED,
			OrderStatusEnum.PAID,
		])

		if (!merged.status || !allowedStatuses.has(merged.status as OrderStatusEnum)) {
			merged.status = defaultStatus ?? OrderStatusEnum.NODRIVER
		}

		return merged as OrdersListQuery
	}, [defaultStatus, queryOverrides, searchParams])

	const { data, isLoading } = useQuery<IPaginatedOrderListList>({
		queryKey: ['get orders', paramsObject],
		queryFn: () => ordersService.getOrders(paramsObject),
		staleTime: 30000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { data, isLoading }
}
