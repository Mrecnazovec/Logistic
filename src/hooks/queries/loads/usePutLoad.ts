import { loadsService } from '@/services/loads.service'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const usePutLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: putLoad, isPending: isLoadingPut } = useMutation({
		mutationKey: ['load', 'put'],
		mutationFn: ({ id, data }: { id: string; data: CargoPublishRequestDto }) => loadsService.putLoad(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success('Объявление обновлено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось обновить объявление'
			toast.error(message)
		},
	})

	return useMemo(() => ({ putLoad, isLoadingPut }), [putLoad, isLoadingPut])
}
