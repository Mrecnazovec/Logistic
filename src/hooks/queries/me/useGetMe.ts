import { meService } from '@/services/me.service'
import { useRoleStore } from '@/store/useRoleStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

export const useGetMe = () => {
	const { data: me, isLoading } = useQuery({
		queryKey: ['get profile'],
		queryFn: () => meService.getMe(),
	})
	const setRole = useRoleStore((state) => state.setRole)

	useEffect(() => {
		setRole(me?.role)
	}, [me?.role, setRole])

	return useMemo(() => ({ me, isLoading }), [me, isLoading])
}
