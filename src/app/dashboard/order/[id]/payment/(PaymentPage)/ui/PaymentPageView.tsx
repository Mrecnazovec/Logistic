'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { usePaymentPage } from '../hooks/usePaymentPage'
import { PaymentActions } from './PaymentActions'
import { PaymentPageSkeleton } from './PaymentPageSkeleton'
import { PaymentRoleSection } from './PaymentRoleSection'

export function PaymentPageView() {
	const {
		t,
		order,
		isLoading,
		payment,
		paymentId,
		isPaymentAvailable,
		sections,
		confirmAction,
		isConfirmOpen,
		setIsConfirmOpen,
		isDisputeOpen,
		setIsDisputeOpen,
	} = usePaymentPage()

	if (isLoading) return <PaymentPageSkeleton />

	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.payment.notFound')}
			</div>
		)
	}

	return (
		<div className='space-y-8 rounded-4xl bg-background p-8'>
			<div className='flex items-center gap-3'>
				<h1>{t('order.payment.title')}</h1>
				<UuidCopy id={payment?.id} isPlaceholder />
			</div>

			{sections.map((section) => (
				<PaymentRoleSection key={section.key} section={section} t={t} />
			))}

			{!paymentId ? (
				<p className='text-muted-foreground'>{t('order.payment.confirmation.unavailable')}</p>
			) : confirmAction && !confirmAction.isConfirmed ? (
				<PaymentActions
					orderId={order.id}
					isPaymentAvailable={isPaymentAvailable}
					confirmAction={confirmAction}
					isConfirmOpen={isConfirmOpen}
					onConfirmOpenChange={setIsConfirmOpen}
					isDisputeOpen={isDisputeOpen}
					onDisputeOpenChange={setIsDisputeOpen}
					t={t}
				/>
			) : (
				<p className='text-success-500'>{t('order.payment.confirmed')}</p>
			)}
		</div>
	)
}
