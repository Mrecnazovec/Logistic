import { DASHBOARD_URL } from '@/config/url.config'
import { loadsService } from '@/services/loads.service'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { FieldError, IErrorResponse } from '@/shared/types/Error.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useCreateLoad = () => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: createLoad, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['load', 'create'],
		mutationFn: (data: CargoPublishRequestDto) => loadsService.createLoad(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			toast.success('Объявление успешно создано')
			router.push(DASHBOARD_URL.announcements())
		},
		onError(error) {
			const err = error as AxiosError<IErrorResponse>

			if (err.response) {
				const formatError = (value?: FieldError) => {
					if (!value) return undefined
					return Array.isArray(value) ? value.join(' ') : value
				}

				const { load_date, delivery_date, detail } = err.response.data
				const message =
					formatError(load_date) ??
					formatError(delivery_date) ??
					formatError(detail as FieldError) ??
					getErrorMessage(error)

				toast.error(message ?? 'Не удалось создать объявление')
			} else {
				const message = getErrorMessage(error) ?? 'Не удалось создать объявление'
				toast.error(message)
			}
		},
	})

	return useMemo(() => ({ createLoad, isLoadingCreate }), [createLoad, isLoadingCreate])
}
