import { loadsService } from '@/services/loads.service'
import { ICargoPublish } from '@/shared/types/CargoPublish.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: createLoad, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['load', 'create'],
		mutationFn: (data: ICargoPublish) => loadsService.createLoad(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			toast.success('Заявка создана')
		},
		onError() {
			toast.error('Ошибка при создании заявки')
		},
	})

	return useMemo(() => ({ createLoad, isLoadingCreate }), [createLoad, isLoadingCreate])
}
