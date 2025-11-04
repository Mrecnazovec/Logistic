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

export const useGetRatings = () => {
	const searchParams = useSearchParams()

	const params = useMemo<RatingsListQuery | undefined>(() => {
		const page = toNumber(searchParams.get('page'))

		if (page === undefined) {
			return undefined
		}

		return { page } as RatingsListQuery
	}, [searchParams])

	const { data: ratings, isLoading } = useQuery({
		queryKey: ['get ratings', params],
		queryFn: () => ratingsService.getRatings(params),
	})

	return useMemo(() => ({ ratings, isLoading }), [ratings, isLoading])
}
