import { meService } from '@/services/me.service'
import { useRoleStore } from '@/store/useRoleStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import type { IMe } from '@/shared/types/Me.interface'

interface UseGetMeOptions {
	enabled?: boolean
}

export const useGetMe = (options?: UseGetMeOptions): { me: IMe | undefined; isLoading: boolean } => {
	const { data: me, isLoading } = useQuery<IMe>({
		queryKey: ['get profile'],
		queryFn: () => meService.getMe(),
		enabled: options?.enabled ?? true,
		staleTime: 300000,
		gcTime: 1800000,
		refetchOnWindowFocus: false,
	})
	const setRole = useRoleStore((state) => state.setRole)

	useEffect(() => {
		setRole(me?.role)
	}, [me?.role, setRole])

	return { me, isLoading }
}
