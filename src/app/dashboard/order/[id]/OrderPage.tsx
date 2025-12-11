'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { InviteDriverModal } from '@/components/ui/modals/InviteDriverModal'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { usePatchOrder } from '@/hooks/queries/orders/usePatchOrder'
import { useUpdateOrderStatus } from '@/hooks/queries/orders/useUpdateOrderStatus'
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
import { OrderRatingModal } from './OrderRatingModal'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'

const DRIVER_STATUS_BADGE_MAP: Record<DriverStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }> = {
	en_route: { label: 'В пути', variant: 'info' },
	stopped: { label: 'Остановился', variant: 'warning' },
	problem: { label: 'Проблема', variant: 'danger' },
}

const DRIVER_STATUS_BADGE_ENTRIES = Object.entries(DRIVER_STATUS_BADGE_MAP) as Array<[DriverStatus, (typeof DRIVER_STATUS_BADGE_MAP)[DriverStatus]]>

const withFallback = (value?: string | number | null, id?: number | null) => {
	if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
	if (id) return <ProfileLink name={String(value)} id={id} />
	return String(value)
}

export function OrderPage() {
	const { order, isLoading } = useGetOrder()
	const { patchOrder } = usePatchOrder()
	const { role } = useRoleStore()
	const { me } = useGetMe()
	const { updateDriverStatus, isLoadingUpdateStatus } = useUpdateOrderStatus()
	const searchParams = useSearchParams()
	const statusFromQuery = searchParams.get('driver_status') as DriverStatus | null
	const currentDriverStatus = order?.driver_status ?? statusFromQuery ?? null
	const driverStatusMeta = currentDriverStatus ? DRIVER_STATUS_BADGE_MAP[currentDriverStatus] : null
	const hasDriver = Boolean(order?.carrier_name)
	const isCompleted = order?.status === OrderStatusEnum.DELIVERED || order?.status === OrderStatusEnum.PAID
	const canRateParticipants = order?.status === OrderStatusEnum.PAID
	const isCarrier = role === RoleEnum.CARRIER
	const orderId = order ? String(order.id) : ''
	const canChangeDriverStatus = Boolean(order && isCarrier)
	const orderStatus = order?.status ?? null
	const orderLogisticId = order?.roles?.logistic?.id ?? null
	const isOrderLogistic = Boolean(orderLogisticId && me?.id === orderLogisticId)
	const canInviteDriver = orderStatus === OrderStatusEnum.NODRIVER && isOrderLogistic
	const canCarrierAcceptInvite = orderStatus === OrderStatusEnum.NODRIVER && isCarrier
	const shouldShowInviteDriver = Boolean(order && orderStatus === OrderStatusEnum.NODRIVER && (isOrderLogistic || isCarrier))
	const firstOtherDocument = useMemo(() => {
		const docs = order?.documents ?? []
		const filtered = docs.filter((document) => document.category === 'other')
		if (!filtered.length) return null

		return filtered.reduce((earliest, current) => {
			const earliestTime = new Date(earliest.created_at ?? '').getTime() || Number.POSITIVE_INFINITY
			const currentTime = new Date(current.created_at ?? '').getTime() || Number.POSITIVE_INFINITY
			return currentTime < earliestTime ? current : earliest
		})
	}, [order?.documents])
	const hasLoadingDocument = Boolean(order?.loading_datetime)
	const hasUnloadingDocument = Boolean(order?.unloading_datetime)
	const hasOtherDocument = Boolean(firstOtherDocument)
	const firstLoadingDocumentDate = formatDateTimeValue(order?.loading_datetime, DEFAULT_PLACEHOLDER)
	const firstUnloadingDocumentDate = formatDateTimeValue(order?.unloading_datetime, DEFAULT_PLACEHOLDER)
	const firstOtherDocumentDate = formatDateTimeValue(firstOtherDocument?.created_at, DEFAULT_PLACEHOLDER)
	const shouldShowUnloadingSection = hasLoadingDocument || hasUnloadingDocument
	const shouldShowTransportDetailsSection = hasUnloadingDocument || hasOtherDocument

	const docsBasePath = orderId ? `/dashboard/order/${orderId}/docs` : ''
	const currentDocumentAction = (() => {
		if (orderStatus === OrderStatusEnum.IN_PROCESS) {
			return {
				hasDocument: hasUnloadingDocument,
				documentDate: firstUnloadingDocumentDate,
				href: `${docsBasePath}/unloading`,
			}
		}

		if (orderStatus === OrderStatusEnum.DELIVERED || orderStatus === OrderStatusEnum.PAID) {
			return {
				hasDocument: hasOtherDocument,
				documentDate: firstOtherDocumentDate,
				href: `${docsBasePath}/other`,
			}
		}

		return {
			hasDocument: hasLoadingDocument,
			documentDate: firstLoadingDocumentDate,
			href: `${docsBasePath}/loading`,
		}
	})()
	const renderDocumentAction = ({
		hasDocument,
		documentDate,
		href,
		buttonLabel,
		allowUpload = true,
		isButton = false,
	}: {
		hasDocument: boolean
		documentDate: string
		href: string
		buttonLabel: string
		allowUpload?: boolean
		isButton?: boolean
	}) => {
		if (hasDocument && !isButton) {
			return <span className="font-medium text-end">{documentDate}</span>
		}

		if (!allowUpload) {
			return <span className="font-medium text-end text-muted-foreground">{DEFAULT_PLACEHOLDER}</span>
		}

		if (hasDocument && isButton) {
			return
		}

		if (isButton) {
			return (
				<Button asChild variant="outline">
					<Link href={href}>{buttonLabel}</Link>
				</Button>
			)
		}


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

	const handleDriverStatusSelect = useCallback(
		(nextStatus: OrderDriverStatusEnum) => {
			if (!orderId || nextStatus === currentDriverStatus) return
			updateDriverStatus({ id: orderId, data: { driver_status: nextStatus } })
		},
		[currentDriverStatus, orderId, updateDriverStatus],
	)

	const renderOrderStatusBadge = () => {
		if (!orderStatus) {
			return <Badge variant="secondary">Статус не задан</Badge>
		}

		return <Badge variant={getOrderStatusVariant(orderStatus)}>{getOrderStatusLabel(orderStatus)}</Badge>
	}

	if (isLoading) {
		return <OrderPageSkeleton />
	}

	if (!order) {
		return (
			<div className="w-full h-full rounded-4xl bg-background p-8 flex items-center justify-center text-muted-foreground text-center">
				Данные заказа недоступны
			</div>
		)
	}

	const driverStatusButton = canChangeDriverStatus ? (
		<div className="fixed bottom-6 right-6 z-50">
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={isLoadingUpdateStatus}>
					<button type="button" className="outline-none" aria-label="Изменить статус водителя" disabled={isLoadingUpdateStatus}>
						<Badge
							variant={driverStatusMeta?.variant ?? 'secondary'}
							className="cursor-pointer px-4 py-2 text-sm shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-ring"
						>
							{isLoadingUpdateStatus ? 'Обновление...' : driverStatusMeta ? `${driverStatusMeta.label}` : 'Выберите статус водителя'}
						</Badge>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-52">
					{DRIVER_STATUS_BADGE_ENTRIES.map(([status, meta]) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleDriverStatusSelect(status)}
							disabled={isLoadingUpdateStatus || status === currentDriverStatus}
							className="focus:bg-transparent focus:text-foreground"
						>
							<Badge variant={meta.variant} className="w-full justify-center text-sm">
								{meta.label}
							</Badge>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	) : null

	return (
		<div className="w-full h-full rounded-4xl bg-background p-8 space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				{renderOrderStatusBadge()}
				<UuidCopy id={order.id} isPlaceholder />
			</div>

			<div className="grid lg:grid-cols-3 gap-15">
				{[
					{
						title: 'Информация о заказчике',
						rows: [
							{ label: 'Заказчик', value: withFallback(order.roles.customer.name, order.roles.customer.id) },
							{ label: 'Компания', value: withFallback(order.roles.customer.company) },
							{ label: 'Контакты', value: withFallback(order.roles.customer.phone) },
						],
					},
					{
						title: 'Информация о логисте',
						rows: [
							{ label: 'Логист', value: withFallback(order.roles.logistic?.name, order.roles.logistic?.id) },
							{ label: 'Компания', value: withFallback(order.roles.logistic?.company) },
							{ label: 'Контакты', value: withFallback(order.roles.logistic?.phone) },
						],
					},
					{
						title: 'Информация о перевозчике',
						rows: [
							{ label: 'Перевозчик', value: hasDriver ? withFallback(order.roles.carrier?.name, order.roles.carrier?.id) : DEFAULT_PLACEHOLDER },
							{ label: 'Компания', value: withFallback(order.roles.carrier?.company) },
							{ label: 'Контакты', value: withFallback(order.roles.carrier?.phone) },
						],
					},
				].map((section) => (
					<div key={section.title} className="space-y-3">
						<p className="font-medium text-brand">{section.title}</p>
						{section.rows.map((row) => (
							<p key={row.label} className="flex justify-between gap-3">
								<span className="text-grayscale">{row.label}</span>
								<span className="font-medium text-end">{row.value}</span>
							</p>
						))}
					</div>
				))}
			</div>

			<div className="w-full h-px bg-grayscale" />

			<div className={`grid lg:grid-cols-3 gap-15`}>
				<div className="space-y-3">
					<p className="font-medium text-brand">Погрузка</p>
					<p className="flex justify-between gap-3">
						<span className="text-grayscale">Город отправления</span>
						<span className="font-medium text-end">{withFallback(order.origin_city)}</span>
					</p>
					<p className="flex justify-between gap-3">
						<span className="text-grayscale">Адрес</span>
						<span className="font-medium text-end">{DEFAULT_PLACEHOLDER}</span>
					</p>
					<p className="flex justify-between gap-3">
						<span className="text-grayscale">Дата погрузки</span>
						<span className="font-medium text-end">
							{formatDateValue(order.load_date, DEFAULT_PLACEHOLDER)}
						</span>
					</p>
					<p className="flex justify-between gap-3">
						<span className="text-success-500">Документ</span>
						{renderDocumentAction({
							hasDocument: hasLoadingDocument,
							documentDate: firstLoadingDocumentDate,
							href: `${docsBasePath}/loading`,
							buttonLabel: 'Загрузить документ',
							allowUpload: isCarrier,
						})}
					</p>
				</div>

				{shouldShowUnloadingSection && (
					<div className="space-y-3">
						<p className="font-medium text-brand">Разгрузка</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Город назначения</span>
							<span className="font-medium text-end">{withFallback(order.destination_city)}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Адрес</span>
							<span className="font-medium text-end">{DEFAULT_PLACEHOLDER}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Дата разгрузки</span>
							<span className="font-medium text-end">
								{formatDateValue(order.delivery_date, DEFAULT_PLACEHOLDER)}
							</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-success-500">Документ</span>
							{renderDocumentAction({
								hasDocument: hasUnloadingDocument,
								documentDate: firstUnloadingDocumentDate,
								href: `${docsBasePath}/unloading`,
								buttonLabel: 'Загрузить документ',
								allowUpload: isCarrier,
							})}
						</p>
					</div>
				)}

				{shouldShowTransportDetailsSection && (
					<div className="space-y-3">
						<p className="font-medium text-brand">Параметры перевозки</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Расстояние</span>
							<span className="font-medium text-end">
								{formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)}
							</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Стоимость</span>
							<span className="font-medium text-end">
								{formatPriceValue(order.price_total, order.currency)}
							</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-success-500">Прочие документы</span>
							{renderDocumentAction({
								hasDocument: hasOtherDocument,
								documentDate: firstOtherDocumentDate,
								href: `${docsBasePath}/other`,
								buttonLabel: 'Загрузить файл',
							})}
						</p>
						{renderOrderStatusBadge()}
					</div>
				)}
			</div>

			<div className="w-full h-px bg-grayscale" />

			<div className="grid lg:grid-cols-3 gap-15">
				<div className="space-y-3">
					<p className="font-medium text-brand">Финансы</p>
					<p className="flex justify-between gap-3 text-error-500">
						<span className="text-grayscale">Стоимость</span>
						<span className="font-medium">
							{formatPriceValue(order.price_total, order.currency)}
						</span>
					</p>
					<p className="flex justify-between gap-3 text-success-500">
						<span className="text-grayscale">Цена за километр</span>
						<span className="font-medium">
							{formatPricePerKmValue(order.price_per_km, order.currency)}
						</span>
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-end gap-3">
				{role === RoleEnum.CARRIER &&
					renderDocumentAction({
						...currentDocumentAction,
						isButton: true,
						buttonLabel: 'Загрузить файл',
					})}
				{!isCompleted && shouldShowInviteDriver && order && (
					<InviteDriverModal
						order={order}
						canInviteById={canInviteDriver}
						canAcceptInvite={canCarrierAcceptInvite}
					/>
				)}
				{canRateParticipants && order && (
					<OrderRatingModal order={order} currentRole={role ?? null} disabled={isLoading} />
				)}
			</div>

			{driverStatusButton}
		</div>
	)
}

function OrderPageSkeleton() {
	return (
		<div className="w-full h-full rounded-4xl bg-background p-8 space-y-6">
			<div className="flex items-center gap-3">
				<Skeleton className="h-7 w-28 rounded-full" />
				<Skeleton className="h-6 w-32 rounded-full" />
			</div>
			<div className="grid lg:grid-cols-3 gap-15">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className="space-y-3">
						<Skeleton className="h-5 w-2/3" />
						{Array.from({ length: 4 }).map((__, rowIndex) => (
							<div key={rowIndex} className="flex items-center justify-between gap-3">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-32" />
							</div>
						))}
					</div>
				))}
			</div>
			<Skeleton className="w-full h-px" />
			<div className="grid lg:grid-cols-3 gap-15">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className="space-y-3">
						<Skeleton className="h-5 w-2/3" />
						{Array.from({ length: 3 }).map((__, rowIndex) => (
							<div key={rowIndex} className="flex items-center justify-between gap-3">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-4 w-28" />
							</div>
						))}
						<Skeleton className="h-7 w-28 rounded-full" />
					</div>
				))}
			</div>
			<Skeleton className="w-full h-px" />
			<div className="grid lg:grid-cols-3 gap-15">
				<div className="space-y-3">
					<Skeleton className="h-5 w-1/2" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-end gap-3">
				<Skeleton className="h-10 w-56 rounded-full" />
				<Skeleton className="h-10 w-44 rounded-full" />
				<Skeleton className="h-10 w-48 rounded-full" />
			</div>
		</div>
	)
}
