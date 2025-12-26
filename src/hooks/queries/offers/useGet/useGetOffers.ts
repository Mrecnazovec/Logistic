import { offersService } from '@/services/offers.service'
import type { operations } from '@/shared/types/api'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type OffersListQuery = operations['offers_list']['parameters']['query']

interface UseGetOffersOptions {
	enabled?: boolean
}

export const useGetOffers = (params?: OffersListQuery, options?: UseGetOffersOptions) => {
	const searchParams = useSearchParams()
	const scope = searchParams.get('scope') || undefined
	const page = searchParams.get('page') || undefined

	const baseQuery = useMemo<OffersListQuery>(() => {
		const query: OffersListQuery = {}
		if (scope) query.scope = scope
		if (page) {
			const parsedPage = Number(page)
			if (!Number.isNaN(parsedPage)) query.page = parsedPage
		}
		return query
	}, [scope, page])

	const mergedQuery = useMemo<OffersListQuery | undefined>(() => {
		if (!params) return baseQuery
		return { ...baseQuery, ...params }
	}, [baseQuery, params])

	const { data, isLoading } = useQuery({
		queryKey: ['get offers', mergedQuery],
		queryFn: () => offersService.getOffers(mergedQuery),
		enabled: options?.enabled ?? true,
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
