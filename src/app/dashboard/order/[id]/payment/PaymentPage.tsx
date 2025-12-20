"use client"

import { UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { useConfirmPaymentCarrier } from '@/hooks/queries/payments/useConfirmPaymentCarrier'
import { useConfirmPaymentCustomer } from '@/hooks/queries/payments/useConfirmPaymentCustomer'
import { useConfirmPaymentLogistic } from '@/hooks/queries/payments/useConfirmPaymentLogistic'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import Link from 'next/link'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'

export function PaymentPage() {
	const { order, isLoading } = useGetOrder()
	const { me } = useGetMe()
	const payment = order?.payment ?? null
	const paymentId = payment?.id
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [isDisputeOpen, setIsDisputeOpen] = useState(false)
	const { confirmPaymentCustomer, isLoadingConfirmPaymentCustomer } = useConfirmPaymentCustomer()
	const { confirmPaymentCarrier, isLoadingConfirmPaymentCarrier } = useConfirmPaymentCarrier()
	const { confirmPaymentLogistic, isLoadingConfirmPaymentLogistic } = useConfirmPaymentLogistic()
	const router = useRouter()

	if (isLoading) return <PaymentPageSkeleton />

	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				Заказ не найден
			</div>
		)
	}

	const isCustomer = Boolean(me?.id && order.roles?.customer?.id === me.id)
	const isCarrier = Boolean(me?.id && order.roles?.carrier?.id === me.id)
	const isLogistic = Boolean(me?.id && order.roles?.logistic?.id === me.id)
	const orderStatus = order.status
	const isPaymentAvailable = orderStatus === OrderStatusEnum.DELIVERED || orderStatus === OrderStatusEnum.PAID
	const confirmAction = !payment || !paymentId
		? null
		: isCustomer
			? {
					label: 'Подтвердить оплату (заказчик)',
					isConfirmed: Boolean(payment.confirmed_by_customer),
					isLoading: isLoadingConfirmPaymentCustomer,
					onConfirm: () => confirmPaymentCustomer({ id: paymentId, orderId: order.id, data: { order: order.id } }),
				}
			: isCarrier
				? {
						label: 'Подтвердить оплату (перевозчик)',
						isConfirmed: Boolean(payment.confirmed_by_carrier),
						isLoading: isLoadingConfirmPaymentCarrier,
						onConfirm: () => confirmPaymentCarrier({ id: paymentId, orderId: order.id, data: { order: order.id } }),
					}
				: isLogistic
					? {
							label: 'Подтвердить оплату (логист)',
							isConfirmed: Boolean(payment.confirmed_by_logistic),
							isLoading: isLoadingConfirmPaymentLogistic,
							onConfirm: () =>
								confirmPaymentLogistic({ id: paymentId, orderId: order.id, data: { order: order.id } }),
						}
					: null

	const sections = [
		{ key: 'customer', title: 'Информация о грузовладельце', role: order.roles?.customer ?? null },
		{ key: 'carrier', title: 'Информация о перевозчике', role: order.roles?.carrier ?? null },
		{ key: 'logistic', title: 'Информация о экспедиторе', role: order.roles?.logistic ?? null },
	]

	const withFallback = (value?: string | number | null) =>
		value === null || value === undefined || value === '' ? DEFAULT_PLACEHOLDER : String(value)

	return (
		<div className='space-y-8 rounded-4xl bg-background p-8'>
			<div className='flex items-center gap-3'>
				<h1>Платёж №</h1>
				<UuidCopy id={payment?.id} isPlaceholder />
			</div>
			{sections.map((section) => (
				<div key={section.key} className='space-y-4'>
					<div className='flex items-center gap-2 text-base font-semibold text-foreground'>
						<UserRound className='size-5 text-brand' aria-hidden />
						<span>{section.title}</span>
					</div>
					<div className='grid gap-8 lg:grid-cols-2'>
						<div className='space-y-4'>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Ф.И.О.</span>
								<span className='text-end font-medium text-foreground'>
									{section.role ? <ProfileLink name={section.role?.name} id={section.role?.id} /> : DEFAULT_PLACEHOLDER}
								</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Номер телефона</span>
								<span className='text-end font-medium text-foreground'>
									{withFallback(section.role?.phone)}
								</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Название компании</span>
								<span className='text-end font-medium text-foreground'>
									{withFallback(section.role?.company)}
								</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Email</span>
								<span className='text-end font-medium text-foreground'>
									{withFallback(section.role?.login)}
								</span>
							</div>
						</div>
						<div className='space-y-4'>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Страна</span>
								<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Город</span>
								<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>Выполнено заказов</span>
								<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
							</div>
						</div>
					</div>
				</div>
			))}

			{confirmAction && !confirmAction.isConfirmed ? (
				<div className='flex flex-wrap items-center justify-end gap-3 pt-2'>
					<Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
						<DialogTrigger asChild>
							<Button
								className='min-w-[140px] bg-success-500 text-white hover:bg-success-600'
								disabled={!isPaymentAvailable || confirmAction.isLoading || confirmAction.isConfirmed}
							>
								Завершить
							</Button>
						</DialogTrigger>
						<DialogContent className='w-[520px] max-w-[calc(100vw-2rem)] rounded-3xl'>
							<DialogHeader className='items-center text-center'>
								<DialogTitle className='text-xl font-semibold'>
									Вы уверены, что хотите завершить сделку?
								</DialogTitle>
								<DialogDescription className='text-sm text-muted-foreground'>
									Подтверждая, вы закрываете сделку, не имея никаких претензий к ней ни одной из сторон.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className='flex w-full flex-row justify-center gap-3 sm:justify-center'>
								<DialogClose asChild>
									<Button variant='secondary' className='min-w-[160px]'>
										Отменить
									</Button>
								</DialogClose>
								<Button
									className='min-w-[160px]'
									disabled={confirmAction.isLoading || confirmAction.isConfirmed}
									onClick={() => {
										confirmAction.onConfirm()
										setIsConfirmOpen(false)
									}}
								>
									Подтвердить
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Link href={DASHBOARD_URL.order(String(order.id))}>
						<Button
							className='min-w-[110px] bg-warning-400 text-white hover:bg-warning-500'
						>
							Позже
						</Button></Link>
					<Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
						<DialogTrigger asChild>
							<Button className='min-w-[120px] bg-error-500 text-white hover:bg-error-600'>Оспорить</Button>
						</DialogTrigger>
						<DialogContent className='w-[520px] max-w-[calc(100vw-2rem)] rounded-3xl'>
							<DialogHeader className='items-center text-center'>
								<DialogTitle className='text-xl font-semibold'>Возникли проблемы? Свяжитесь с нами!</DialogTitle>
								<DialogDescription className='text-sm text-muted-foreground'>
									Если нужна помощь, перейдите в раздел поддержки.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className='flex w-full flex-row justify-center gap-3 sm:justify-center'>
								<DialogClose asChild>
									<Button variant='secondary' className='min-w-[160px]'>
										Закрыть
									</Button>
								</DialogClose>
								<Link href={DASHBOARD_URL.settings('support')}>
									<Button
										className='min-w-[160px]'

									>
										Помощь
									</Button></Link>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			) : <p className='text-success-500'>Вы подтвердили оплату</p>}
		</div>
	)
}

function PaymentPageSkeleton() {
	return (
		<div className='space-y-8 rounded-4xl bg-background p-8'>
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className='space-y-4'>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-5 rounded-full' />
						<Skeleton className='h-4 w-48' />
					</div>
					<div className='grid gap-8 lg:grid-cols-2'>
						<div className='space-y-3'>
							{Array.from({ length: 4 }).map((__, rowIndex) => (
								<div key={rowIndex} className='flex items-center justify-between gap-6'>
									<Skeleton className='h-4 w-28' />
									<Skeleton className='h-4 w-40' />
								</div>
							))}
						</div>
						<div className='space-y-3'>
							{Array.from({ length: 3 }).map((__, rowIndex) => (
								<div key={rowIndex} className='flex items-center justify-between gap-6'>
									<Skeleton className='h-4 w-24' />
									<Skeleton className='h-4 w-32' />
								</div>
							))}
						</div>
					</div>
				</div>
			))}
			<div className='flex justify-end gap-3'>
				<Skeleton className='h-11 w-28 rounded-full' />
				<Skeleton className='h-11 w-24 rounded-full' />
				<Skeleton className='h-11 w-28 rounded-full' />
			</div>
		</div>
	)
}
