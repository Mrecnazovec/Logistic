import { axiosClassic } from '@/api/api.interceptors'
import { useDebounce } from '@/hooks/useDebounce'
import { CountrySuggestResponse } from '@/shared/types/Geo.interface'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useCountrySuggest = (query: string) => {
	const debouncedQuery = useDebounce(query, 300)

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['country-suggest', debouncedQuery],
		queryFn: async () => {
			const { data } = await axiosClassic.get<CountrySuggestResponse>(`/geo/suggest/countries/`, {
				params: { q: debouncedQuery },
			})
			return data
		},
		enabled: !!debouncedQuery,
		staleTime: 300_000, // 5 minutes
		gcTime: 3_600_000, // 60 minutes
		placeholderData: (prev) => prev,
	})

	return useMemo(() => ({ data, isLoading, isFetching }), [data, isLoading, isFetching])
}
