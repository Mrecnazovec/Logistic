import { loadsService } from '@/services/loads.service'
import { PatchedCargoPublishDto } from '@/shared/types/CargoPublish.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const usePatchLoad = () => {
	const queryClient = useQueryClient()

	const { mutate: patchLoad, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['load', 'patch'],
		mutationFn: ({ uuid, data }: { uuid: string; data: PatchedCargoPublishDto }) =>
			loadsService.patchLoad(uuid, data),
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

	return useMemo(() => ({ patchLoad, isLoadingPatch }), [patchLoad, isLoadingPatch])
}
