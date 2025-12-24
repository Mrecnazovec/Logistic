import { meService } from '@/services/me.service'
import { useRoleStore } from '@/store/useRoleStore'
import { useLogout } from '@/hooks/useLogout'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import type { IMe } from '@/shared/types/Me.interface'

interface UseGetMeOptions {
	enabled?: boolean
}

export const useGetMe = (options?: UseGetMeOptions): { me: IMe | undefined; isLoading: boolean; isError: boolean; error: unknown } => {
	const {
		data: me,
		isLoading,
		isError,
		error,
	} = useQuery<IMe>({
		queryKey: ['get profile'],
		queryFn: () => meService.getMe(),
		enabled: options?.enabled ?? true,
	})
	const setRole = useRoleStore((state) => state.setRole)
	const router = useRouter()
	const { logout } = useLogout()
	const lastErrorMessage = useRef<string | null>(null)
	const hasHandledError = useRef(false)

	useEffect(() => {
		setRole(me?.role)
	}, [me?.role, setRole])

	useEffect(() => {
		if (!isError) return
		if (hasHandledError.current) return

		const message = getErrorMessage(error) ?? 'Не удалось загрузить профиль'
		if (message === lastErrorMessage.current) return

		lastErrorMessage.current = message
		toast.error(message)
		hasHandledError.current = true
		logout('')
		router.push('/auth')
	}, [error, isError, router, logout])

	return { me, isLoading, isError, error }
}
