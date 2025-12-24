import { supportService } from '@/services/support.service'
import type { SupportTicketCreateDto } from '@/shared/types/Support.interface'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useCreateSupportTicket = () => {
	const { mutate: createSupportTicket, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['support', 'create'],
		mutationFn: (data: SupportTicketCreateDto) => supportService.createSupportTicket(data),
		onSuccess() {
			toast.success('Сообщение отправлено')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Не удалось отправить сообщение'
			toast.error(message)
		},
	})

	return useMemo(() => ({ createSupportTicket, isLoadingCreate }), [createSupportTicket, isLoadingCreate])
}
