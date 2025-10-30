import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useRefreshLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: refreshLoad, isPending: isLoadingRefresh } = useMutation({
		mutationKey: ['load', 'refresh'],
		mutationFn: ({ uuid, detail }: { uuid: string; detail: string }) => loadsService.refreshLoad(uuid, detail),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			toast.success('Заявка обновлена')
		},
		onError() {
			toast.error('Ошибка при обновлении заявки')
		},
	})

	return useMemo(() => ({ refreshLoad, isLoadingRefresh }), [refreshLoad, isLoadingRefresh])
}
