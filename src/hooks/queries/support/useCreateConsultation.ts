import type { ConsultationCreateDto } from '@/shared/types/Support.interface'
import { supportService } from '@/services/support.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type UseCreateConsultationOptions = {
	onSuccess?: () => void
}

export const useCreateConsultation = (options?: UseCreateConsultationOptions) => {
	const { t } = useI18n()
	const { mutate: createConsultation, isPending: isLoading } = useMutation({
		mutationKey: ['support', 'consultation'],
		mutationFn: (data: ConsultationCreateDto) => supportService.createConsultation(data),
		onSuccess() {
			toast.success(t('hooks.support.consultation.success'))
			options?.onSuccess?.()
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.support.consultation.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ createConsultation, isLoading }), [createConsultation, isLoading])
}
