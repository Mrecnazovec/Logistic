import { loadsService } from '@/services/loads.service'
import { ISearch } from '@/shared/types/Search.interface'
import type { IPaginatedCargoListList } from '@/shared/types/PaginatedList.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetLoadsBoard = (): { data: IPaginatedCargoListList | undefined; isLoading: boolean } => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		return obj as ISearch
	}, [searchParams])

	const { data, isLoading } = useQuery<IPaginatedCargoListList>({
		queryKey: ['get loads', 'board', paramsObject],
		queryFn: () => loadsService.getLoadsBoard(paramsObject),
		staleTime: 60000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { data, isLoading }
}
