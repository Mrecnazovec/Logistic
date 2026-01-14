import { offersService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type UseGetOfferOptions = {
	enabled?: boolean
}

export const useGetOffer = (offerId?: string, options?: UseGetOfferOptions) => {
	const isEnabled = Boolean(offerId) && (options?.enabled ?? true)

	const { data: offer, isLoading } = useQuery({
		queryKey: ['get offer', offerId],
		queryFn: () => offersService.getOfferById(offerId as string),
		enabled: isEnabled,
	})

	return useMemo(() => ({ offer, isLoading }), [offer, isLoading])
}
