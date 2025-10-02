import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetLoadsBoard = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['get loads', 'board'],
		queryFn: () => loadsService.getLoadsBoard(),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
