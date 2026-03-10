'use client'

import { Loader } from '@/components/ui/Loader'
import { useAgreementPage } from '../hooks/useAgreementPage'
import { withFallback } from '../lib/agreementPage.utils'
import { AgreementAcceptanceStatus } from './AgreementAcceptanceStatus'
import { AgreementActions } from './AgreementActions'
import { AgreementHeader } from './AgreementHeader'
import { AgreementParticipantsGrid } from './AgreementParticipantsGrid'
import { AgreementTermsSection } from './AgreementTermsSection'
import { AgreementTripDetails } from './AgreementTripDetails'

export function AgreementPageView() {
	const {
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
	} = useAgreementPage()

	if (isLoading) {
		return (
			<div className='w-full h-full rounded-4xl bg-background md:p-8 p-4 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (!agreement || !status || !totalDistance || !paymentMethod) {
		return (
			<div className='w-full h-full rounded-4xl bg-background md:p-8 p-4 flex items-center justify-center'>
				<p className='text-muted-foreground'>{t('order.agreement.notFound')}</p>
			</div>
		)
	}

	return (
		<div className='w-full h-full rounded-4xl bg-background md:p-8 p-4 space-y-10'>
			<AgreementHeader
				agreementId={agreement.id}
				statusLabel={status.label}
				statusClassName={status.className}
				progress={progress}
				displayedRemainingMs={displayedRemainingMs}
				tAgreementNumber={t('order.agreement.number')}
			/>

			<AgreementParticipantsGrid agreement={agreement} t={t} />

			<AgreementTripDetails
				agreement={agreement}
				totalDistance={totalDistance}
				travelTime={withFallback(agreement.travel_time)}
				paymentMethod={paymentMethod}
				t={t}
			/>

			<AgreementTermsSection
				isTermsChecked={isTermsChecked}
				isTermsOpen={isTermsOpen}
				onTermsCheckedChange={setIsTermsChecked}
				onTermsOpenChange={setIsTermsOpen}
				t={t}
			/>

			<AgreementAcceptanceStatus agreement={agreement} t={t} />

			<AgreementActions
				isProcessing={isProcessing}
				isTermsChecked={isTermsChecked}
				isLoadingRejectAgreement={isLoadingRejectAgreement}
				isLoadingAcceptAgreement={isLoadingAcceptAgreement}
				onReject={handleReject}
				onAccept={handleAccept}
				t={t}
			/>
		</div>
	)
}
