import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useRefreshLoad = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type RefreshLoadPayload = {
		uuid: string
		detail?: string
	}
	const { mutate: refreshLoad, isPending: isLoadingRefresh } = useMutation({
		mutationKey: ['load', 'refresh'],
		mutationFn: ({ uuid, detail }: RefreshLoadPayload) => loadsService.refreshLoad(uuid, detail ?? ''),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'by-user'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.loads.refresh.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.loads.refresh.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ refreshLoad, isLoadingRefresh }), [refreshLoad, isLoadingRefresh])
}
