import { meService } from '@/services/me.service'
import { UpdateMeDto } from '@/shared/types/Me.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const usePatchMe = () => {
	const queryClient = useQueryClient()

	const { mutate: patchMe, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['patch profile'],
		mutationFn: (data: UpdateMeDto) => meService.patchMe(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get profile'],
			})
			toast.success('Профиль обновлен')
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? 'Ошибка обновления профиля'
			toast.error(message)
		},
	})

	return useMemo(() => ({ patchMe, isLoadingPatch }), [patchMe, isLoadingPatch])
}
