"use client"

import { UserRound } from 'lucide-react'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetSharedOrder } from '@/hooks/queries/orders/useGet/useGetSharedOrder'
import { useI18n } from '@/i18n/I18nProvider'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'

export function PaymentPage() {
	const { t } = useI18n()
	const { order, isLoading } = useGetSharedOrder()
	const payment = order?.payment ?? null

	if (isLoading) return <PaymentPageSkeleton />

	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.payment.notFound')}
			</div>
		)
	}

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
									{section.role ? withFallback(section.role?.name) : DEFAULT_PLACEHOLDER}
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
