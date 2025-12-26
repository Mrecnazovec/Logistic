import type { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePutLoad = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type PutLoadPayload = {
		id: string
		data: CargoPublishRequestDto
	}
	const { mutate: putLoad, isPending: isLoadingPut } = useMutation({
		mutationKey: ['load', 'put'],
		mutationFn: ({ id, data }: PutLoadPayload) => loadsService.putLoad(id, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.loads.put.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.loads.put.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ putLoad, isLoadingPut }), [putLoad, isLoadingPut])
}
