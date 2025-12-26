import type { IOfferInvite } from '@/shared/types/Offer.interface'
import { offersService } from '@/services/offers.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useInviteOffer = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const { mutate: inviteOffer, isPending: isLoadingInviteOffer } = useMutation({
		mutationKey: ['offer', 'invite'],
		mutationFn: (data: IOfferInvite) => offersService.inviteOffer(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success(t('hooks.offers.invite.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.offers.invite.error')
			toast.error(message)
		},
	})

	return useMemo(() => ({ inviteOffer, isLoadingInviteOffer }), [inviteOffer, isLoadingInviteOffer])
}
