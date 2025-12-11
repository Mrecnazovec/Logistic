import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useGenerateLoadInvite = () => {
	type InviteResponse = Awaited<ReturnType<typeof loadsService.generateLoadInvite>>
	const queryClient = useQueryClient()

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
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success('Ссылка приглашения сгенерирована.')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось сгенерировать ссылку приглашения.'
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
