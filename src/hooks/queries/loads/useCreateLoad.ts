import { DASHBOARD_URL } from '@/config/url.config'
import { loadsService } from '@/services/loads.service'
import type { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import type { FieldError, IErrorResponse } from '@/shared/types/Error.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateLoad = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: createLoad, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['load', 'create'],
		mutationFn: (data: CargoPublishRequestDto) => loadsService.createLoad(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'board'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.loads.create.success'))
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

				toast.error(message ?? t('hooks.loads.create.error'))
			} else {
				const message = getErrorMessage(error) ?? t('hooks.loads.create.error')
				toast.error(message)
			}
		},
	})

	return useMemo(() => ({ createLoad, isLoadingCreate }), [createLoad, isLoadingCreate])
}
