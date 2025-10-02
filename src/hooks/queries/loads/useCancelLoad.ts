import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCancelLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: cancelLoad, isPending: isLoadingCancel } = useMutation({
		mutationKey: ['load', 'cancel'],
		mutationFn: ({ id, detail }: { id: string; detail: string }) => loadsService.cancelLoad(id, detail),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			toast.success('Заявка отменена')
		},
		onError() {
			toast.error('Ошибка при отмене заявки')
		},
	})

	return useMemo(() => ({ cancelLoad, isLoadingCancel }), [cancelLoad, isLoadingCancel])
}
