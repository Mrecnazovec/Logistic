import { meService } from '@/services/me.service'
import { UpdateMeDto } from '@/shared/types/Me.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useUpdateMe = () => {
	const queryClient = useQueryClient()

	const { mutate: updateMe, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: UpdateMeDto) => meService.updateMe(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get profile'],
			})
			toast.success('Профиль обновлён')
		},
		onError: () => {
			toast.error('Ошибка обновления профиля')
		},
	})

	return useMemo(() => ({ updateMe, isLoadingUpdate }), [updateMe, isLoadingUpdate])
}
