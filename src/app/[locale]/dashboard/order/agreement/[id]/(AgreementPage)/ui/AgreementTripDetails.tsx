import { formatDateValue, formatPriceValue } from '@/lib/formatters'
import type { IAgreementDetail } from '@/shared/types/Agreement.interface'
import { EMPTY_VALUE } from '../constants/agreementPage.constants'
import { withFallback } from '../lib/agreementPage.utils'
import type { AgreementTranslator } from '../types/agreementPage.types'

type AgreementTripDetailsProps = {
	agreement: IAgreementDetail
	totalDistance: string
	travelTime: string
	paymentMethod: string
	t: AgreementTranslator
}

export function AgreementTripDetails({ agreement, totalDistance, travelTime, paymentMethod, t }: AgreementTripDetailsProps) {
	return (
		<div className='border-t border-b border-border/60 py-6'>
			<div className='grid gap-8 md:grid-cols-3'>
				<div className='space-y-4'>
					<p className='text-brand font-semibold'>{t('order.agreement.section.loading')}</p>
					<div className='space-y-3 text-sm'>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.city')}</span>
							<span className='text-end font-medium'>{withFallback(agreement.loading_city)}</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.street')}</span>
							<span className='text-end font-medium'>{withFallback(agreement.loading_address)}</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.date')}</span>
							<span className='text-end font-medium'>
								{formatDateValue(agreement.loading_date, 'dd/MM/yyyy', EMPTY_VALUE)}
							</span>
						</p>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-brand font-semibold'>{t('order.agreement.section.unloading')}</p>
					<div className='space-y-3 text-sm'>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.city')}</span>
							<span className='text-end font-medium'>{withFallback(agreement.unloading_city)}</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.street')}</span>
							<span className='text-end font-medium'>{withFallback(agreement.unloading_address)}</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.date')}</span>
							<span className='text-end font-medium'>
								{formatDateValue(agreement.unloading_date, 'dd/MM/yyyy', EMPTY_VALUE)}
							</span>
						</p>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-brand font-semibold'>{t('order.agreement.section.tripDetails')}</p>
					<div className='space-y-3 text-sm'>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.totalDistance')}</span>
							<span className='text-end font-medium'>{totalDistance}</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.travelTime')}</span>
							<span className='text-end font-medium'>{travelTime}</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.price')}</span>
							<span className='text-end font-medium'>
								{formatPriceValue(agreement.price_value, agreement.price_currency)}
							</span>
						</p>
						<p className='flex items-center justify-between gap-6'>
							<span className='text-muted-foreground'>{t('order.agreement.field.priceMethod')}</span>
							<span className='text-end font-medium'>{paymentMethod}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
