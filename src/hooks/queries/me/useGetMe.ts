import { meService } from '@/services/me.service'
import { useRoleStore } from '@/store/useRoleStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

interface UseGetMeOptions {
	enabled?: boolean
}

export const useGetMe = (options?: UseGetMeOptions) => {
	const { data: me, isLoading } = useQuery({
		queryKey: ['get profile'],
		queryFn: () => meService.getMe(),
		enabled: options?.enabled ?? true,
	})
	const setRole = useRoleStore((state) => state.setRole)

	useEffect(() => {
		setRole(me?.role)
	}, [me?.role, setRole])

	return useMemo(() => ({ me, isLoading }), [me, isLoading])
}
