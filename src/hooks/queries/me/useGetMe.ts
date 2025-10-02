import { meService } from '@/services/me.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetMe = () => {
	const { data: me, isLoading } = useQuery({
		queryKey: ['get profile'],
		queryFn: () => meService.getMe(),
	})

	return useMemo(() => ({ me, isLoading }), [me, isLoading])
}
