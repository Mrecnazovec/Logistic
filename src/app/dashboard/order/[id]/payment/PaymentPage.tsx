"use client"

import { UserRound } from 'lucide-react'
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
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { Skeleton } from '@/components/ui/Skeleton'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { useConfirmPaymentCarrier } from '@/hooks/queries/payments/useConfirmPaymentCarrier'
import { useConfirmPaymentCustomer } from '@/hooks/queries/payments/useConfirmPaymentCustomer'
import { useConfirmPaymentLogistic } from '@/hooks/queries/payments/useConfirmPaymentLogistic'
import { useI18n } from '@/i18n/I18nProvider'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import Link from 'next/link'

export function PaymentPage() {
	const { t } = useI18n()
	const { order, isLoading } = useGetOrder()
	const { me } = useGetMe()
	const payment = order?.payment ?? null
	const paymentId = payment?.id
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [isDisputeOpen, setIsDisputeOpen] = useState(false)
	const { confirmPaymentCustomer, isLoadingConfirmPaymentCustomer } = useConfirmPaymentCustomer()
	const { confirmPaymentCarrier, isLoadingConfirmPaymentCarrier } = useConfirmPaymentCarrier()
	const { confirmPaymentLogistic, isLoadingConfirmPaymentLogistic } = useConfirmPaymentLogistic()

	if (isLoading) return <PaymentPageSkeleton />

	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.payment.notFound')}
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
					label: t('order.payment.confirm.customer'),
					isConfirmed: Boolean(payment.confirmed_by_customer),
					isLoading: isLoadingConfirmPaymentCustomer,
					onConfirm: () => confirmPaymentCustomer({ id: paymentId, orderId: order.id, data: { order: order.id } }),
				}
			: isCarrier
				? {
						label: t('order.payment.confirm.carrier'),
						isConfirmed: Boolean(payment.confirmed_by_carrier),
						isLoading: isLoadingConfirmPaymentCarrier,
						onConfirm: () => confirmPaymentCarrier({ id: paymentId, orderId: order.id, data: { order: order.id } }),
					}
				: isLogistic
					? {
							label: t('order.payment.confirm.logistic'),
							isConfirmed: Boolean(payment.confirmed_by_logistic),
							isLoading: isLoadingConfirmPaymentLogistic,
							onConfirm: () =>
								confirmPaymentLogistic({ id: paymentId, orderId: order.id, data: { order: order.id } }),
						}
					: null

	const confirmationByRole = {
		customer: Boolean(payment?.confirmed_by_customer),
		carrier: Boolean(payment?.confirmed_by_carrier),
		logistic: Boolean(payment?.confirmed_by_logistic),
	}

	const sections = [
		{
			key: 'customer',
			title: t('order.payment.section.customer'),
			role: order.roles?.customer ?? null,
			confirmation: confirmationByRole.customer,
		},
		{
			key: 'carrier',
			title: t('order.payment.section.carrier'),
			role: order.roles?.carrier ?? null,
			confirmation: confirmationByRole.carrier,
		},
		{
			key: 'logistic',
			title: t('order.payment.section.logistic'),
			role: order.roles?.logistic ?? null,
			confirmation: confirmationByRole.logistic,
		},
	].filter((section) => (section.key === 'logistic' ? Boolean(order.roles?.logistic?.id) : true))

	const withFallback = (value?: string | number | null) =>
		value === null || value === undefined || value === '' ? DEFAULT_PLACEHOLDER : String(value)

	return (
		<div className='space-y-8 rounded-4xl bg-background p-8'>
			<div className='flex items-center gap-3'>
				<h1>{t('order.payment.title')}</h1>
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
								<span className='text-grayscale'>{t('order.payment.field.fullName')}</span>
								<span className='text-end font-medium text-foreground'>
									{section.role ? <ProfileLink name={section.role?.name} id={section.role?.id} /> : DEFAULT_PLACEHOLDER}
								</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.phone')}</span>
								<span className='text-end font-medium text-foreground'>
									{withFallback(section.role?.phone)}
								</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.company')}</span>
								<span className='text-end font-medium text-foreground'>
									{withFallback(section.role?.company)}
								</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.email')}</span>
								<span className='text-end font-medium text-foreground'>
									{withFallback(section.role?.login)}
								</span>
							</div>
						</div>
						<div className='space-y-4'>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.country')}</span>
								<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.city')}</span>
								<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.ordersCount')}</span>
								<span className='text-end font-medium text-foreground'>{DEFAULT_PLACEHOLDER}</span>
							</div>
							<div className='flex items-center justify-between gap-6'>
								<span className='text-grayscale'>{t('order.payment.field.confirmation')}</span>
								<span
									className={
										section.confirmation ? 'text-end font-medium text-success-500' : 'text-end font-medium text-foreground'
									}
								>
									{section.confirmation ? t('order.payment.confirmation.yes') : t('order.payment.confirmation.no')}
								</span>
							</div>
						</div>
					</div>
				</div>
			))}

			{!paymentId ? (
				<p className='text-muted-foreground'>{t('order.payment.confirmation.unavailable')}</p>
			) : confirmAction && !confirmAction.isConfirmed ? (
				<div className='flex flex-wrap items-center justify-end gap-3 pt-2'>
					<Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
						<DialogTrigger asChild>
							<Button
								className='min-w-[140px] bg-success-500 text-white hover:bg-success-600'
								disabled={!isPaymentAvailable || confirmAction.isLoading || confirmAction.isConfirmed}
							>
								{t('order.payment.actions.finish')}
							</Button>
						</DialogTrigger>
						<DialogContent className='w-[520px] max-w-[calc(100vw-2rem)] rounded-3xl'>
							<DialogHeader className='items-center text-center'>
								<DialogTitle className='text-xl font-semibold'>
									{t('order.payment.confirm.title')}
								</DialogTitle>
								<DialogDescription className='text-sm text-muted-foreground'>
									{t('order.payment.confirm.description')}
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className='flex w-full flex-row justify-center gap-3 sm:justify-center'>
								<DialogClose asChild>
									<Button variant='secondary' className='min-w-[160px]'>
										{t('order.payment.confirm.cancel')}
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
									{t('order.payment.confirm.action')}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Link href={DASHBOARD_URL.order(String(order.id))}>
						<Button className='min-w-[110px] bg-warning-400 text-white hover:bg-warning-500'>
							{t('order.payment.actions.later')}
						</Button>
					</Link>
					<Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
						<DialogTrigger asChild>
							<Button className='min-w-[120px] bg-error-500 text-white hover:bg-error-600'>
								{t('order.payment.actions.dispute')}
							</Button>
						</DialogTrigger>
						<DialogContent className='w-[520px] max-w-[calc(100vw-2rem)] rounded-3xl'>
							<DialogHeader className='items-center text-center'>
								<DialogTitle className='text-xl font-semibold'>{t('order.payment.dispute.title')}</DialogTitle>
								<DialogDescription className='text-sm text-muted-foreground'>
									{t('order.payment.dispute.description')}
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className='flex w-full flex-row justify-center gap-3 sm:justify-center'>
								<DialogClose asChild>
									<Button variant='secondary' className='min-w-[160px]'>
										{t('order.payment.dispute.close')}
									</Button>
								</DialogClose>
								<Link href={DASHBOARD_URL.settings('support')}>
									<Button className='min-w-[160px]'>
										{t('order.payment.dispute.support')}
									</Button>
								</Link>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			) : (
				<p className='text-success-500'>{t('order.payment.confirmed')}</p>
			)}
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
