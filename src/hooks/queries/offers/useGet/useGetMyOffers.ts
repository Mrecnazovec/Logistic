import { offerService } from '@/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetMyOffers = () => {
	const searchParams = useSearchParams()

	const paramsObject = useMemo(() => {
		const obj: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			obj[key] = value
		})
		return obj
	}, [searchParams])

	const { data, isLoading } = useQuery({
		queryKey: ['get offers', 'my', paramsObject],
		queryFn: () => offerService.getMyOffers(paramsObject),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
