import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useCancelLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: cancelLoad, isPending: isLoadingCancel } = useMutation({
		mutationKey: ['load', 'cancel'],
		mutationFn: ({ id, detail }: { id: string; detail: string }) => loadsService.cancelLoad(id, detail),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			toast.success('Объявление отменено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отменить объявление'
			toast.error(message)
		},
	})

	return useMemo(() => ({ cancelLoad, isLoadingCancel }), [cancelLoad, isLoadingCancel])
}
