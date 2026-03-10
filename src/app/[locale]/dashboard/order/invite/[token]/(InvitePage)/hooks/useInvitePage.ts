import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { DASHBOARD_URL } from '@/config/url.config'
import { useAcceptOrderInvite } from '@/hooks/queries/orders/useAcceptOrderInvite'
import { useDeclineOrderInvite } from '@/hooks/queries/orders/useDeclineOrderInvite'
import { useConfirmOrderTerms } from '@/hooks/queries/orders/useConfirmOrderTerms'
import { useGetInvitePreview } from '@/hooks/queries/orders/useGet/useGetInvitePreview'
import { useI18n } from '@/i18n/I18nProvider'
import { getAccessToken } from '@/services/auth/auth-token.service'
import { buildAuthHref, buildInvitePreviewViewModel } from '../lib/invitePage.utils'

export function useInvitePage() {
	const { t } = useI18n()
	const params = useParams<{ token: string }>()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const token = params?.token ?? ''
	const trimmedToken = token.trim()
	const query = searchParams.toString()
	const accessToken = getAccessToken()
	const authHref = buildAuthHref(token, pathname, query)

	const [isTermsOpen, setIsTermsOpen] = useState(false)
	const [isTermsChecked, setIsTermsChecked] = useState(false)

	const { acceptOrderInvite, isLoadingAccept } = useAcceptOrderInvite()
	const { declineOrderInvite, isLoadingDecline } = useDeclineOrderInvite()
	const { confirmOrderTerms, isLoadingConfirmTerms } = useConfirmOrderTerms()
	const { invitePreview, isLoading: isLoadingInvitePreview } = useGetInvitePreview(accessToken ? trimmedToken : '')

	useEffect(() => {
		if (!accessToken) {
			router.replace(authHref)
		}
	}, [accessToken, authHref, router])

	const isSubmitting = isLoadingAccept || isLoadingConfirmTerms || isLoadingDecline

	const handleAccept = () => {
		if (!trimmedToken) {
			toast.error(t('order.invite.toast.emptyToken'))
			return
		}
		if (!isTermsChecked) return

		acceptOrderInvite(
			{ token: trimmedToken },
			{
				onSuccess: (order) => {
					if (order?.order_id) {
						confirmOrderTerms(order.order_id)
					}
				},
			},
		)
	}

	const handleDecline = () => {
		if (!trimmedToken) {
			toast.error(t('order.invite.toast.emptyToken'))
			return
		}
		declineOrderInvite(
			{ token: trimmedToken },
			{
				onSuccess: () => router.push(DASHBOARD_URL.home()),
			},
		)
	}

	const previewViewModel = useMemo(
		() => (invitePreview ? buildInvitePreviewViewModel(invitePreview, t) : null),
		[invitePreview, t],
	)

	return {
		t,
		accessToken,
		authHref,
		invitePreview,
		previewViewModel,
		isLoadingInvitePreview,
		isTermsOpen,
		setIsTermsOpen,
		isTermsChecked,
		setIsTermsChecked,
		isSubmitting,
		isLoadingAccept,
		isLoadingDecline,
		isLoadingConfirmTerms,
		handleAccept,
		handleDecline,
	}
}
