"use client"

import { getOrderStatusLabel } from '@/app/dashboard/history/orderStatusConfig'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { useGetPayment } from '@/hooks/queries/payments/useGetPayment'
import { DEFAULT_PLACEHOLDER, formatPriceValue } from '@/lib/formatters'
import type { PriceCurrencyCode } from '@/lib/currency'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import type { PaymentMethod, PaymentStatus } from '@/shared/types/Payment.interface'

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
	PENDING: 'Ожидает подтверждения',
	CONFIRMED_BY_CUSTOMER: 'Подтверждён заказчиком',
	CONFIRMED_BY_CARRIER: 'Подтверждён перевозчиком',
	COMPLETED: 'Завершён',
}

const PAYMENT_METHOD_LABELS: Record<Exclude<PaymentMethod, undefined>, string> = {
	cash: 'Наличные',
	bank_transfer: 'Безналичный расчёт',
}

export function PaymentPage() {
	const { order, isLoading } = useGetOrder()
	const paymentId = order?.payment
	const {
		payment,
		isLoading: isLoadingPayment,
		isFetching: isFetchingPayment,
	} = useGetPayment(paymentId, Boolean(paymentId))

	if (isLoading) return <PaymentPageSkeleton />

	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-3xl bg-background p-8 text-center text-muted-foreground'>
				Данные заказа не найдены
			</div>
		)
	}

	const orderStatus = order.status
	const isPaymentAvailable = orderStatus === OrderStatusEnum.DELIVERED || orderStatus === OrderStatusEnum.PAID
	const paymentMessage = isPaymentAvailable
		? 'Данные о доставке подтверждены. Вы можете продолжить оплату.'
		: 'Оплата станет доступна после подтверждения доставки.'

	return (
		<div className='space-y-6 rounded-3xl bg-background p-8'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div>
					<p className='text-2xl font-bold text-foreground'>Оплата</p>
					<p className='text-sm text-muted-foreground'>Статус доставки и сумма к оплате по заказу</p>
				</div>
				<Badge variant={isPaymentAvailable ? 'success' : 'secondary'} className='text-sm'>
					{getOrderStatusLabel(orderStatus)}
				</Badge>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<div className='rounded-2xl border border-border bg-muted/40 p-4'>
					<p className='text-sm text-muted-foreground'>Сумма заказа</p>
					<p className='text-xl font-semibold text-foreground'>
						{formatPriceValue(order.price_total ?? DEFAULT_PLACEHOLDER, order.currency)}
					</p>
				</div>
				<div className='rounded-2xl border border-border bg-muted/40 p-4'>
					<p className='text-sm text-muted-foreground'>Текущий статус доставки</p>
					<p className='text-xl font-semibold text-foreground'>{getOrderStatusLabel(orderStatus)}</p>
				</div>
			</div>

			<div className='rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-foreground'>
				{paymentMessage}
			</div>

			<div className='space-y-3 rounded-2xl border border-border bg-muted/30 p-4'>
				<p className='text-base font-semibold text-foreground'>Детали платежа</p>
				{!paymentId ? (
					<p className='text-sm text-muted-foreground'>Платёж ещё не создан.</p>
				) : isLoadingPayment || isFetchingPayment ? (
					<div className='grid gap-3 md:grid-cols-2'>
						<Skeleton className='h-12 rounded-xl' />
						<Skeleton className='h-12 rounded-xl' />
						<Skeleton className='h-12 rounded-xl' />
						<Skeleton className='h-12 rounded-xl' />
					</div>
				) : payment ? (
					<div className='grid gap-3 md:grid-cols-2'>
						<div className='rounded-xl border border-border bg-background p-3'>
							<p className='text-xs text-muted-foreground'>Сумма платежа</p>
							<p className='text-lg font-semibold text-foreground'>
								{formatPriceValue(
									payment.amount,
									(payment.currency as PriceCurrencyCode | undefined) ??
										(order.currency as PriceCurrencyCode | undefined),
								)}
							</p>
						</div>
						<div className='rounded-xl border border-border bg-background p-3'>
							<p className='text-xs text-muted-foreground'>Метод оплаты</p>
							<p className='text-lg font-semibold text-foreground'>
								{payment.method ? PAYMENT_METHOD_LABELS[payment.method] ?? payment.method : '—'}
							</p>
						</div>
						<div className='rounded-xl border border-border bg-background p-3'>
							<p className='text-xs text-muted-foreground'>Статус платежа</p>
							<p className='text-lg font-semibold text-foreground'>
								{payment.status ? PAYMENT_STATUS_LABELS[payment.status] ?? payment.status : '—'}
							</p>
						</div>
						<div className='rounded-xl border border-border bg-background p-3'>
							<p className='text-xs text-muted-foreground'>ID платежа</p>
							<p className='text-lg font-semibold text-foreground'>{payment.id}</p>
						</div>
					</div>
				) : (
					<p className='text-sm text-muted-foreground'>Не удалось загрузить данные платежа.</p>
				)}
			</div>
		</div>
	)
}

function PaymentPageSkeleton() {
	return (
		<div className='space-y-6 rounded-3xl bg-background p-8'>
			<div className='flex items-center justify-between gap-3'>
				<div className='space-y-2'>
					<Skeleton className='h-7 w-32' />
					<Skeleton className='h-4 w-52' />
				</div>
				<Skeleton className='h-8 w-24 rounded-full' />
			</div>
			<div className='grid gap-4 md:grid-cols-2'>
				<Skeleton className='h-24 rounded-2xl' />
				<Skeleton className='h-24 rounded-2xl' />
			</div>
			<Skeleton className='h-20 rounded-2xl' />
			<Skeleton className='h-32 rounded-2xl' />
		</div>
	)
}
