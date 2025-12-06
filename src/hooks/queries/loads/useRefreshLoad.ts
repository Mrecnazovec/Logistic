import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useRefreshLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: refreshLoad, isPending: isLoadingRefresh } = useMutation({
		mutationKey: ['load', 'refresh'],
		mutationFn: ({ uuid, detail }: { uuid: string; detail: string }) => loadsService.refreshLoad(uuid, detail),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			toast.success('Объявление обновлено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось обновить объявление'
			toast.error(message)
		},
	})

	return useMemo(() => ({ refreshLoad, isLoadingRefresh }), [refreshLoad, isLoadingRefresh])
}
