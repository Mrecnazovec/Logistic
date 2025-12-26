import { offersService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOfferLogs = (offerId?: string) => {
	const params = useParams<{ id: string }>()
	const searchParams = useSearchParams()
	const pageParam = searchParams.get('page') || undefined

	const resolvedId = offerId ?? params.id

	const query = useMemo(() => {
		if (!pageParam) return undefined
		const parsedPage = Number(pageParam)
		if (Number.isNaN(parsedPage)) return undefined
		return { page: parsedPage }
	}, [pageParam])

	const { data, isLoading } = useQuery({
		queryKey: ['get offer logs', resolvedId, query],
		queryFn: () => offersService.getOfferLogs(resolvedId as string, query),
		enabled: Boolean(resolvedId),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
