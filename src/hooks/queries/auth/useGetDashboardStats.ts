import { authService } from '@/services/auth/auth.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetDashboardStats = () => {
	const { data: dashboardStats, isLoading } = useQuery({
		queryKey: ['auth', 'dashboard-stats'],
		queryFn: () => authService.getDashboardStats(),
	})

	return useMemo(() => ({ dashboardStats, isLoading }), [dashboardStats, isLoading])
}
