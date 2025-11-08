import { DASHBOARD_URL } from '@/config/url.config'
import { loadsService } from '@/services/loads.service'
import { PatchedCargoPublishDto } from '@/shared/types/CargoPublish.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePatchLoad = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: patchLoad, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['load', 'patch'],
		mutationFn: ({ uuid, data }: { uuid: string; data: PatchedCargoPublishDto }) => loadsService.patchLoad(uuid, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			toast.success('Заявка обновлена')
			router.push(DASHBOARD_URL.desk())
		},
		onError() {
			toast.error('Ошибка при обновлении заявки')
		},
	})

	return useMemo(() => ({ patchLoad, isLoadingPatch }), [patchLoad, isLoadingPatch])
}
