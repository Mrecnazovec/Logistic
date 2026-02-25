import { UserRound } from 'lucide-react'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import { withFallback } from '../lib/paymentPage.utils'
import type { PaymentPageTranslator, PaymentSection } from '../types/paymentPage.types'

type PaymentRoleSectionProps = {
	section: PaymentSection
	t: PaymentPageTranslator
}

export function PaymentRoleSection({ section, t }: PaymentRoleSectionProps) {
	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-2 text-base font-semibold text-foreground'>
				<UserRound className='size-5 text-brand' aria-hidden />
				<span>{section.title}</span>
			</div>
			<div className='grid gap-8 lg:grid-cols-2'>
				<div className='space-y-4'>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.fullName')}</span>
						<span className='text-end font-medium text-foreground'>
							{section.role ? <ProfileLink name={section.role.name} id={section.role.id} /> : DEFAULT_PLACEHOLDER}
						</span>
					</div>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.phone')}</span>
						<span className='text-end font-medium text-foreground'>{withFallback(section.role?.phone)}</span>
					</div>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.company')}</span>
						<span className='text-end font-medium text-foreground'>{withFallback(section.role?.company)}</span>
					</div>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.email')}</span>
						<span className='text-end font-medium text-foreground'>{withFallback(section.role?.login)}</span>
					</div>
				</div>
				<div className='space-y-4'>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.country')}</span>
						<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
					</div>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.city')}</span>
						<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
					</div>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.ordersCount')}</span>
						<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
					</div>
					<div className='flex items-center justify-between gap-6'>
						<span className='text-grayscale'>{t('order.payment.field.confirmation')}</span>
						<span className={section.confirmation ? 'text-end font-medium text-success-500' : 'text-end font-medium text-foreground'}>
							{section.confirmation ? t('order.payment.confirmation.yes') : t('order.payment.confirmation.no')}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
