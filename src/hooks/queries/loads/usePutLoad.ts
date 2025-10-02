import { loadsService } from '@/services/loads.service'
import { ICargoPublish } from '@/shared/types/CargoPublish.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePutLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: putLoad, isPending: isLoadingPut } = useMutation({
		mutationKey: ['load', 'put'],
		mutationFn: ({ id, data }: { id: string; data: ICargoPublish }) => loadsService.putLoad(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			toast.success('Заявка обновлена')
		},
		onError() {
			toast.error('Ошибка при обновлении заявки')
		},
	})

	return useMemo(() => ({ putLoad, isLoadingPut }), [putLoad, isLoadingPut])
}
