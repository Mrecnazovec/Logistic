import { axiosClassic } from '@/api/api.interceptors'
import { useDebounce } from '@/hooks/useDebounce'
import { CitySuggestResponse } from '@/shared/types/Geo.interface'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useCitySuggest = (query: string, countryCode?: string) => {
	const debouncedQuery = useDebounce(query, 300)

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['city-suggest', debouncedQuery, countryCode],
		queryFn: async () => {
			const { data } = await axiosClassic.get<CitySuggestResponse>(`/geo/suggest/cities/`, {
				params: { q: debouncedQuery, country: countryCode },
			})
			return data
		},
		enabled: !!debouncedQuery && !!countryCode,
		staleTime: 300_000, // 5 minutes
		gcTime: 3_600_000, // 60 minutes
		placeholderData: (prev) => prev,
	})

	return useMemo(() => ({ data, isLoading, isFetching }), [data, isLoading, isFetching])
}
