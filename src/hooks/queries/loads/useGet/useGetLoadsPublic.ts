import { ISearch } from '@/app/dashboard/announcements/Searching/search.interface'
import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

export const useGetLoadsPublic = () => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		return obj as ISearch
	}, [searchParams])

	const { data, isLoading } = useQuery({
		queryKey: ['get loads', 'public', paramsObject],
		queryFn: () => loadsService.getLoadsPublic(paramsObject),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
