import type { IMe } from '@/shared/types/Me.interface'
import { meService } from '@/services/me.service'
import { useLogout } from '@/hooks/useLogout'
import { useRoleStore } from '@/store/useRoleStore'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { getAccessToken, getRefreshToken, removeFromStorage } from '@/services/auth/auth-token.service'
import { authService } from '@/services/auth/auth.service'
import { useQueryClient } from '@tanstack/react-query'

interface UseGetMeOptions {
	enabled?: boolean
}

export const useGetMe = (options?: UseGetMeOptions): { me: IMe | undefined; isLoading: boolean; isError: boolean; error: unknown } => {
	const { t } = useI18n()
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
	const queryClient = useQueryClient()
	const setRole = useRoleStore((state) => state.setRole)
	const router = useRouter()
	const { logout } = useLogout()
	const lastErrorMessage = useRef<string | null>(null)
	const hasHandledError = useRef(false)
	const refreshAttempted = useRef(false)

	useEffect(() => {
		if (!(options?.enabled ?? true)) return
		const refreshToken = getRefreshToken()
		if (!refreshToken) return

		refreshAttempted.current = true
		authService
			.getNewTokens({ refresh: refreshToken })
			.then(() => {
				hasHandledError.current = false
				queryClient.invalidateQueries({ queryKey: ['get profile'] })
			})
			.catch(() => {
				hasHandledError.current = false
			})
	}, [options?.enabled, queryClient])

	useEffect(() => {
		setRole(me?.role)
	}, [me?.role, setRole])

	useEffect(() => {
		if (!isError) return
		if (hasHandledError.current) return

		const refreshToken = getRefreshToken()
		if (refreshToken && !refreshAttempted.current) {
			refreshAttempted.current = true
			authService
				.getNewTokens({ refresh: refreshToken })
				.then(() => {
					hasHandledError.current = false
					queryClient.invalidateQueries({ queryKey: ['get profile'] })
				})
				.catch(() => {
					hasHandledError.current = false
				})
			return
		}

		const message = getErrorMessage(error) ?? t('hooks.me.get.error')
		if (message === lastErrorMessage.current) return

		lastErrorMessage.current = message
		toast.error(message)
		hasHandledError.current = true
		router.push('/auth')
		router.refresh()
	}, [error, isError, queryClient, router, logout, t])

	return { me, isLoading, isError, error }
}
