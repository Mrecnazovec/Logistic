import { formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import type { SharedOrderPageTranslator } from '../types/sharedOrderPage.types'

type SharedOrderFinanceSectionProps = {
	order: IOrderDetail
	t: SharedOrderPageTranslator
}

export function SharedOrderFinanceSection({ order, t }: SharedOrderFinanceSectionProps) {
	return (
		<div className='grid gap-15 lg:grid-cols-3'>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.finance')}</p>
				<p className='flex justify-between gap-3 text-error-500'>
					<span className='text-grayscale'>{t('order.field.price')}</span>
					<span className='font-medium'>{formatPriceValue(order.price_total, order.currency)}</span>
				</p>
				<p className='flex justify-between gap-3 text-success-500'>
					<span className='text-grayscale'>{t('order.field.pricePerKm')}</span>
					<span className='font-medium'>{formatPricePerKmValue(order.price_per_km, order.currency)}</span>
				</p>
			</div>
		</div>
	)
}
