"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'

import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { usePatchOrder } from '@/hooks/queries/orders/usePatchOrder'
import { useUpdateOrderStatus } from '@/hooks/queries/orders/useUpdateOrderStatus'
import { useI18n } from '@/i18n/I18nProvider'
import { addLocaleToPath } from '@/i18n/paths'
import {
	DEFAULT_PLACEHOLDER,
	formatDateTimeValue,
	formatDateValue,
	formatDistanceKm,
	formatPricePerKmValue,
	formatPriceValue,
} from '@/lib/formatters'
import { OrderDriverStatusEnum, OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { DriverStatus } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import dynamic from 'next/dynamic'

const InviteDriverModal = dynamic(() =>
	import('@/components/ui/modals/InviteDriverModal').then((mod) => mod.InviteDriverModal),
)
const OrderRatingModal = dynamic(() =>
	import('@/components/ui/modals/OrderRatingModal').then((mod) => mod.OrderRatingModal),
)

const withFallback = (value?: string | number | null, id?: number | null) => {
	if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
	if (id) return <ProfileLink name={String(value)} id={id} />
	return String(value)
}

const getFirstDocumentByCategory = <T extends { category?: string | null; created_at?: string | null }>(
	documents: T[],
	category: string,
) => {
	const matches = documents.filter((document) => (document.category ?? '').toLowerCase() === category.toLowerCase())
	if (!matches.length) return null
	return (
		matches.sort(
			(a, b) => new Date(a.created_at ?? '').getTime() - new Date(b.created_at ?? '').getTime()
		)[0] ?? null
	)
}

const getDocumentAction = (status: OrderStatusEnum | null, actions: Record<string, { hasDocument: boolean; documentDate: string; href: string }>) => {
	if (!status) return actions.loading
	if (status === OrderStatusEnum.IN_PROCESS) return actions.unloading
	if (status === OrderStatusEnum.DELIVERED || status === OrderStatusEnum.PAID) return actions.other
	return actions.loading
}

export function OrderPage() {
	const { t, locale } = useI18n()
	const { order, isLoading } = useGetOrder()
	const { patchOrder } = usePatchOrder()
	const { role } = useRoleStore()
	const { me } = useGetMe()
	const { updateOrderStatus, isLoadingUpdateStatus } = useUpdateOrderStatus()
	const searchParams = useSearchParams()

	const driverStatusBadgeMap = useMemo<Record<DriverStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }>>(
		() => ({
			en_route: { label: t('order.driverStatus.enRoute'), variant: 'info' },
			stopped: { label: t('order.driverStatus.stopped'), variant: 'warning' },
			problem: { label: t('order.driverStatus.problem'), variant: 'danger' },
		}),
		[t],
	)

	const driverStatusEntries = useMemo(
		() => Object.entries(driverStatusBadgeMap) as Array<[DriverStatus, (typeof driverStatusBadgeMap)[DriverStatus]]>,
		[driverStatusBadgeMap],
	)

	const statusFromQuery = searchParams.get('driver_status') as DriverStatus | null
	const currentDriverStatus = order?.driver_status ?? statusFromQuery ?? null
	const driverStatusMeta = currentDriverStatus ? driverStatusBadgeMap[currentDriverStatus] : null
	const hasDriver = Boolean(order?.carrier_name)
	const canRateParticipants = order?.status === OrderStatusEnum.PAID || order?.status === OrderStatusEnum.DELIVERED
	const isCarrier = role === RoleEnum.CARRIER
	const orderId = order ? String(order.id) : ''
	const canChangeDriverStatus = Boolean(order && isCarrier)
	const orderStatus = order?.status ?? null
	const orderLogisticId = order?.roles?.logistic?.id ?? null
	const isOrderLogistic = Boolean(orderLogisticId && me?.id === orderLogisticId)
	const canInviteDriver = Boolean(order && orderStatus === OrderStatusEnum.NODRIVER && isOrderLogistic)

	const documents = order?.documents ?? []
	const firstOtherDocument = getFirstDocumentByCategory(documents, 'other')

	const hasLoadingDocument = Boolean(order?.loading_datetime)
	const hasUnloadingDocument = Boolean(order?.unloading_datetime)
	const hasOtherDocument = Boolean(firstOtherDocument)
	const firstLoadingDocumentDate = formatDateTimeValue(order?.loading_datetime, DEFAULT_PLACEHOLDER)
	const firstUnloadingDocumentDate = formatDateTimeValue(order?.unloading_datetime, DEFAULT_PLACEHOLDER)
	const firstOtherDocumentDate = formatDateTimeValue(firstOtherDocument?.created_at, DEFAULT_PLACEHOLDER)
	const docsBasePath = orderId ? `/dashboard/order/${orderId}/docs` : ''
	const currentDocumentAction = getDocumentAction(orderStatus, {
		loading: { hasDocument: hasLoadingDocument, documentDate: firstLoadingDocumentDate, href: `${docsBasePath}/loading` },
		unloading: { hasDocument: hasUnloadingDocument, documentDate: firstUnloadingDocumentDate, href: `${docsBasePath}/unloading` },
		other: { hasDocument: hasOtherDocument, documentDate: firstOtherDocumentDate, href: `${docsBasePath}/other` },
	})

	const handleShare = async () => {
		const sharePath = order?.share_token ? addLocaleToPath(`/dashboard/order/shared/${order.share_token}`, locale) : ''
		const link = typeof window !== 'undefined'
			? sharePath
				? `${window.location.origin}${sharePath}`
				: window.location.href
			: ''

		try {
			if (!link || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
				throw new Error('Clipboard is not available')
			}
			await navigator.clipboard.writeText(link)
			toast.success(t('order.actions.shareSuccess'))
		} catch {
			toast.error(t('order.actions.shareError'))
		}
	}

	const renderDocumentAction = (
		hasDocument: boolean,
		documentDate: string,
		href: string,
		buttonLabel: string,
		allowUpload: boolean,
		isButton?: boolean,
	) => {
		if (hasDocument && !isButton) return <span className='font-medium text-end'>{documentDate}</span>
		if (!allowUpload) return <span className='font-medium text-end text-muted-foreground'>{DEFAULT_PLACEHOLDER}</span>
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

	const loadingStatusPatchedRef = useRef(false)
	const unloadingStatusPatchedRef = useRef(false)
	const paidStatusPatchedRef = useRef(false)

	useEffect(() => {
		loadingStatusPatchedRef.current = false
		unloadingStatusPatchedRef.current = false
		paidStatusPatchedRef.current = false
	}, [orderId])

	useEffect(() => {
		if (!orderId || !hasLoadingDocument) return
		if (order?.status !== OrderStatusEnum.PENDING) return
		if (loadingStatusPatchedRef.current) return
		loadingStatusPatchedRef.current = true
		patchOrder({ id: orderId, data: { status: OrderStatusEnum.IN_PROCESS } })
	}, [hasLoadingDocument, order?.status, orderId, patchOrder])

	useEffect(() => {
		if (!orderId || !hasUnloadingDocument) return
		if (order?.status !== OrderStatusEnum.IN_PROCESS) return
		if (unloadingStatusPatchedRef.current) return
		unloadingStatusPatchedRef.current = true
		patchOrder({ id: orderId, data: { status: OrderStatusEnum.DELIVERED } })
	}, [hasUnloadingDocument, order?.status, orderId, patchOrder])

	useEffect(() => {
		if (!orderId || !hasOtherDocument) return
		if (order?.status !== OrderStatusEnum.DELIVERED) return
		if (paidStatusPatchedRef.current) return
		paidStatusPatchedRef.current = true
		patchOrder({ id: orderId, data: { status: OrderStatusEnum.PAID } })
	}, [hasOtherDocument, order?.status, orderId, patchOrder])

	const handleDriverStatusSelect = (nextStatus: OrderDriverStatusEnum) => {
		if (!orderId || nextStatus === currentDriverStatus) return
		updateOrderStatus({ id: orderId, data: { driver_status: nextStatus } })
	}

	const orderStatusBadge = orderStatus ? (
		<Badge variant={getOrderStatusVariant(orderStatus)}>{getOrderStatusLabel(orderStatus, t)}</Badge>
	) : (
		<Badge variant='secondary'>{t('order.status.notSet')}</Badge>
	)

	if (isLoading) return <OrderPageSkeleton />
	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.unavailable')}
			</div>
		)
	}

	const driverStatusButton = canChangeDriverStatus ? (
		<div className='fixed md:bottom-6 bottom-20 right-6 z-50'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={isLoadingUpdateStatus}>
					<button type='button' className='outline-none' aria-label={t('order.driverStatus.changeLabel')} disabled={isLoadingUpdateStatus}>
						<Badge
							variant={driverStatusMeta?.variant ?? 'secondary'}
							className='cursor-pointer px-4 py-2 text-sm shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-ring'
						>
							{isLoadingUpdateStatus
								? t('order.driverStatus.updating')
								: driverStatusMeta
									? driverStatusMeta.label
									: t('order.driverStatus.select')}
						</Badge>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					{driverStatusEntries.map(([status, meta]) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleDriverStatusSelect(status)}
							disabled={isLoadingUpdateStatus || status === currentDriverStatus}
							className='focus:bg-transparent focus:text-foreground'
						>
							<Badge variant={meta.variant} className='w-full justify-center text-sm'>
								{meta.label}
							</Badge>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	) : null

	return (
		<div className='space-y-6 rounded-4xl bg-background p-8'>
			<div className='flex flex-wrap items-center gap-3'>
				{orderStatusBadge}
				<UuidCopy id={order.id} isPlaceholder />
			</div>

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
							{ label: t('order.field.logistic'), value: withFallback(order.roles.logistic?.name, order.roles.logistic?.id) },
							{ label: t('order.field.company'), value: withFallback(order.roles.logistic?.company) },
							{ label: t('order.field.contacts'), value: withFallback(order.roles.logistic?.phone) },
						],
					},
					{
						title: t('order.section.carrierInfo'),
						rows: [
							{
								label: t('order.field.carrier'),
								value: hasDriver ? withFallback(order.roles.carrier?.name, order.roles.carrier?.id) : DEFAULT_PLACEHOLDER,
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
						{renderDocumentAction(
							hasLoadingDocument,
							firstLoadingDocumentDate,
							`${docsBasePath}/loading`,
							t('order.actions.uploadDocument'),
							isCarrier,
						)}
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
						{renderDocumentAction(
							hasUnloadingDocument,
							firstUnloadingDocumentDate,
							`${docsBasePath}/unloading`,
							t('order.actions.uploadDocument'),
							isCarrier,
						)}
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
						{order.status !== 'no_driver' && driverStatusMeta ? (
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

			<div className='flex flex-wrap items-center justify-end gap-3'>
				<Button type='button' variant='outline' onClick={handleShare}>
					{t('order.actions.share')}
				</Button>
				{role === RoleEnum.CARRIER &&
					renderDocumentAction(
						currentDocumentAction.hasDocument,
						currentDocumentAction.documentDate,
						currentDocumentAction.href,
						t('order.actions.uploadFile'),
						true,
						true,
					)}
				{canInviteDriver && order && <InviteDriverModal order={order} canInviteById={canInviteDriver} />}
				{canRateParticipants && order && <OrderRatingModal order={order} currentRole={role ?? null} disabled={isLoading} />}
			</div>

			{driverStatusButton}
		</div>
	)
}

function OrderPageSkeleton() {
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
						{Array.from({ length: 3 }).map((__, rowIndex) => (
							<div key={rowIndex} className='flex items-center justify-between gap-3'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-4 w-28' />
							</div>
						))}
						<Skeleton className='h-7 w-28 rounded-full' />
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
			<div className='flex flex-wrap items-center justify-end gap-3'>
				<Skeleton className='h-10 w-56 rounded-full' />
				<Skeleton className='h-10 w-44 rounded-full' />
				<Skeleton className='h-10 w-48 rounded-full' />
			</div>
		</div>
	)
}
