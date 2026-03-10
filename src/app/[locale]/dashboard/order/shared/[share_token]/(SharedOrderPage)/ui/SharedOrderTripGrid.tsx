import { Badge } from '@/components/ui/Badge'
import {
	DEFAULT_PLACEHOLDER,
	formatDateValue,
	formatDistanceKm,
	formatPriceValue,
} from '@/lib/formatters'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import type { SharedOrderDriverStatusMeta, SharedOrderPageTranslator } from '../types/sharedOrderPage.types'

type SharedOrderTripGridProps = {
	order: IOrderDetail
	loadingDocument: { hasDocument: boolean; formattedDate: string }
	unloadingDocument: { hasDocument: boolean; formattedDate: string }
	driverStatusMeta: SharedOrderDriverStatusMeta | null
	t: SharedOrderPageTranslator
}

const renderDocumentValue = (hasDocument: boolean, documentDate: string) => {
	if (hasDocument) return <span className='font-medium text-end'>{documentDate}</span>
	return <span className='font-medium text-end text-muted-foreground'>{DEFAULT_PLACEHOLDER}</span>
}

export function SharedOrderTripGrid({
	order,
	loadingDocument,
	unloadingDocument,
	driverStatusMeta,
	t,
}: SharedOrderTripGridProps) {
	return (
		<div className='grid gap-15 lg:grid-cols-3'>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.loading')}</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.originCity')}</span>
					<span className='text-end font-medium'>{order.origin_city ?? DEFAULT_PLACEHOLDER}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.address')}</span>
					<span className='text-end font-medium'>{order.origin_address ?? DEFAULT_PLACEHOLDER}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.loadDate')}</span>
					<span className='text-end font-medium'>{formatDateValue(order.load_date)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-success-500'>{t('order.field.loaded')}</span>
					{renderDocumentValue(loadingDocument.hasDocument, loadingDocument.formattedDate)}
				</p>
			</div>

			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.unloading')}</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.destinationCity')}</span>
					<span className='text-end font-medium'>{order.destination_city ?? DEFAULT_PLACEHOLDER}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.address')}</span>
					<span className='text-end font-medium'>{order.destination_address ?? DEFAULT_PLACEHOLDER}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.unloadDate')}</span>
					<span className='text-end font-medium'>{formatDateValue(order.delivery_date)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-success-500'>{t('order.field.unloaded')}</span>
					{renderDocumentValue(unloadingDocument.hasDocument, unloadingDocument.formattedDate)}
				</p>
			</div>

			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.transport')}</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.distance')}</span>
					<span className='text-end font-medium'>{formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.price')}</span>
					<span className='text-end font-medium'>{formatPriceValue(order.price_total, order.currency)}</span>
				</p>
				<p className='flex items-center justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.driverStatus')}</span>
					{order.status !== OrderStatusEnum.NODRIVER && driverStatusMeta ? (
						<Badge variant={driverStatusMeta.variant}>{driverStatusMeta.label}</Badge>
					) : (
						<span className='text-end font-medium text-muted-foreground'>{DEFAULT_PLACEHOLDER}</span>
					)}
				</p>
			</div>
		</div>
	)
}
