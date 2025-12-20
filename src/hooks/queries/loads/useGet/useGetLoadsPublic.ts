
import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ISearch } from '@/shared/types/Search.interface'
import type { IPaginatedCargoListList } from '@/shared/types/PaginatedList.interface'

export const useGetLoadsPublic = (): { data: IPaginatedCargoListList | undefined; isLoading: boolean } => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		return obj as ISearch
	}, [searchParams])

	const { data, isLoading } = useQuery<IPaginatedCargoListList>({
		queryKey: ['get loads', 'public', paramsObject],
		queryFn: () => loadsService.getLoadsPublic(paramsObject),
		staleTime: 60000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { data, isLoading }
}
