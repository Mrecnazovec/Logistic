"use client"

import { getOrderStatusLabel } from '@/app/dashboard/history/orderStatusConfig'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { DEFAULT_PLACEHOLDER, formatPriceValue } from '@/lib/formatters'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'

export function PaymentPage() {
	const { order, isLoading } = useGetOrder()

	if (isLoading) return <PaymentPageSkeleton />

	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-3xl bg-background p-8 text-center text-muted-foreground'>
				Данные заказа недоступны
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
					<p className='text-sm text-muted-foreground'>Оплата заказа после доставки груза</p>
				</div>
				<Badge variant={isPaymentAvailable ? 'success' : 'secondary'} className='text-sm'>
					{getOrderStatusLabel(orderStatus)}
				</Badge>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<div className='rounded-2xl border border-border bg-muted/40 p-4'>
					<p className='text-sm text-muted-foreground'>Сумма</p>
					<p className='text-xl font-semibold text-foreground'>
						{formatPriceValue(order.price_total ?? DEFAULT_PLACEHOLDER, order.currency)}
					</p>
				</div>
				<div className='rounded-2xl border border-border bg-muted/40 p-4'>
					<p className='text-sm text-muted-foreground'>Статус доставки</p>
					<p className='text-xl font-semibold text-foreground'>{getOrderStatusLabel(orderStatus)}</p>
				</div>
			</div>

			<div className='rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-foreground'>
				{paymentMessage}
			</div>

			{!isPaymentAvailable && (
				<p className='text-sm text-muted-foreground'>
					Проверяйте статус заказа во вкладке «Статусы» после добавления документов.
				</p>
			)}
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
			<Skeleton className='h-4 w-64' />
		</div>
	)
}
