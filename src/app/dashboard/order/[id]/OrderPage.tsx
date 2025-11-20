'use client'

import toast from "react-hot-toast"
import { Share2 } from "lucide-react"

import { formatDateValue, formatPricePerKmValue, formatPriceValue } from "@/components/card/cardFormatters"
import { UuidCopy } from "@/components/ui/actions/UuidCopy"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { AddDriver } from "@/components/ui/modals/AddDriver"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { useGetOrder } from "@/hooks/queries/orders/useGet/useGetOrder"
import { useUpdateOrderStatus } from "@/hooks/queries/orders/useUpdateOrderStatus"
import type { IOrderDetail } from "@/shared/types/Order.interface"
import { RoleEnum } from "@/shared/enums/Role.enum"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useRoleStore } from "@/store/useRoleStore"
import { OrderStatusEnum } from "@/shared/enums/OrderStatus.enum"

const PLACEHOLDER = '—'

const STATUS_BADGE_MAP: Record<IOrderDetail['status'], { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
	delivered: { label: 'Завершен', variant: 'success' },
	en_route: { label: 'В пути', variant: 'info' },
	no_driver: { label: 'Без водителя', variant: 'danger' },
	pending: { label: 'В ожидании', variant: 'warning' },
}

const STATUS_BADGE_ENTRIES = Object.entries(STATUS_BADGE_MAP) as Array<
	[IOrderDetail['status'], (typeof STATUS_BADGE_MAP)[IOrderDetail['status']]]
>

const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const formatFullDateValue = (value?: string | null) => {
	if (!value) return PLACEHOLDER
	try {
		return fullDateFormatter.format(new Date(value))
	} catch {
		return PLACEHOLDER
	}
}

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
	const { role } = useRoleStore()
	const { updateOrderStatus, isLoadingUpdateStatus } = useUpdateOrderStatus()
	const searchParams = useSearchParams()
	const statusFromQuery = searchParams.get('status') as IOrderDetail['status'] | null
	const currentStatus = order?.status ?? statusFromQuery ?? null
	const statusMeta = currentStatus ? STATUS_BADGE_MAP[currentStatus] : null
	const hasDriver = Boolean(order?.carrier_name)
	const isCompleted = currentStatus === 'delivered'
	const orderId = String(order?.id)
	const availableStatuses = currentStatus
		? STATUS_BADGE_ENTRIES.filter(([status]) => status !== currentStatus)
		: []
	const isCarrier = role === RoleEnum.CARRIER
	const canChangeStatus = Boolean(order && isCarrier && availableStatuses.length)

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

	const handleStatusSelect = useCallback(
		(nextStatus: OrderStatusEnum) => {
			if (!orderId || nextStatus === currentStatus) return
			updateOrderStatus({ id: orderId, data: { status: nextStatus } })
		},
		[currentStatus, orderId, updateOrderStatus],
	)

	const statusBadgeNode = statusMeta ? (
		canChangeStatus ? (
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={isLoadingUpdateStatus}>
					<Badge asChild variant={statusMeta.variant} className="cursor-pointer select-none">
						<button type="button" className="outline-none" aria-label="Изменить статус заказа">
							{statusMeta.label}
						</button>
					</Badge>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="min-w-52">
					{availableStatuses.map(([status, meta]) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleStatusSelect(status)}
							disabled={isLoadingUpdateStatus || status === currentStatus}
						>
							{meta.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		) : (
			<Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
		)
	) : (
		<Badge variant={'secondary'}>Status unavailable</Badge>
	)

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

	return (
		<div className="w-full h-full rounded-4xl bg-background p-8 space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				{statusBadgeNode}
				<UuidCopy id={order.id} isPlaceholder />
			</div>
			<div className="grid lg:grid-cols-3 gap-15">
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Информация о заказчике</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Заказчик</span> <span className='font-medium text-end'>{withFallback(order.customer_name)}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
				</div>
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Информация о посреднике</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Посредник</span> <span className='font-medium text-end'>{withFallback(order.logistic_name)}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
				</div>
				{hasDriver ? <div className='space-y-3'>
					<p className='font-medium text-brand'>Информация о водителе</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Водитель</span> <span className='font-medium text-end'>{withFallback(order.carrier_name)}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Транспорт</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span
						className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
				</div> : <div className='space-y-3'>
					<p className='font-medium text-brand'>Информация о водителе</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Водитель</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Транспорт</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span
						className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
				</div>}
			</div>
			<div className="w-full h-[1px] bg-grayscale"></div>
			<div className="grid lg:grid-cols-3 gap-15">
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Погрузка</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Город</span> <span className='font-medium text-end'>{withFallback(order.origin_city)}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Улица</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Дата</span> <span className='font-medium text-end'>{loadDate}</span></p>
					<p className='flex justify-between gap-3'><span className='text-success-500'>Загрузился</span> <span className='font-medium text-end'>{loadDate}</span></p>
				</div>
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Разгрузка</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Город</span> <span className='font-medium text-end'>{withFallback(order.destination_city)}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Улица</span> <span className='font-medium text-end'>{PLACEHOLDER}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Дата</span> <span className='font-medium text-end'>{deliveryDate}</span></p>
					<p className='flex justify-between gap-3'><span className='text-success-500'>Разгрузился</span> <span className='font-medium text-end'>{deliveryDate}</span></p>

				</div>
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Детали поездки</p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Общий путь</span> <span className='font-medium text-end'>{distance}</span></p>
					<p className='flex justify-between gap-3'><span className='text-grayscale'>Цена поездки</span> <span className='font-medium text-end'>{price}</span></p>
					{statusMeta && <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>}
				</div>
			</div>
			<div className="w-full h-[1px] bg-grayscale"></div>
			<div className="grid lg:grid-cols-3 gap-15">
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Финансы</p>
					<p className='flex justify-between gap-3 text-error-500'><span className='text-grayscale'>Стоимость</span> <span className='font-medium'>{price}</span></p>
					<p className='flex justify-between gap-3 text-success-500'><span className='text-grayscale'>Цена за километр</span> <span className='font-medium'>{pricePerKm}</span></p>
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-end gap-3">
				{isCompleted ? null : hasDriver ? <Button className="bg-black/90 hover:bg-black">Скрыть контакт Заказчика</Button> : <AddDriver />}
				<Button onClick={handleShareClick} className="bg-warning-500/90 hover:bg-warning-500">
					<Share2 className="size-4" aria-hidden="true" />
					Поделиться
				</Button>
				{!isCompleted && <Button className="bg-error-500/90 hover:bg-error-500">Отмена перевозки</Button>}
			</div>
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
			<Skeleton className="w-full h-px" />
			<div className="grid lg:grid-cols-3 gap-15">
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
			<Skeleton className="w-full h-px" />
			<div className="grid lg:grid-cols-3 gap-15">
				<div className='space-y-3'>
					<Skeleton className='h-5 w-1/2' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-3/4' />
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
