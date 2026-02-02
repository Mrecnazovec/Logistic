import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCancelLoad = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type Payload = {
		id: string
		detail: string
	}
	const { mutate: cancelLoad, isPending: isLoadingCancel } = useMutation({
		mutationKey: ['load', 'cancel'],
		mutationFn: ({ id, detail }: Payload) => loadsService.cancelLoad(id, detail),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'all'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'board'] })
			queryClient.invalidateQueries({ queryKey: ['get loads', 'mine'] })
			toast.success(t('hooks.loads.cancel.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.loads.cancel.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ cancelLoad, isLoadingCancel }), [cancelLoad, isLoadingCancel])
}
