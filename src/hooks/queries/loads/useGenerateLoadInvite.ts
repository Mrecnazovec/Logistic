import { loadsService } from '@/services/loads.service'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useGenerateLoadInvite = () => {
	const { mutate: generateLoadInvite, data, isPending: isLoadingGenerate, reset } = useMutation({
		mutationKey: ['load', 'invite', 'generate'],
		mutationFn: (uuid: string) => loadsService.generateLoadInvite(uuid),
		onSuccess() {
			toast.success('Инвайт на груз сгенерирован')
		},
		onError() {
			toast.error('Не удалось сгенерировать инвайт')
		},
	})

	return useMemo(
		() => ({ generateLoadInvite, invite: data, isLoadingGenerate, resetInvite: reset }),
		[data, generateLoadInvite, isLoadingGenerate, reset],
	)
}
