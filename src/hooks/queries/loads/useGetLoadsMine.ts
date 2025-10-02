import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetLoadsMine = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['get loads', 'mine'],
		queryFn: () => loadsService.getLoadsMine(),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
