import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useToggleLoadVisibility = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	type ToggleLoadVisibilityPayload = {
		uuid: string
		isHidden: boolean
	}
	const { mutate: toggleLoadVisibility, isPending: isLoadingToggle } = useMutation({
		mutationKey: ['load', 'toggle-visibility'],
		mutationFn: ({ uuid, isHidden }: ToggleLoadVisibilityPayload) =>
			loadsService.toggleLoadVisibility(uuid, isHidden),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads', 'public'] })
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(t('hooks.loads.toggleVisibility.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.loads.toggleVisibility.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ toggleLoadVisibility, isLoadingToggle }), [toggleLoadVisibility, isLoadingToggle])
}
