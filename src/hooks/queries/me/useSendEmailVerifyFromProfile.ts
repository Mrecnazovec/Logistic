import type { SendEmailVerifyFromProfileDto } from '@/shared/types/Me.interface'
import { meService } from '@/services/me.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useSendEmailVerifyFromProfile = () => {
	const { t } = useI18n()
	const { mutate: sendEmailVerify, isPending: isLoading } = useMutation({
		mutationKey: ['me', 'email-send'],
		mutationFn: (data: SendEmailVerifyFromProfileDto) => meService.sendEmailVerifyFromProfile(data),
		onSuccess() {
			toast.success(t('hooks.me.emailSend.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.me.emailSend.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ sendEmailVerify, isLoading }), [sendEmailVerify, isLoading])
}
