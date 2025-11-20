import { offerService } from '@/services/offers.service'
import { IOfferInvite } from '@/shared/types/Offer.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export const useInviteOffer = () => {
	const queryClient = useQueryClient()

	const { mutate: inviteOffer, isPending: isLoadingInvite } = useMutation({
		mutationKey: ['offer', 'invite'],
		mutationFn: (data: IOfferInvite) => offerService.inviteOffer(data),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get offers'] })
			queryClient.invalidateQueries({ queryKey: ['get orders'] })
			toast.success('Инвайт отправлен')
		},
		onError() {
			toast.error('Ошибка при отправке инвайта')
		},
	})

	return useMemo(() => ({ inviteOffer, isLoadingInvite }), [inviteOffer, isLoadingInvite])
}
