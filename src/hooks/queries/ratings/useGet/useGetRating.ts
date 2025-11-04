import { ratingsService } from '@/services/ratings.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetRating = () => {
	const params = useParams<{ id: string }>()

	const { data: rating, isLoading } = useQuery({
		queryKey: ['get rating', params.id],
		queryFn: () => ratingsService.getRating(params.id),
	})

	return useMemo(() => ({ rating, isLoading }), [rating, isLoading])
}
