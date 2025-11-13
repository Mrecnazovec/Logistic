import { meService } from '@/services/me.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetAnalytics = () => {
	const { data: analytics, isLoading } = useQuery({
		queryKey: ['get analytics'],
		queryFn: () => meService.getAnalytics(),
	})

	return useMemo(() => ({ analytics, isLoading }), [analytics, isLoading])
}

