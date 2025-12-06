import { authService } from '@/services/auth/auth.service'
import type { RoleChangeDto } from '@/shared/types/Me.interface'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useChangeRole = () => {
	const { mutate: changeRole, isPending: isLoading } = useMutation({
		mutationKey: ['auth', 'change-role'],
		mutationFn: (data: RoleChangeDto) => authService.changeRole(data),
		onSuccess() {
			toast.success('Роль обновлена')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось обновить роль'
			toast.error(message)
		},
	})

	return useMemo(() => ({ changeRole, isLoading }), [changeRole, isLoading])
}
