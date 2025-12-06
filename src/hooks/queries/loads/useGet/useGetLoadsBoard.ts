import { loadsService } from '@/services/loads.service'
import { ISearch } from '@/shared/types/Search.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetLoadsBoard = () => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		return obj as ISearch
	}, [searchParams])

	const { data, isLoading } = useQuery({
		queryKey: ['get loads', 'board', paramsObject],
		queryFn: () => loadsService.getLoadsBoard(paramsObject),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
