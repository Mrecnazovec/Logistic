import { formatPriceValue } from '@/lib/formatters'
import type { IOrderDetail } from '@/shared/types/Order.interface'

type Props = {
	t: (...args: any[]) => string
	order: IOrderDetail
	isOrderCustomer: boolean
	isOrderLogistic: boolean
	isOrderCarrier: boolean
	carrierPriceValue: string | number | null | undefined
}

export function OrderFinanceSection({
	t,
	order,
	isOrderCustomer,
	isOrderLogistic,
	isOrderCarrier,
	carrierPriceValue,
}: Props) {
	return (
		<div className='grid gap-15 lg:grid-cols-3'>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.finance')}</p>
				{isOrderCustomer && (
					<p className='flex justify-between gap-3 text-error-500'>
						<span className='text-grayscale'>{t('order.finance.customerPay')}</span>
						<span className='font-medium'>{formatPriceValue(order.price_total, order.currency)}</span>
					</p>
				)}
				{isOrderLogistic && (
					<>
						<p className='flex justify-between gap-3 text-success-500'>
							<span className='text-grayscale'>{t('order.finance.receive')}</span>
							<span className='font-medium'>{formatPriceValue(order.price_total, order.currency)}</span>
						</p>
						<p className='flex justify-between gap-3 text-error-500'>
							<span className='text-grayscale'>{t('order.finance.pay')}</span>
							<span className='font-medium'>{formatPriceValue(order.driver_price, order.currency)}</span>
						</p>
						<p className='flex justify-between gap-3'>
							<span className='text-grayscale'>{t('order.finance.margin')}</span>
							<span className='font-medium'>{formatPriceValue(order.logistic_margin, order.currency)}</span>
						</p>
					</>
				)}
				{isOrderCarrier && (
					<p className='flex justify-between gap-3 text-success-500'>
						<span className='text-grayscale'>{t('order.finance.receive')}</span>
						<span className='font-medium'>{formatPriceValue(carrierPriceValue, order.currency)}</span>
					</p>
				)}
			</div>
		</div>
	)
}
