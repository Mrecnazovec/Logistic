import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { DASHBOARD_URL } from '@/config/url.config'
import type { PaymentConfirmAction, PaymentPageTranslator } from '../types/paymentPage.types'
import { PaymentConfirmDialog } from './PaymentConfirmDialog'
import { PaymentDisputeDialog } from './PaymentDisputeDialog'

type PaymentActionsProps = {
	orderId: number
	isPaymentAvailable: boolean
	confirmAction: PaymentConfirmAction
	isConfirmOpen: boolean
	onConfirmOpenChange: (value: boolean) => void
	isDisputeOpen: boolean
	onDisputeOpenChange: (value: boolean) => void
	t: PaymentPageTranslator
}

export function PaymentActions({
	orderId,
	isPaymentAvailable,
	confirmAction,
	isConfirmOpen,
	onConfirmOpenChange,
	isDisputeOpen,
	onDisputeOpenChange,
	t,
}: PaymentActionsProps) {
	return (
		<div className='flex flex-wrap items-center justify-end gap-3 pt-2'>
			<PaymentConfirmDialog
				open={isConfirmOpen}
				onOpenChange={onConfirmOpenChange}
				isPaymentAvailable={isPaymentAvailable}
				confirmAction={confirmAction}
				t={t}
			/>
			<Link href={DASHBOARD_URL.order(String(orderId))}>
				<Button className='min-w-[110px] bg-warning-400 text-white hover:bg-warning-500'>
					{t('order.payment.actions.later')}
				</Button>
			</Link>
			<PaymentDisputeDialog open={isDisputeOpen} onOpenChange={onDisputeOpenChange} t={t} />
		</div>
	)
}
