'use client'

import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { useGetSharedOrder } from '@/hooks/queries/orders/useGet/useGetSharedOrder'
import { useI18n } from '@/i18n/I18nProvider'
import {
	DEFAULT_PLACEHOLDER,
	formatDateTimeValue,
	formatDateValue,
	formatDistanceKm,
	formatPricePerKmValue,
	formatPriceValue,
} from '@/lib/formatters'
import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { DriverStatus } from '@/shared/types/Order.interface'

const withFallback = (value?: string | number | null, id?: number | null) => {
	if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
	if (id) return <ProfileLink name={String(value)} id={id} />
	return String(value)
}

const renderDocumentValue = (hasDocument: boolean, documentDate: string) => {
	if (hasDocument) return <span className='font-medium text-end'>{documentDate}</span>
	return <span className='font-medium text-end text-muted-foreground'>{DEFAULT_PLACEHOLDER}</span>
}

export function SharedOrderPage() {
	const { t } = useI18n()
	const { order, isLoading } = useGetSharedOrder()

	if (isLoading) return <SharedOrderPageSkeleton />
	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.unavailable')}
			</div>
		)
	}

	const statusBadge = order.status ? (
		<Badge variant={getOrderStatusVariant(order.status)}>{getOrderStatusLabel(order.status, t)}</Badge>
	) : (
		<Badge variant='secondary'>{t('order.status.notSet')}</Badge>
	)

	const driverStatusBadgeMap: Record<DriverStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }> = {
		en_route: { label: t('order.driverStatus.enRoute'), variant: 'info' },
		stopped: { label: t('order.driverStatus.stopped'), variant: 'warning' },
		problem: { label: t('order.driverStatus.problem'), variant: 'danger' },
	}
	const driverStatusMeta = order.driver_status ? driverStatusBadgeMap[order.driver_status] : null
	const hasDriver = Boolean(order.carrier_name)

	const hasLoadingDocument = Boolean(order.loading_datetime)
	const hasUnloadingDocument = Boolean(order.unloading_datetime)
	const firstLoadingDocumentDate = formatDateTimeValue(order.loading_datetime, DEFAULT_PLACEHOLDER)
	const firstUnloadingDocumentDate = formatDateTimeValue(order.unloading_datetime, DEFAULT_PLACEHOLDER)

	return (
		<div className='space-y-6 rounded-4xl bg-background p-8'>
			<div className='flex flex-wrap items-center gap-3'>{statusBadge}</div>

			<div className='grid gap-15 lg:grid-cols-3'>
				{[
					{
							title: t('order.section.customerInfo'),
						rows: [
							{ label: t('order.field.customer'), value: withFallback(order.roles.customer.name, order.roles.customer.id) },
							{ label: t('order.field.company'), value: withFallback(order.roles.customer.company) },
							{ label: t('order.field.contacts'), value: withFallback(order.roles.customer.phone) },
						],
					},
					{
						title: t('order.section.logisticInfo'),
						rows: [
							{ label: t('order.field.logistic'), value: withFallback(order.roles.logistic?.name, order.roles.logistic?.id ?? null) },
							{ label: t('order.field.company'), value: withFallback(order.roles.logistic?.company) },
							{ label: t('order.field.contacts'), value: withFallback(order.roles.logistic?.phone) },
						],
					},
					{
						title: t('order.section.carrierInfo'),
						rows: [
							{
								label: t('order.field.carrier'),
								value: hasDriver ? withFallback(order.roles.carrier?.name, order.roles.carrier?.id ?? null) : DEFAULT_PLACEHOLDER,
							},
							{ label: t('order.field.company'), value: withFallback(order.roles.carrier?.company) },
							{ label: t('order.field.contacts'), value: withFallback(order.roles.carrier?.phone) },
						],
					},
				].map((section) => (
					<div key={section.title} className='space-y-3'>
						<p className='font-medium text-brand'>{section.title}</p>
						{section.rows.map((row) => (
							<p key={row.label} className='flex justify-between gap-3'>
								<span className='text-grayscale'>{row.label}</span>
								<span className='text-end font-medium'>{row.value}</span>
							</p>
						))}
					</div>
				))}
			</div>

			<div className='h-px w-full bg-grayscale' />

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
					<p className='flex justify-between gap-3'>
						<span className='text-success-500'>{t('order.field.loaded')}</span>
						{renderDocumentValue(hasLoadingDocument, firstLoadingDocumentDate)}
					</p>
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
					<p className='flex justify-between gap-3'>
						<span className='text-success-500'>{t('order.field.unloaded')}</span>
						{renderDocumentValue(hasUnloadingDocument, firstUnloadingDocumentDate)}
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

			<div className='h-px w-full bg-grayscale' />

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
		</div>
	)
}

function SharedOrderPageSkeleton() {
	return (
		<div className='space-y-6 rounded-4xl bg-background p-8'>
			<div className='flex items-center gap-3'>
				<Skeleton className='h-7 w-28 rounded-full' />
				<Skeleton className='h-6 w-32 rounded-full' />
			</div>
			<div className='grid gap-15 lg:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className='space-y-3'>
						<Skeleton className='h-5 w-2/3' />
						{Array.from({ length: 4 }).map((__, rowIndex) => (
							<div key={rowIndex} className='flex items-center justify-between gap-3'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-4 w-32' />
							</div>
						))}
					</div>
				))}
			</div>
			<Skeleton className='h-px w-full' />
			<div className='grid gap-15 lg:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className='space-y-3'>
						<Skeleton className='h-5 w-2/3' />
						{Array.from({ length: 4 }).map((__, rowIndex) => (
							<div key={rowIndex} className='flex items-center justify-between gap-3'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-4 w-28' />
							</div>
						))}
					</div>
				))}
			</div>
			<Skeleton className='h-px w-full' />
			<div className='grid gap-15 lg:grid-cols-3'>
				<div className='space-y-3'>
					<Skeleton className='h-5 w-1/2' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-3/4' />
				</div>
			</div>
		</div>
	)
}
