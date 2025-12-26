import { offerService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetIncomingOffers = () => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		return obj
	}, [searchParams])

	const { data, isLoading } = useQuery({
		queryKey: ['get offers', 'incoming', paramsObject],
		queryFn: () => offerService.getIncomingOffers(paramsObject),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
