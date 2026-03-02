'use client'

import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/form-control/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { useI18n } from '@/i18n/I18nProvider'
import { formatPriceInputValue, handlePriceInput, normalizePriceValueForPayload } from '@/lib/InputValidation'
import type { PriceCurrencyCode } from '@/lib/currency'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import type { InviteResponseActionsProps } from '@/shared/types/Invite.interface'
import { AlertCircle, ArrowRight, ShieldX, Timer } from 'lucide-react'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'

const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']
const EMPTY = '-'

type Props = {
	t: (...args: any[]) => string
	authHref: string
	accessToken: string | null
	isLoadingInvite: boolean
	inviteErrorStatus: number | null
	refetchInvite: () => void
	invite: any
	cargo: any
	expiryText: string | null
	formattedLoadDate: string
	formattedDeliveryDate: string
	transport: string
	formattedPrice: string
	formattedPricePerKm: string
	defaultPriceValue: string | number
	defaultCurrencyValue: PriceCurrencyCode | ''
	defaultPaymentMethod: PaymentMethodEnum | null
	inviteOfferId: number | null
	isProcessing: boolean
	isLoadingAcceptOffer: boolean
	isLoadingCounterOffer: boolean
	isLoadingRejectOffer: boolean
	onAccept: (offerId: number | null) => void
	onCounter: (payload: { offerId: number | null; data: any }) => void
	onReject: (offerId: number | null) => void
}

export function InviteView(props: Props) {
	const {
		t,
		authHref,
		accessToken,
		isLoadingInvite,
		inviteErrorStatus,
		refetchInvite,
		invite,
		cargo,
		expiryText,
		formattedLoadDate,
		formattedDeliveryDate,
		transport,
		formattedPrice,
		formattedPricePerKm,
		defaultPriceValue,
		defaultCurrencyValue,
		defaultPaymentMethod,
		inviteOfferId,
		isProcessing,
		isLoadingAcceptOffer,
		isLoadingCounterOffer,
		isLoadingRejectOffer,
		onAccept,
		onCounter,
		onReject,
	} = props

	if (!accessToken) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('desk.invite.auth.title')}
					description={t('desk.invite.auth.description')}
					icon={<ShieldX className='size-10 text-brand' />}
					actions={
						<Link href={authHref}>
							<Button>{t('desk.invite.auth.action')}</Button>
						</Link>
					}
				/>
			</InviteLayout>
		)
	}

	if (isLoadingInvite) return <InvitePageFallback />

	if (inviteErrorStatus === 403) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('desk.invite.forbidden.title')}
					description={t('desk.invite.forbidden.description')}
					icon={<ShieldX className='size-10 text-destructive' />}
					actions={
						<Button variant='outline' onClick={() => refetchInvite()}>
							{t('desk.invite.forbidden.action')}
						</Button>
					}
				/>
			</InviteLayout>
		)
	}

	if (inviteErrorStatus === 400) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('desk.invite.expired.title')}
					description={t('desk.invite.expired.description')}
					icon={<Timer className='size-10 text-amber-500' />}
				/>
			</InviteLayout>
		)
	}

	if (!invite || !cargo) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('desk.invite.notFound.title')}
					description={t('desk.invite.notFound.description')}
					icon={<AlertCircle className='size-10 text-destructive' />}
					actions={
						<Button variant='outline' onClick={() => refetchInvite()}>
							{t('desk.invite.notFound.action')}
						</Button>
					}
				/>
			</InviteLayout>
		)
	}

	return (
		<InviteLayout>
			<div className='w-full max-w-5xl space-y-6'>
				<Card className='rounded-3xl shadow-lg border-none'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-2xl font-bold'>{t('desk.invite.title')}</CardTitle>
						{expiryText && (
							<p className='text-sm text-muted-foreground flex items-center gap-2'>
								<Timer className='size-4' /> {t('desk.invite.expires', { date: expiryText })}
							</p>
						)}
					</CardHeader>
					<CardContent className='space-y-5'>
						<div className='grid gap-4 md:grid-cols-[1fr_auto_1fr] items-start'>
							<div>
								<p className='font-semibold text-foreground'>
									{cargo.origin_city}, {cargo.origin_country}
								</p>
								<p className='text-sm text-muted-foreground'>{formattedLoadDate}</p>
							</div>
							<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
								<ArrowRight className='mb-1 size-5' />
								<span>{cargo.route_km ? `${cargo.route_km} ${t('desk.invite.km')}` : EMPTY}</span>
							</div>
							<div>
								<p className='font-semibold text-foreground'>
									{cargo.destination_city}, {cargo.destination_country}
								</p>
								<p className='text-sm text-muted-foreground'>{formattedDeliveryDate}</p>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-3 text-sm text-muted-foreground'>
							<p>
								<span className='font-semibold text-foreground'>{t('desk.invite.transportType')}: </span>
								{transport}
							</p>
							<p>
								<span className='font-semibold text-foreground'>{t('desk.invite.weight')}: </span>
								{cargo.weight_t ? `${cargo.weight_t} ${t('desk.invite.ton')}` : EMPTY}
							</p>
							<p>
								<span className='font-semibold text-foreground'>{t('desk.invite.price')}: </span>
								{formattedPrice}
								{formattedPricePerKm ? ` (${formattedPricePerKm})` : ''}
							</p>
						</div>
						<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
							<span className='font-semibold text-foreground'>{t('desk.invite.company')}:</span> {cargo.company_name}
						</div>
						<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
							<span className='font-semibold text-foreground'>{t('desk.invite.representative')}:</span>{' '}
							<ProfileLink id={Number(cargo.user_id)} name={cargo.user_name} />
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-3xl shadow-lg border-none'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-xl font-semibold'>{t('desk.invite.response.title')}</CardTitle>
						<p className='text-sm text-muted-foreground'>{t('desk.invite.response.description')}</p>
					</CardHeader>
					<CardContent className='space-y-4'>
						<InviteResponseActions
							key={`${inviteOfferId ?? cargo.id}-${defaultPriceValue}-${defaultCurrencyValue}`}
							offerId={inviteOfferId}
							defaultPrice={defaultPriceValue}
							defaultCurrency={defaultCurrencyValue}
							defaultPaymentMethod={defaultPaymentMethod}
							onAccept={onAccept}
							onCounter={onCounter}
							onReject={onReject}
							isLoadingAccept={isLoadingAcceptOffer}
							isLoadingCounter={isLoadingCounterOffer}
							isLoadingReject={isLoadingRejectOffer}
							isProcessing={isProcessing}
						/>
						{!inviteOfferId && (
							<p className='text-sm text-amber-600 flex items-center gap-2'>
								<AlertCircle className='size-4' />
								{t('desk.invite.offerIdMissingHint')}
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</InviteLayout>
	)
}

export function InvitePageFallback() {
	return (
		<InviteLayout>
			<div className='w-full max-w-5xl space-y-6'>
				<Card className='rounded-3xl border-none shadow-lg'>
					<CardHeader className='space-y-3 pb-4'>
						<Skeleton className='h-8 w-52 rounded-full' />
						<Skeleton className='h-4 w-72 rounded-full' />
					</CardHeader>
					<CardContent className='space-y-4'>
						<Skeleton className='h-24 w-full rounded-3xl' />
						<Skeleton className='h-14 w-full rounded-3xl' />
						<Skeleton className='h-14 w-full rounded-3xl' />
					</CardContent>
				</Card>
				<Card className='rounded-3xl border-none shadow-lg'>
					<CardHeader className='space-y-3 pb-4'>
						<Skeleton className='h-7 w-48 rounded-full' />
						<Skeleton className='h-4 w-80 rounded-full' />
					</CardHeader>
					<CardContent className='space-y-4'>
						<Skeleton className='h-11 w-full rounded-full' />
						<Skeleton className='h-11 w-full rounded-full' />
						<div className='flex gap-3 justify-end'>
							<Skeleton className='h-11 w-28 rounded-full' />
							<Skeleton className='h-11 w-28 rounded-full' />
							<Skeleton className='h-11 w-28 rounded-full' />
						</div>
					</CardContent>
				</Card>
			</div>
		</InviteLayout>
	)
}

function InviteLayout({ children }: { children: ReactNode }) {
	return <div className='h-full bg-background rounded-4xl flex items-center justify-center'>{children}</div>
}

function InviteStateCard({
	title,
	description,
	icon,
	actions,
}: {
	title: string
	description: string
	icon?: React.ReactNode
	actions?: React.ReactNode
}) {
	return (
		<Card className='w-full max-w-xl text-center rounded-3xl shadow-lg border-none'>
			<CardContent className='py-10 flex flex-col items-center gap-4'>
				{icon}
				<div className='space-y-1'>
					<p className='text-xl font-semibold text-foreground'>{title}</p>
					<p className='text-sm text-muted-foreground'>{description}</p>
				</div>
				{actions}
			</CardContent>
		</Card>
	)
}

function InviteResponseActions({
	offerId,
	defaultPrice,
	defaultCurrency,
	defaultPaymentMethod,
	onAccept,
	onCounter,
	onReject,
	isLoadingAccept,
	isLoadingCounter,
	isLoadingReject,
	isProcessing,
}: InviteResponseActionsProps) {
	const { t } = useI18n()
	const [priceValue, setPriceValue] = useState(() => formatPriceInputValue(defaultPrice ? String(defaultPrice) : ''))
	const [currency, setCurrency] = useState<PriceCurrencyCode | ''>(() => (defaultCurrency ? (defaultCurrency as PriceCurrencyCode) : ''))
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum | ''>(
		() => (defaultPaymentMethod ? (defaultPaymentMethod as PaymentMethodEnum) : ''),
	)
	const [isCounterEditing, setIsCounterEditing] = useState(false)

	const isActionDisabled = !offerId || isProcessing

	const handleAccept = () => {
		if (!offerId) {
			toast.error(t('desk.invite.offerIdMissing'))
			return
		}
		onAccept(offerId)
	}

	const handleCounter = () => {
		if (!isCounterEditing) {
			setIsCounterEditing(true)
			return
		}
		if (!offerId) {
			toast.error(t('desk.invite.offerIdMissing'))
			return
		}
		if (!priceValue || !currency || !paymentMethod) {
			toast.error(t('desk.invite.counterNeedPrice'))
			return
		}

		onCounter({
			offerId,
			data: {
				price_value: normalizePriceValueForPayload(String(priceValue)) ?? '',
				price_currency: currency as PriceCurrencyCode,
				payment_method: paymentMethod as PaymentMethodEnum,
			},
		})
	}

	const handleReject = () => {
		if (!offerId) {
			toast.error(t('desk.invite.offerIdMissing'))
			return
		}
		onReject(offerId)
	}

	return (
		<>
			<div className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
				<Input
					placeholder={t('desk.invite.pricePlaceholder')}
					value={priceValue}
					onChange={(event) => handlePriceInput(event, setPriceValue)}
					type='text'
					inputMode='numeric'
					min='0'
					className='rounded-full border-none bg-muted/40'
					disabled={isActionDisabled || !isCounterEditing}
				/>
				<Select value={currency || undefined} onValueChange={(value) => setCurrency(value as PriceCurrencyCode)}>
					<SelectTrigger className='rounded-full border-none bg-muted/40 shadow-none' disabled={isActionDisabled || !isCounterEditing}>
						<SelectValue placeholder={t('desk.invite.currencyPlaceholder')} />
					</SelectTrigger>
					<SelectContent>
						{currencyOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<PaymentSelector
					value={paymentMethod}
					onChange={(value) => setPaymentMethod(value)}
					placeholder={t('components.offerCard.paymentPlaceholder')}
					disabled={isActionDisabled || !isCounterEditing}
					className='bg-muted/40 shadow-none [&>button]:border-none [&>button]:bg-transparent'
				/>
			</div>

			<div className='flex flex-wrap gap-3 justify-end pt-2'>
				{!isCounterEditing ? (
					<Button
						onClick={handleAccept}
						disabled={isActionDisabled}
						className='rounded-full bg-success-500 text-white hover:bg-success-600 disabled:opacity-60'
					>
						{isLoadingAccept ? t('desk.invite.acceptLoading') : t('desk.invite.accept')}
					</Button>
				) : null}
				<Button
					onClick={handleCounter}
					disabled={isActionDisabled || (isCounterEditing && (!priceValue || !currency || !paymentMethod))}
					className='rounded-full bg-warning-500 text-white hover:bg-warning-600 disabled:opacity-60'
				>
					{isLoadingCounter ? t('desk.invite.counterLoading') : isCounterEditing ? t('desk.invite.counterSubmit') : t('desk.invite.counter')}
				</Button>
				<Button onClick={handleReject} disabled={isActionDisabled} variant='destructive' className='rounded-full'>
					{isLoadingReject ? t('desk.invite.rejectLoading') : t('desk.invite.reject')}
				</Button>
			</div>
		</>
	)
}
