import { agreementsService } from '@/services/agreements.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseGetAgreementOptions {
	enabled?: boolean
}

export const useGetAgreement = (id?: string | number, options?: UseGetAgreementOptions) => {
	const { data, isLoading } = useQuery({
		queryKey: ['get agreement', id],
		queryFn: () => agreementsService.getAgreement(id as string | number),
		enabled: Boolean(id) && (options?.enabled ?? true),
	})

	return useMemo(() => ({ data, isLoading }), [data, isLoading])
}
