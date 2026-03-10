import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAcceptAgreement } from '@/hooks/queries/agreements/useAcceptAgreement'
import { useGetAgreement } from '@/hooks/queries/agreements/useGetAgreement'
import { useRejectAgreement } from '@/hooks/queries/agreements/useRejectAgreement'
import { useI18n } from '@/i18n/I18nProvider'
import { getAgreementStatusMeta, getPaymentMethod, getTotalDistance } from '../lib/agreementPage.utils'

export function useAgreementPage() {
	const { t } = useI18n()
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const agreementId = params?.id

	const { data: agreement, isLoading } = useGetAgreement(agreementId)
	const { acceptAgreement, isLoadingAcceptAgreement } = useAcceptAgreement()
	const { rejectAgreement, isLoadingRejectAgreement } = useRejectAgreement()

	const [remainingMs, setRemainingMs] = useState(0)
	const [isTermsOpen, setIsTermsOpen] = useState(false)
	const [isTermsChecked, setIsTermsChecked] = useState(false)

	const expiresAtMs = agreement?.expires_at ? new Date(agreement.expires_at).getTime() : 0
	useEffect(() => {
		if (!expiresAtMs) return

		const update = () => setRemainingMs(Math.max(expiresAtMs - Date.now(), 0))
		const timeoutId = window.setTimeout(update, 0)
		const intervalId = window.setInterval(update, 1000)

		return () => {
			window.clearTimeout(timeoutId)
			window.clearInterval(intervalId)
		}
	}, [expiresAtMs])

	const displayedRemainingMs = expiresAtMs ? remainingMs : 0
	const createdAtMs = agreement?.created_at ? new Date(agreement.created_at).getTime() : expiresAtMs - displayedRemainingMs
	const totalDurationMs = Math.max(expiresAtMs - createdAtMs, 0)
	const progress = totalDurationMs ? Math.min(displayedRemainingMs / totalDurationMs, 1) : 0

	const isProcessing = isLoadingAcceptAgreement || isLoadingRejectAgreement
	const status = agreement ? getAgreementStatusMeta(agreement.status, t) : null
	const totalDistance = agreement ? getTotalDistance(agreement.total_distance_km, t) : null
	const paymentMethod = agreement ? getPaymentMethod(agreement.payment_method, t) : null

	const handleAccept = () => {
		if (!agreementId) return
		acceptAgreement(agreementId, { onSuccess: () => router.refresh() })
	}

	const handleReject = () => {
		if (!agreementId) return
		rejectAgreement(agreementId, { onSuccess: () => router.refresh() })
	}

	return {
		t,
		agreement,
		isLoading,
		displayedRemainingMs,
		progress,
		isTermsOpen,
		setIsTermsOpen,
		isTermsChecked,
		setIsTermsChecked,
		isProcessing,
		isLoadingAcceptAgreement,
		isLoadingRejectAgreement,
		status,
		totalDistance,
		paymentMethod,
		handleAccept,
		handleReject,
	}
}
