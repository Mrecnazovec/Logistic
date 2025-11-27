import { loadsService } from '@/services/loads.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useToggleLoadVisibility = () => {
	const queryClient = useQueryClient()

	const { mutate: toggleLoadVisibility, isPending: isLoadingToggle } = useMutation({
		mutationKey: ['load', 'visibility'],
		mutationFn: (uuid: string) => loadsService.toggleLoadVisibility(uuid),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get loads'] })
			queryClient.invalidateQueries({ queryKey: ['get load'] })
			toast.success('Видимость объявления обновлена')
		},
		onError() {
			toast.error('Не удалось обновить видимость объявления')
		},
	})

	return useMemo(
		() => ({ toggleLoadVisibility, isLoadingToggle }),
		[toggleLoadVisibility, isLoadingToggle],
	)
}
