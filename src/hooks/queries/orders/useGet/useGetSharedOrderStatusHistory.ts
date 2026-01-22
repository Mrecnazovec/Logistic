import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/orders.service'
import type { IOrderStatusHistory } from '@/shared/types/Order.interface'

export const useGetSharedOrderStatusHistory = (orderId?: string | number) => {
	const { data: orderStatusHistory, isLoading } = useQuery<IOrderStatusHistory[]>({
		queryKey: ['get shared order status history', orderId],
		queryFn: () => ordersService.getOrderStatusHistory(String(orderId)),
		enabled: Boolean(orderId),
	})

	return { orderStatusHistory, isLoading }
}
