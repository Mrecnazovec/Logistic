import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { formatDateValue } from '@/lib/formatters'
import { EMPTY_VALUE } from '../constants/agreementPage.constants'
import { withFallback } from '../lib/agreementPage.utils'

type AgreementParticipantSectionProps = {
	title: string
	id: number
	fullName: string
	phone: string | null | undefined
	email: string | null | undefined
	registeredAt: string | null | undefined
	fieldIdLabel: string
	fieldFullNameLabel: string
	fieldPhoneLabel: string
	fieldEmailLabel: string
	fieldRegisteredAtLabel: string
}

export function AgreementParticipantSection({
	title,
	id,
	fullName,
	phone,
	email,
	registeredAt,
	fieldIdLabel,
	fieldFullNameLabel,
	fieldPhoneLabel,
	fieldEmailLabel,
	fieldRegisteredAtLabel,
}: AgreementParticipantSectionProps) {
	return (
		<div className='space-y-4'>
			<p className='text-brand font-semibold'>{title}</p>
			<div className='space-y-3'>
				<p className='flex justify-between gap-6'>
					<span className='text-grayscale'>{fieldIdLabel}</span>
					<span className='text-end font-medium'>
						<UuidCopy id={id} isPlaceholder />
					</span>
				</p>
				<p className='flex justify-between gap-6'>
					<span className='text-grayscale'>{fieldFullNameLabel}</span>
					<span className='text-end font-medium'>
						<ProfileLink id={id} name={fullName} />
					</span>
				</p>
				<p className='flex justify-between gap-6'>
					<span className='text-grayscale'>{fieldPhoneLabel}</span>
					<span className='text-end font-medium'>{withFallback(phone)}</span>
				</p>
				<p className='flex justify-between gap-6'>
					<span className='text-grayscale'>{fieldEmailLabel}</span>
					<span className='text-end font-medium'>{withFallback(email)}</span>
				</p>
				<p className='flex justify-between gap-6'>
					<span className='text-grayscale'>{fieldRegisteredAtLabel}</span>
					<span className='text-end font-medium'>{formatDateValue(registeredAt, 'dd/MM/yyyy', EMPTY_VALUE)}</span>
				</p>
			</div>
		</div>
	)
}
