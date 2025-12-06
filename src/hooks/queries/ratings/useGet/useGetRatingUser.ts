import { ratingsService } from "@/services/ratings.service"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export const useGetRatingUser = (id?: string) => {
	const { data: ratingUser, isLoading } = useQuery({
		queryKey: ["get rating user", id],
		queryFn: () => ratingsService.getRatingUser(id as string),
		enabled: Boolean(id),
	})

	return useMemo(() => ({ ratingUser, isLoading }), [ratingUser, isLoading])
}
