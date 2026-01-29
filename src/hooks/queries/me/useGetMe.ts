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
import { removeFromStorage } from '@/services/auth/auth-token.service'

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

		const message = getErrorMessage(error) ?? t('hooks.me.get.error')
		if (message === lastErrorMessage.current) return

		lastErrorMessage.current = message
		toast.error(message)
		hasHandledError.current = true
		logout('')
		removeFromStorage()
		router.push('/auth')
		router.refresh()
	}, [error, isError, router, logout, t])

	return { me, isLoading, isError, error }
}
