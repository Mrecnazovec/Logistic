'use client'

import { Share2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { formatDateValue, formatPricePerKmValue, formatPriceValue } from '@/components/card/cardFormatters'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { AddDriver } from '@/components/ui/modals/AddDriver'
import { OrderRatingModal } from './OrderRatingModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { usePatchOrder } from '@/hooks/queries/orders/usePatchOrder'
import { useUpdateOrderStatus } from '@/hooks/queries/orders/useUpdateOrderStatus'
import { OrderDriverStatusEnum, OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef } from 'react'

const PLACEHOLDER = '—'

type DriverStatus = NonNullable<IOrderDetail['driver_status']>
const fullDateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
})

const formatFullDateValue = (value?: string | null) => {
	if (!value) return PLACEHOLDER
	try {
		return fullDateTimeFormatter.format(new Date(value))
	} catch {
		return PLACEHOLDER
	}
}

const DRIVER_STATUS_BADGE_MAP: Record<DriverStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }> = {
	en_route: { label: 'В пути', variant: 'info' },
	stopped: { label: 'Остановился', variant: 'warning' },
	problem: { label: 'Проблема', variant: 'danger' },
}

const DRIVER_STATUS_BADGE_ENTRIES = Object.entries(DRIVER_STATUS_BADGE_MAP) as Array<[DriverStatus, (typeof DRIVER_STATUS_BADGE_MAP)[DriverStatus]]>

const formatDistanceValue = (value?: string | number | null) => {
	if (value === null || value === undefined || value === '') return PLACEHOLDER
	const numeric = typeof value === 'string' ? Number(value) : value
	if (Number.isNaN(numeric)) return PLACEHOLDER
	return `${numeric.toLocaleString('ru-RU')} км`
}

const withFallback = (value?: string | number | null) => {
	if (value === null || value === undefined || value === '') return PLACEHOLDER
	return String(value)
}

export function OrderPage() {
	const { order, isLoading } = useGetOrder()
	const { patchOrder } = usePatchOrder()
	const { role } = useRoleStore()
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
	const firstLoadingDocumentDate = formatFullDateValue(order?.loading_datetime)
	const firstUnloadingDocumentDate = formatFullDateValue(order?.unloading_datetime)
	const firstOtherDocumentDate = formatFullDateValue(firstOtherDocument?.created_at)
	const shouldShowUnloadingSection = hasLoadingDocument || hasUnloadingDocument
	const shouldShowTransportDetailsSection = hasUnloadingDocument || hasOtherDocument
	const documentSectionsCount = 1 + Number(shouldShowUnloadingSection) + Number(shouldShowTransportDetailsSection)

	const docsBasePath = orderId ? `/dashboard/order/${orderId}/docs` : ''
	const renderDocumentAction = ({
		hasDocument,
		documentDate,
		href,
		buttonLabel,
		allowUpload = true,
	}: {
		hasDocument: boolean
		documentDate: string
		href: string
		buttonLabel: string
		allowUpload?: boolean
	}) => {
		if (hasDocument) {
			return <span className="font-medium text-end">{documentDate}</span>
		}

		if (!allowUpload) {
			return <span className="font-medium text-end text-muted-foreground">{PLACEHOLDER}</span>
		}

		return (
			<Button asChild variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs font-medium">
				<Link href={href}>{buttonLabel}</Link>
			</Button>
		)
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

	const handleShareClick = useCallback(async () => {
		if (typeof window === 'undefined') return

		const shareUrl = window.location.href

		const fallbackCopy = () => {
			const textarea = document.createElement('textarea')
			textarea.value = shareUrl
			textarea.style.position = 'fixed'
			textarea.style.opacity = '0'
			document.body.appendChild(textarea)
			textarea.focus()
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
		}

		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(shareUrl)
			} else {
				fallbackCopy()
			}
			toast.success('Ссылка скопирована')
		} catch (error) {
			try {
				fallbackCopy()
				toast.success('Ссылка скопирована')
			} catch {
				toast.error('Не удалось скопировать ссылку')
			}
		}
	}, [])

	const handleDriverStatusSelect = useCallback(
		(nextStatus: OrderDriverStatusEnum) => {
			if (!orderId || nextStatus === currentDriverStatus) return
			updateDriverStatus({ id: orderId, data: { driver_status: nextStatus } })
		},
		[currentDriverStatus, orderId, updateDriverStatus],
	)

	const renderOrderStatusBadge = () => {
		if (!orderStatus) {
			return <Badge variant="secondary">Статус недоступен</Badge>
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

	const loadDate = formatDateValue(order.load_date)
	const deliveryDate = formatDateValue(order.delivery_date)
	const distance = formatDistanceValue(order.route_distance_km)
	const price = formatPriceValue(order.price_total, order.currency)
	const pricePerKm = formatPricePerKmValue(order.price_per_km, order.currency)
	const driverStatusButton = canChangeDriverStatus ? (
		<div className="fixed bottom-6 right-6 z-50">
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={isLoadingUpdateStatus}>
					<button type="button" className="outline-none" aria-label="Изменить статус водителя" disabled={isLoadingUpdateStatus}>
						<Badge
							variant={driverStatusMeta?.variant ?? 'secondary'}
							className="cursor-pointer px-4 py-2 text-sm shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-ring"
						>
							{isLoadingUpdateStatus ? 'Сохраняем...' : driverStatusMeta ? `${driverStatusMeta.label}` : 'Сменить статус водителя'}
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
							{ label: 'Заказчик', value: withFallback(order.customer_name) },
							{ label: 'Логин', value: PLACEHOLDER },
							{ label: 'Контакты', value: PLACEHOLDER },
							{ label: 'На платформе с', value: PLACEHOLDER },
						],
					},
					{
						title: 'Информация о посреднике',
						rows: [
							{ label: 'Логист', value: withFallback(order.logistic_name) },
							{ label: 'Логин', value: PLACEHOLDER },
							{ label: 'Контакты', value: PLACEHOLDER },
							{ label: 'На платформе с', value: PLACEHOLDER },
						],
					},
					{
						title: 'Информация о водителе',
						rows: [
							{ label: 'Водитель', value: hasDriver ? withFallback(order.carrier_name) : PLACEHOLDER },
							{ label: 'Логин', value: PLACEHOLDER },
							{ label: 'Контакты', value: PLACEHOLDER },
							{ label: 'Транспорт', value: PLACEHOLDER },
							{ label: 'На платформе с', value: PLACEHOLDER },
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
						<span className="text-grayscale">Город</span>
						<span className="font-medium text-end">{withFallback(order.origin_city)}</span>
					</p>
					<p className="flex justify-between gap-3">
						<span className="text-grayscale">Адрес</span>
						<span className="font-medium text-end">{PLACEHOLDER}</span>
					</p>
					<p className="flex justify-between gap-3">
						<span className="text-grayscale">Дата</span>
						<span className="font-medium text-end">{loadDate}</span>
					</p>
					<p className="flex justify-between gap-3">
						<span className="text-success-500">Отправлен</span>
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
							<span className="text-grayscale">Город</span>
							<span className="font-medium text-end">{withFallback(order.destination_city)}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Адрес</span>
							<span className="font-medium text-end">{PLACEHOLDER}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Дата</span>
							<span className="font-medium text-end">{deliveryDate}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-success-500">Прибыл</span>
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
						<p className="font-medium text-brand">Детали перевозки</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Расстояние</span>
							<span className="font-medium text-end">{distance}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-grayscale">Стоимость</span>
							<span className="font-medium text-end">{price}</span>
						</p>
						<p className="flex justify-between gap-3">
							<span className="text-success-500">Подтверждение</span>
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
						<span className="text-grayscale">Итого</span>
						<span className="font-medium">{price}</span>
					</p>
					<p className="flex justify-between gap-3 text-success-500">
						<span className="text-grayscale">Цена за километр</span>
						<span className="font-medium">{pricePerKm}</span>
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-end gap-3">
				{isCompleted ? null : hasDriver ? (
					<Button className="bg-black/90 hover:bg-black">Скрыть контакты заказчика</Button>
				) : (
					<AddDriver />
				)}
				{canRateParticipants && order && (
					<OrderRatingModal order={order} currentRole={role ?? null} disabled={isLoading} />
				)}
				<Button onClick={handleShareClick} className="bg-warning-500/90 hover:bg-warning-500">
					<Share2 className="size-4" aria-hidden="true" />
					Поделиться
				</Button>
				{!isCompleted && (
					<Button className="bg-error-500/90 hover:bg-error-500">Отменить перевозку</Button>
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
