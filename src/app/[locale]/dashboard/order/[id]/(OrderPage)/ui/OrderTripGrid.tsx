import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DEFAULT_PLACEHOLDER, formatDateValue, formatDistanceKm, formatPriceValue } from '@/lib/formatters'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'

type DriverStatusMeta = { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' } | null

type Props = {
	t: (...args: any[]) => string
	order: IOrderDetail
	hasLoadingDocument: boolean
	hasUnloadingDocument: boolean
	firstLoadingDocumentDate: string
	firstUnloadingDocumentDate: string
	docsBasePath: string
	isCarrier: boolean
	driverStatusMeta: DriverStatusMeta
	transportPriceValue: string | number | null | undefined
	mobileAfterUnloadingSlot?: React.ReactNode
	mobileActionsSlot?: React.ReactNode
}

const withFallback = (value?: string | number | null) => {
	if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
	return String(value)
}

export function OrderTripGrid({
	t,
	order,
	hasLoadingDocument,
	hasUnloadingDocument,
	firstLoadingDocumentDate,
	firstUnloadingDocumentDate,
	docsBasePath,
	isCarrier,
	driverStatusMeta,
	transportPriceValue,
	mobileAfterUnloadingSlot,
	mobileActionsSlot,
}: Props) {
	const renderDocumentAction = (
		hasDocument: boolean,
		documentDate: string,
		href: string,
		buttonLabel: string,
		allowUpload: boolean,
		isButton?: boolean,
	) => {
		if (hasDocument && !isButton) return <span className='font-medium text-end'>{documentDate}</span>
		if (!allowUpload) return null
		if (hasDocument && isButton) return null
		if (isButton) {
			return (
				<Button asChild variant='outline'>
					<Link href={href}>{buttonLabel}</Link>
				</Button>
			)
		}
		return null
	}

	return (
		<div className='grid gap-15 lg:grid-cols-3'>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.loading')}</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.originCity')}</span>
					<span className='text-end font-medium'>{withFallback(order.origin_city)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.address')}</span>
					<span className='text-end font-medium'>{withFallback(order.origin_address)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.loadDate')}</span>
					<span className='text-end font-medium'>{formatDateValue(order.load_date)}</span>
				</p>
				{hasLoadingDocument && (
					<p className='flex justify-between gap-3'>
						<span className='text-success-500'>{t('order.field.loaded')}</span>
						{renderDocumentAction(
							hasLoadingDocument,
							firstLoadingDocumentDate,
							`${docsBasePath}/loading`,
							t('order.actions.uploadDocument'),
							isCarrier,
						)}
					</p>
				)}
			</div>

			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.unloading')}</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.destinationCity')}</span>
					<span className='text-end font-medium'>{withFallback(order.destination_city)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.address')}</span>
					<span className='text-end font-medium'>{withFallback(order.destination_address)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.unloadDate')}</span>
					<span className='text-end font-medium'>{formatDateValue(order.delivery_date)}</span>
				</p>
				{hasUnloadingDocument && (
					<p className='flex justify-between gap-3'>
						<span className='text-success-500'>{t('order.field.unloaded')}</span>
						{renderDocumentAction(
							hasUnloadingDocument,
							firstUnloadingDocumentDate,
							`${docsBasePath}/unloading`,
							t('order.actions.uploadDocument'),
							isCarrier,
						)}
					</p>
				)}
			</div>

			{mobileAfterUnloadingSlot ? <div className='lg:hidden'>{mobileAfterUnloadingSlot}</div> : null}
			{mobileActionsSlot ? <div className='lg:hidden flex flex-wrap items-center justify-end gap-3'>{mobileActionsSlot}</div> : null}

			<div className='space-y-3'>
				<p className='font-medium text-brand'>{t('order.section.transport')}</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.distance')}</span>
					<span className='text-end font-medium'>{formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)}</span>
				</p>
				<p className='flex justify-between gap-3'>
					<span className='text-grayscale'>{t('order.field.price')}</span>
					<span className='text-end font-medium'>{formatPriceValue(transportPriceValue, order.currency)}</span>
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
