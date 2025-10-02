import { offerService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetIncomingOffers = () => {
	const searchParams = useSearchParams()
	const page = searchParams.get('page') || undefined

	const { data, isLoading } = useQuery({
		queryKey: ['get offers', 'incoming', page],
		queryFn: () => offerService.getIncomingOffers(page),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
