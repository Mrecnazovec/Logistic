import { meService } from '@/services/me.service'
import { UpdateMeDto } from '@/shared/types/Me.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePatchMe = () => {
	const queryClient = useQueryClient()

	const { mutate: patchMe, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['patch profile'],
		mutationFn: (data: UpdateMeDto) => meService.patchMe(data),
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

	return useMemo(() => ({ patchMe, isLoadingPatch }), [patchMe, isLoadingPatch])
}
