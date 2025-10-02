import { offerService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOffers = () => {
	const searchParams = useSearchParams()
	const scope = searchParams.get('scope') || undefined
	const page = searchParams.get('page') || undefined

	const { data, isLoading } = useQuery({
		queryKey: ['get offers'],
		queryFn: () => offerService.getOffers(scope, page),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
