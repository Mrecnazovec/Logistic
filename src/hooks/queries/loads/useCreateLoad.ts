import { DASHBOARD_URL } from '@/config/url.config'
import { loadsService } from '@/services/loads.service'
import { ICargoPublish } from '@/shared/types/CargoPublish.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateLoad = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: createLoad, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['load', 'create'],
		mutationFn: (data: ICargoPublish) => loadsService.createLoad(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			toast.success('Заявка создана')
			router.push(DASHBOARD_URL.announcements())
		},
		onError() {
			toast.error('Ошибка при создании заявки')
		},
	})

	return useMemo(() => ({ createLoad, isLoadingCreate }), [createLoad, isLoadingCreate])
}
