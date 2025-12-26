import { loadsService } from '@/services/loads.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { GenerateInviteResponse } from '@/shared/types/Offer.interface'

export const useGenerateLoadInvite = () => {
	const { t } = useI18n()
	const [invite, setInvite] = useState<GenerateInviteResponse | null>(null)
	const resetInvite = () => setInvite(null)
	const { mutate: generateLoadInvite, isPending: isLoadingGenerate } = useMutation({
		mutationKey: ['load', 'generate-invite'],
		mutationFn: (uuid: string) => loadsService.generateLoadInvite(uuid),
		onSuccess(data: GenerateInviteResponse) {
			setInvite(data)
			toast.success(t('hooks.loads.generateInvite.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.loads.generateInvite.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ generateLoadInvite, invite, isLoadingGenerate, resetInvite }), [generateLoadInvite, invite, isLoadingGenerate])
}
