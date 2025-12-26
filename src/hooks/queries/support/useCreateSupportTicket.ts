import type { SupportTicketCreateDto } from '@/shared/types/Support.interface'
import { supportService } from '@/services/support.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useCreateSupportTicket = () => {
	const { t } = useI18n()
	const { mutate: createSupportTicket, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['support', 'create'],
		mutationFn: (data: SupportTicketCreateDto) => supportService.createSupportTicket(data),
		onSuccess() {
			toast.success(t('hooks.support.create.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.support.create.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ createSupportTicket, isLoadingCreate }), [createSupportTicket, isLoadingCreate])
}
