import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetLoadsPublic = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['get loads', 'public'],
		queryFn: () => loadsService.getLoadsPublic(),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
