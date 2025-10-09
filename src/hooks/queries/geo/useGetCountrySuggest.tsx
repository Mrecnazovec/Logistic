import { useQuery } from '@tanstack/react-query'
import { axiosClassic } from '@/api/api.interceptors'
import { CountrySuggestResponse } from '@/shared/types/Geo.interface'
import { useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

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
	})

	return useMemo(() => ({ data, isLoading, isFetching }), [data, isLoading, isFetching])
}
