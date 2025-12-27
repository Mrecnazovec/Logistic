import { ratingsService } from '@/services/ratings.service'
import type { RatingsListQuery } from '@/shared/types/Rating.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const toNumber = (value: string | null) => {
	if (!value) return undefined

	const parsed = Number(value)
	return Number.isNaN(parsed) ? undefined : parsed
}

export const useGetRatings = (role?: string) => {
	const searchParams = useSearchParams()

	const params = useMemo<RatingsListQuery>(() => {
		const nextParams: Record<string, string | number> = {}

		searchParams.forEach((value, key) => {
			nextParams[key] = value
		})

		if (role) {
			nextParams.role = role
		} else if (!nextParams.role) {
			nextParams.role = 'logistics'
		}

		if (typeof nextParams.page === 'string') {
			const parsedPage = toNumber(nextParams.page)
			if (parsedPage !== undefined) {
				nextParams.page = parsedPage
			}
		}

		return nextParams as RatingsListQuery
	}, [searchParams, role])

	const { data: ratings, isLoading } = useQuery({
		queryKey: ['get ratings', params],
		queryFn: () => ratingsService.getRatings(params),
	})

	return useMemo(() => ({ ratings, isLoading }), [ratings, isLoading])
}
