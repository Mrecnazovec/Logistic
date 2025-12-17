import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ToggleLoadPayload = {
	uuid: string
	isHidden: boolean
}

export const useToggleLoadVisibility = () => {
	const queryClient = useQueryClient()

	const { mutate: toggleLoadVisibility, isPending: isLoadingToggle } = useMutation({
		mutationKey: ['load', 'visibility'],
		mutationFn: ({ uuid, isHidden }: ToggleLoadPayload) => loadsService.toggleLoadVisibility(uuid, isHidden),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			queryClient.invalidateQueries({ queryKey: ['get load'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success('Видимость объявления изменена')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось изменить видимость объявления'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ toggleLoadVisibility, isLoadingToggle }),
		[toggleLoadVisibility, isLoadingToggle],
	)
}
