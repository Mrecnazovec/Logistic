import { agreementsService } from '@/services/agreements.service'
import type { AgreementsListQuery, IPaginatedAgreementList } from '@/shared/types/Agreement.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetAgreements = (
	params?: AgreementsListQuery,
): { data: IPaginatedAgreementList | undefined; isLoading: boolean } => {
	const searchParams = useSearchParams()
	const page = searchParams.get('page') || undefined

	const pageNumber = useMemo(() => {
		if (!page) return undefined
		const parsed = Number(page)
		return Number.isNaN(parsed) ? undefined : parsed
	}, [page])

	const mergedParams = useMemo<AgreementsListQuery | undefined>(() => {
		if (!params && !pageNumber) return undefined
		if (!params) return pageNumber ? { page: pageNumber } : undefined
		return pageNumber ? { ...params, page: pageNumber } : params
	}, [params, pageNumber])

	const { data, isLoading } = useQuery<IPaginatedAgreementList>({
		queryKey: ['get agreements', mergedParams],
		queryFn: () => agreementsService.getAgreements(mergedParams),
		staleTime: 30000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
	})

	return { data, isLoading }
}
