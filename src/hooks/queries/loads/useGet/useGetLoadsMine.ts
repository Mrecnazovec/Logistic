import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { IPaginatedCargoListList } from '@/shared/types/PaginatedList.interface'

export const useGetLoadsMine = (): { data: IPaginatedCargoListList | undefined; isLoading: boolean } => {
	const { data, isLoading } = useQuery<IPaginatedCargoListList>({
		queryKey: ['get loads', 'mine'],
		queryFn: () => loadsService.getLoadsMine(),
		staleTime: 60000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { data, isLoading }
}
