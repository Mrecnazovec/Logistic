import type { PatchedCargoPublishDto } from '@/shared/types/CargoPublish.interface'
import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const usePatchLoad = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type PatchLoadPayload = {
		uuid: string
		data: PatchedCargoPublishDto
	}
	const { mutate: patchLoad, isPending: isLoadingPatch } = useMutation({
		mutationKey: ['load', 'patch'],
		mutationFn: ({ uuid, data }: PatchLoadPayload) => loadsService.patchLoad(uuid, data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.loads.patch.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.loads.patch.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ patchLoad, isLoadingPatch }), [patchLoad, isLoadingPatch])
}
