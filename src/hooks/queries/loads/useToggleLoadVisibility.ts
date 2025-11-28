import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

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
			toast.success('Видимость объявления обновлена')
		},
		onError() {
			toast.error('Не удалось изменить видимость объявления')
		},
	})

	return useMemo(
		() => ({ toggleLoadVisibility, isLoadingToggle }),
		[toggleLoadVisibility, isLoadingToggle],
	)
}
