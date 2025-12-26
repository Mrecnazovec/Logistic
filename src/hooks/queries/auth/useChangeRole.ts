import type { RoleChangeDto } from '@/shared/types/Me.interface'
import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useChangeRole = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: changeRole, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'change-role'],
		mutationFn: (data: RoleChangeDto) => authService.changeRole(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get profile'] })
			toast.success(t('hooks.auth.changeRole.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.auth.changeRole.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ changeRole, isLoading }), [changeRole, isLoading])
}
