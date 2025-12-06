import { loadsService } from '@/services/loads.service'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useGenerateLoadInvite = () => {
	type InviteResponse = Awaited<ReturnType<typeof loadsService.generateLoadInvite>>

	const {
		mutate: generateLoadInvite,
		mutateAsync: generateLoadInviteAsync,
		data: invite,
		reset,
		isPending: isLoadingGenerate,
	} = useMutation<InviteResponse, unknown, string>({
		mutationKey: ['load', 'generate-invite'],
		mutationFn: (uuid: string) => loadsService.generateLoadInvite(uuid),
		onSuccess() {
			toast.success('Инвайт создан')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось сгенерировать инвайт'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({
			generateLoadInvite,
			generateLoadInviteAsync,
			invite,
			isLoadingGenerate,
			resetInvite: reset,
		}),
		[generateLoadInvite, generateLoadInviteAsync, invite, isLoadingGenerate, reset],
	)
}
