import { DASHBOARD_URL } from '@/config/url.config'
import { loadsService } from '@/services/loads.service'
import { ICargoPublish } from '@/shared/types/CargoPublish.interface'
import { IErrorResponse } from '@/shared/types/Error.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateLoad = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: createLoad, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['load', 'create'],
		mutationFn: (data: ICargoPublish) => loadsService.createLoad(data),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			toast.success(`${data.message}`)
			router.push(DASHBOARD_URL.announcements())
		},
		onError(error) {
			const err = error as AxiosError<IErrorResponse>

			if (err.response) {
				toast.error(err.response.data.load_date || err.response.data.delivery_date)
			} else {
				toast.error('Ошибка при создании заявки')
			}
		},
	})

	return useMemo(() => ({ createLoad, isLoadingCreate }), [createLoad, isLoadingCreate])
}
