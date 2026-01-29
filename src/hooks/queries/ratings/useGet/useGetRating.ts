import { ratingsService } from '@/services/ratings.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetRating = (id?: string) => {
	const { data: rating, isLoading } = useQuery({
		queryKey: ['get rating', id],
		queryFn: () => ratingsService.getRating(id as string),
		enabled: Boolean(id),
	})

	return useMemo(() => ({ rating, isLoading }), [rating, isLoading])
}
