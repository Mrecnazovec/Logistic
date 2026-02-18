'use client'

import { isValueMissing } from './guards/profileGuards'
import { useCabinetPage } from './hooks/useCabinetPage'
import { AnalyticsPanel } from './ui/AnalyticsPanel'
import { ProfilePanel } from './ui/ProfilePanel'
import dynamic from 'next/dynamic'

const CabinetEmailModal = dynamic(
	() => import('@/components/ui/modals/CabinetEmailModal').then((mod) => mod.CabinetEmailModal),
	{ ssr: false },
)
const CabinetPhoneModal = dynamic(
	() => import('@/components/ui/modals/CabinetPhoneModal').then((mod) => mod.CabinetPhoneModal),
	{ ssr: false },
)

export function Cabinet() {
	const {
		t,
		me,
		isLoading,
		logout,
		isLoadingLogout,
		isLoadingUpdateMe,
		isLoadingAnalytics,
		isRevenueOpen,
		setIsRevenueOpen,
		isTransportOpen,
		setIsTransportOpen,
		isEmailModalOpen,
		setIsEmailModalOpen,
		isPhoneModalOpen,
		handlePhoneModalOpenChange,
		emailValue,
		isEmailVerified,
		shouldShowEmailActions,
		phoneValue,
		isPhoneMissing,
		isResendingVerify,
		isVerifyingEmail,
		isSendingPhoneOtp,
		isVerifyingPhoneOtp,
		profileFields,
		detailCards,
		integerFormatter,
		incomeChartConfig,
		incomeChartData,
		transportChartConfig,
		transportChartData,
		totalTransports,
		handleEmailSendCode,
		handleEmailVerifyCode,
		handlePhoneSendCode,
		handlePhoneVerifyCode,
	} = useCabinetPage()

	return (
		<div className='flex h-full flex-col gap-4 lg:flex-row lg:gap-6'>
			<h1 className='sr-only'>{t('cabinet.title')}</h1>

			<ProfilePanel
				t={t}
				me={me}
				isLoading={isLoading}
				isLoadingLogout={isLoadingLogout}
				logout={logout}
				profileFields={profileFields}
				emailValue={emailValue}
				phoneValue={phoneValue}
				isEmailMissing={isValueMissing(emailValue)}
				isEmailVerified={isEmailVerified}
				shouldShowEmailActions={shouldShowEmailActions}
				isResendingVerify={isResendingVerify}
				isPhoneMissing={isPhoneMissing}
				isSendingPhoneOtp={isSendingPhoneOtp}
				isVerifyingPhoneOtp={isVerifyingPhoneOtp}
				isLoadingUpdateMe={isLoadingUpdateMe}
				onOpenEmailModal={() => setIsEmailModalOpen(true)}
				onOpenPhoneModal={() => handlePhoneModalOpenChange(true)}
			/>

			<AnalyticsPanel
				t={t}
				isLoadingAnalytics={isLoadingAnalytics}
				detailCards={detailCards}
				isRevenueOpen={isRevenueOpen}
				setIsRevenueOpen={setIsRevenueOpen}
				isTransportOpen={isTransportOpen}
				setIsTransportOpen={setIsTransportOpen}
				incomeChartConfig={incomeChartConfig}
				incomeChartData={incomeChartData}
				transportChartConfig={transportChartConfig}
				transportChartData={transportChartData}
				integerFormatter={integerFormatter}
				totalTransports={totalTransports}
			/>

			<CabinetEmailModal
				open={isEmailModalOpen}
				onOpenChange={setIsEmailModalOpen}
				email={emailValue}
				isEmailVerified={isEmailVerified}
				isSending={isResendingVerify}
				isVerifying={isVerifyingEmail}
				onSendCode={handleEmailSendCode}
				onVerifyCode={handleEmailVerifyCode}
			/>

			<CabinetPhoneModal
				open={isPhoneModalOpen}
				onOpenChange={handlePhoneModalOpenChange}
				phone={phoneValue}
				isSending={isSendingPhoneOtp}
				isVerifying={isVerifyingPhoneOtp}
				onSendCode={handlePhoneSendCode}
				onVerifyCode={handlePhoneVerifyCode}
			/>
		</div>
	)
}
