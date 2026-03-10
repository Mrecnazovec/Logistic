import type { IAgreementDetail } from '@/shared/types/Agreement.interface'
import { EMPTY_VALUE } from '../constants/agreementPage.constants'
import type { AgreementTranslator } from '../types/agreementPage.types'
import { AgreementParticipantSection } from './AgreementParticipantSection'

type AgreementParticipantsGridProps = {
	agreement: IAgreementDetail
	t: AgreementTranslator
}

export function AgreementParticipantsGrid({ agreement, t }: AgreementParticipantsGridProps) {
	const fieldIdLabel = t('order.agreement.field.id')
	const fieldFullNameLabel = t('order.agreement.field.fullName')
	const fieldPhoneLabel = t('order.agreement.field.phone')
	const fieldEmailLabel = t('order.agreement.field.email')
	const fieldRegisteredAtLabel = t('order.agreement.field.registeredAt')

	return (
		<div className='grid gap-10 lg:grid-cols-3'>
			{agreement.customer_id ? (
				<AgreementParticipantSection
					title={t('order.agreement.customerInfo')}
					id={agreement.customer_id}
					fullName={agreement.customer_full_name ?? EMPTY_VALUE}
					phone={agreement.customer_phone}
					email={agreement.customer_email}
					registeredAt={agreement.customer_registered_at}
					fieldIdLabel={fieldIdLabel}
					fieldFullNameLabel={fieldFullNameLabel}
					fieldPhoneLabel={fieldPhoneLabel}
					fieldEmailLabel={fieldEmailLabel}
					fieldRegisteredAtLabel={fieldRegisteredAtLabel}
				/>
			) : null}
			{agreement.logistic_id ? (
				<AgreementParticipantSection
					title={t('order.agreement.logisticInfo')}
					id={agreement.logistic_id}
					fullName={agreement.logistic_full_name ?? EMPTY_VALUE}
					phone={agreement.logistic_phone}
					email={agreement.logistic_email}
					registeredAt={agreement.logistic_registered_at}
					fieldIdLabel={fieldIdLabel}
					fieldFullNameLabel={fieldFullNameLabel}
					fieldPhoneLabel={fieldPhoneLabel}
					fieldEmailLabel={fieldEmailLabel}
					fieldRegisteredAtLabel={fieldRegisteredAtLabel}
				/>
			) : null}
			{agreement.carrier_id ? (
				<AgreementParticipantSection
					title={t('order.agreement.driverInfo')}
					id={agreement.carrier_id}
					fullName={agreement.carrier_full_name ?? EMPTY_VALUE}
					phone={agreement.carrier_phone}
					email={agreement.carrier_email}
					registeredAt={agreement.carrier_registered_at}
					fieldIdLabel={fieldIdLabel}
					fieldFullNameLabel={fieldFullNameLabel}
					fieldPhoneLabel={fieldPhoneLabel}
					fieldEmailLabel={fieldEmailLabel}
					fieldRegisteredAtLabel={fieldRegisteredAtLabel}
				/>
			) : null}
		</div>
	)
}
