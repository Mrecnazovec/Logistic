import { offerService } from '@/services/offers.service'
import { IOfferInvite } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useInviteOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: inviteOffer, isPending: isLoadingInvite } = useMutation({
		mutationKey: ['offer', 'invite'],
		mutationFn: (data: IOfferInvite) => offerService.inviteOffer(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			toast.success('Инвайт отправлен')
		},
		onError(error) {
			const message = getErrorMessage(error) ?? 'Ошибка при отправке инвайта'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ inviteOffer, isLoadingInvite }),
		[inviteOffer, isLoadingInvite],
	)
}
