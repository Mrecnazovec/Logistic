import { useQuery } from '@tanstack/react-query'
import { axiosClassic } from '@/api/api.interceptors'
import { CitySuggestResponse } from '@/shared/types/Geo.interface'
import { useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

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
	})

	return useMemo(() => ({ data, isLoading, isFetching }), [data, isLoading, isFetching])
}
