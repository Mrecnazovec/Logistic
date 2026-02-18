import type { IMe } from '@/shared/types/Me.interface'
import { meService } from '@/services/me.service'
import { useRoleStore } from '@/store/useRoleStore'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { PUBLIC_URL } from '@/config/url.config'
import { AUTH_TOKENS_REFRESHED_EVENT } from '@/constants/auth-events'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { getRefreshToken } from '@/services/auth/auth-token.service'
import { authService } from '@/services/auth/auth.service'

interface UseGetMeOptions {
	enabled?: boolean
}

const ME_QUERY_KEY = ['get profile'] as const

export const useGetMe = (options?: UseGetMeOptions): { me: IMe | undefined; isLoading: boolean; isError: boolean; error: unknown } => {
	const { t } = useI18n()
	const enabled = options?.enabled ?? true
	const {
		data: me,
		isLoading,
		isError,
		error,
	} = useQuery<IMe>({
		queryKey: ME_QUERY_KEY,
		queryFn: () => meService.getMe(),
		enabled,
		retry: 0,
	})
	const queryClient = useQueryClient()
	const setRole = useRoleStore((state) => state.setRole)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const lastErrorMessage = useRef<string | null>(null)
	const hasHandledError = useRef(false)
	const refreshAttempted = useRef(false)
	const isRefreshing = useRef(false)
	const refreshTokenRef = useRef<string | null>(null)

	useEffect(() => {
		const refreshToken = getRefreshToken()
		if (refreshToken) {
			refreshTokenRef.current = refreshToken
		}
	}, [])

	useEffect(() => {
		setRole(me?.role)
	}, [me?.role, setRole])

	useEffect(() => {
		if (!me) return
		hasHandledError.current = false
		refreshAttempted.current = false
		lastErrorMessage.current = null
	}, [me])

	const redirectToAuth = useCallback(() => {
		const query = searchParams.toString()
		const returnPath = query ? `${pathname}?${query}` : pathname
		router.push(`${PUBLIC_URL.auth()}?next=${encodeURIComponent(returnPath)}`)
	}, [pathname, router, searchParams])

	const notifyAndRedirect = useCallback(
		(err: unknown) => {
			const message = getErrorMessage(err) ?? t('hooks.me.get.error')
			if (message !== lastErrorMessage.current) {
				lastErrorMessage.current = message
				toast.error(message)
			}
			hasHandledError.current = true
			redirectToAuth()
		},
		[redirectToAuth, t],
	)

	useEffect(() => {
		if (!isError) return
		if (hasHandledError.current || isRefreshing.current) return

		const refreshToken = getRefreshToken() ?? refreshTokenRef.current
		if (refreshToken && !refreshAttempted.current) {
			refreshAttempted.current = true
			isRefreshing.current = true
			authService
				.getNewTokens({ refresh: refreshToken })
				.then(() => {
					hasHandledError.current = false
					lastErrorMessage.current = null
					refreshTokenRef.current = getRefreshToken() ?? refreshTokenRef.current
					if (typeof window !== 'undefined') {
						window.dispatchEvent(new Event(AUTH_TOKENS_REFRESHED_EVENT))
					}
					queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
				})
				.catch((refreshError) => {
					notifyAndRedirect(refreshError)
				})
				.finally(() => {
					isRefreshing.current = false
				})
			return
		}

		notifyAndRedirect(error)
	}, [error, isError, notifyAndRedirect, queryClient])

	useEffect(() => {
		if (!enabled) return

		const intervalId = window.setInterval(() => {
			if (isRefreshing.current) return
			const refreshToken = getRefreshToken() ?? refreshTokenRef.current
			if (!refreshToken) return

			isRefreshing.current = true
			authService
				.getNewTokens({ refresh: refreshToken })
				.then(() => {
					refreshTokenRef.current = getRefreshToken() ?? refreshTokenRef.current
					if (typeof window !== 'undefined') {
						window.dispatchEvent(new Event(AUTH_TOKENS_REFRESHED_EVENT))
					}
				})
				.catch(() => undefined)
				.finally(() => {
					isRefreshing.current = false
				})
		}, 55 * 60 * 1000)

		return () => {
			window.clearInterval(intervalId)
		}
	}, [enabled])

	return { me, isLoading, isError, error }
}
