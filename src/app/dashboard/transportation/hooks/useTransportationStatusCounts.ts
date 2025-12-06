import { ordersService } from '@/services/orders.service'
import { OrdersListQuery } from '@/shared/types/Order.interface'
import { useQueries, type UseQueryOptions } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

type StatusTab = { value: string; label: string }

export const useTransportationStatusCounts = (tabs: readonly StatusTab[], searchParams: URLSearchParams) => {
	const filtersWithoutStatus = useMemo(() => {
		const params: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			if (key !== 'status') {
				params[key] = value
			}
		})
		return params
	}, [searchParams])

	const buildTabQuery = useCallback(
		(tabValue: string): OrdersListQuery =>
			({ ...filtersWithoutStatus, status: tabValue, page_size: 1 } as OrdersListQuery),
		[filtersWithoutStatus],
	)

	type OrdersResponse = Awaited<ReturnType<typeof ordersService.getOrders>>

	const statusCountQueries = useQueries({
		queries: tabs.map((tab) => ({
			queryKey: ['get orders count', buildTabQuery(tab.value)],
			queryFn: () => ordersService.getOrders(buildTabQuery(tab.value)),
			select: (response) => response.count ?? 0,
		})) satisfies UseQueryOptions<OrdersResponse, Error, number>[],
	})

	const statusCounts = useMemo(
		() =>
			tabs.reduce<Record<string, number | undefined>>((acc, tab, index) => {
				acc[tab.value] = statusCountQueries[index]?.data
				return acc
			}, {}),
		[statusCountQueries, tabs],
	)

	return { statusCounts }
}
