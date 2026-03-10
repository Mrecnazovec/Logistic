import { CheckCircle2, Truck } from 'lucide-react'
import type { IAgreementDetail } from '@/shared/types/Agreement.interface'
import type { AgreementTranslator } from '../types/agreementPage.types'

type AgreementAcceptanceStatusProps = {
	agreement: IAgreementDetail
	t: AgreementTranslator
}

export function AgreementAcceptanceStatus({ agreement, t }: AgreementAcceptanceStatusProps) {
	return (
		<div className='flex flex-wrap items-center gap-6 text-sm'>
			<div className={agreement.accepted_by_customer ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
				<CheckCircle2 className='size-4' aria-hidden />
				<span>
					{agreement.accepted_by_customer
						? t('order.agreement.accepted.customer.yes')
						: t('order.agreement.accepted.customer.no')}
				</span>
			</div>

			{agreement.logistic_id ? (
				<div className={agreement.accepted_by_logistic ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
					<CheckCircle2 className='size-4' aria-hidden />
					<span>
						{agreement.accepted_by_logistic
							? t('order.agreement.accepted.logistic.yes')
							: t('order.agreement.accepted.logistic.no')}
					</span>
				</div>
			) : null}

			{agreement.carrier_id ? (
				<div className={agreement.accepted_by_carrier ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
					<Truck className='size-4' aria-hidden />
					<span>
						{agreement.accepted_by_carrier
							? t('order.agreement.accepted.carrier.yes')
							: t('order.agreement.accepted.carrier.no')}
					</span>
				</div>
			) : null}
		</div>
	)
}
