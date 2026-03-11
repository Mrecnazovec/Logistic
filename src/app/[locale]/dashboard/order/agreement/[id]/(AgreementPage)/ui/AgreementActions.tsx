import { Button } from '@/components/ui/Button'
import type { AgreementTranslator } from '../types/agreementPage.types'

type AgreementActionsProps = {
	isProcessing: boolean
	isTermsChecked: boolean
	isLoadingRejectAgreement: boolean
	isLoadingAcceptAgreement: boolean
	onReject: () => void
	onAccept: () => void
	t: AgreementTranslator
}

export function AgreementActions({
	isProcessing,
	isTermsChecked,
	isLoadingRejectAgreement,
	isLoadingAcceptAgreement,
	onReject,
	onAccept,
	t,
}: AgreementActionsProps) {
	return (
		<div className='flex flex-wrap items-center justify-end gap-3'>
			<Button variant='destructive' onClick={onReject} disabled={isProcessing} className='sm:min-w-[160px] max-sm:w-full'>
				{isLoadingRejectAgreement ? t('order.agreement.actions.rejectLoading') : t('order.agreement.actions.reject')}
			</Button>
			<Button
				onClick={onAccept}
				disabled={isProcessing || !isTermsChecked}
				className={
					isTermsChecked
						? 'sm:min-w-[160px] max-sm:w-full bg-success-500 text-white hover:bg-success-600'
						: 'sm:min-w-[160px] max-sm:w-full bg-[#9CA3AF] text-white hover:bg-[#6B7280]'
				}
			>
				{isLoadingAcceptAgreement ? t('order.agreement.actions.acceptLoading') : t('order.agreement.actions.accept')}
			</Button>
		</div>
	)
}
