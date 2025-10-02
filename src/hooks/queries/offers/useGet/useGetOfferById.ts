import { offerService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetOfferById = () => {
	const param = useParams<{ id: string }>()
	const { data: offer, isLoading } = useQuery({
		queryKey: ['get offer by id', param.id],
		queryFn: () => offerService.getOfferById(param.id),
	})

	return useMemo(() => ({ offer, isLoading }), [offer, isLoading])
}
