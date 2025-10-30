	import { loadsService } from '@/services/loads.service'
	import { useQuery } from '@tanstack/react-query'
	import { useParams } from 'next/navigation'
	import { useMemo } from 'react'

	export const useGetLoad = () => {
		const param = useParams<{ uuid: string }>()
		const { data: load, isLoading } = useQuery({
			queryKey: ['get load'],
			queryFn: () => loadsService.getLoad(param.uuid),
		})

		return useMemo(() => ({ load, isLoading }), [load, isLoading])
	}
