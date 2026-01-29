import { useQuery } from '@tanstack/react-query'

import { ordersService } from '@/services/orders.service'
import type { InvitePreview } from '@/shared/types/Order.interface'

export const useGetInvitePreview = (token?: string) => {
	const { data: invitePreview, isLoading } = useQuery<InvitePreview>({
		queryKey: ['order', 'invite-preview', token],
		queryFn: () => ordersService.getInvitePreview(token ?? ''),
		enabled: Boolean(token),
		staleTime: 10000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { invitePreview, isLoading }
}
