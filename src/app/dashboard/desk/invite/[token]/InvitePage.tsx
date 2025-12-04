'use client'

import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { AlertCircle, ArrowRight, ShieldX, Timer } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/form-control/Input'
import { Loader } from '@/components/ui/Loader'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'
import { DASHBOARD_URL } from '@/config/url.config'
import { useLoadInvite } from '@/hooks/queries/loads/useLoadInvite'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { getAccessToken } from '@/services/auth/auth-token.service'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import type { InviteResponseActionsProps } from '@/shared/types/Invite.interface'

const EMPTY = '-'
const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function InvitePage() {
	const isHydrated = useSyncExternalStore(
		(callback) => {
			callback()
			return () => {}
		},
		() => true,
		() => false,
	)

	if (!isHydrated) {
		return <InvitePageFallback />
	}

	return (
		<Suspense fallback={<InvitePageFallback />}>
			<InvitePageContent />
		</Suspense>
	)
}

function InvitePageContent() {
	const params = useParams<{ token: string }>()
	const token = params?.token
	const router = useRouter()
	const accessToken = getAccessToken()
	const {
		invite,
		isLoadingInvite,
		inviteError,
		refetchInvite,
	} = useLoadInvite(token, { enabled: Boolean(accessToken) })

	const inviteErrorStatus = useMemo(() => {
		if (!inviteError) return null
		if (inviteError instanceof AxiosError || (inviteError as AxiosError).isAxiosError) {
			return (inviteError as AxiosError).response?.status ?? null
		}
		return null
	}, [inviteError])

	const cargo = invite?.cargo
	const expiryText = invite?.expires_at
		? format(new Date(invite.expires_at), 'dd.MM.yyyy HH:mm', { locale: ru })
		: null

	const defaultPriceValue = cargo?.price_value ?? ''
	const defaultCurrencyValue = (cargo?.price_currency as PriceCurrencyCode | '') ?? ''

	const { acceptOffer, isLoadingAccept } = useAcceptOffer()
	const { counterOffer, isLoadingCounter } = useCounterOffer()
	const { rejectOffer, isLoadingReject } = useRejectOffer()

	const inviteWithOfferId = invite as (typeof invite & { offer_id?: number; offer?: { id?: number }; id?: number }) | null
	const inviteOfferId =
		inviteWithOfferId?.offer_id ?? inviteWithOfferId?.offer?.id ?? inviteWithOfferId?.id ?? null

	const formattedLoadDate = cargo?.load_date
		? format(new Date(cargo.load_date), 'dd.MM.yyyy', { locale: ru })
		: EMPTY
	const formattedDeliveryDate = cargo?.delivery_date
		? format(new Date(cargo.delivery_date), 'dd.MM.yyyy', { locale: ru })
		: EMPTY
	const transport = cargo
		? getTransportName(cargo.transport_type) || cargo.transport_type || EMPTY
		: EMPTY
	const formattedPrice = formatCurrencyValue(cargo?.price_value, cargo?.price_currency as PriceCurrencyCode | undefined)
	const formattedPricePerKm = formatCurrencyPerKmValue(
		cargo?.price_per_km,
		cargo?.price_currency as PriceCurrencyCode | undefined,
	)

	const isProcessing = isLoadingInvite || isLoadingAccept || isLoadingCounter || isLoadingReject

	if (!accessToken) {
		return (
			<InviteLayout>
				<InviteStateCard
					title='Требуется авторизация'
					description='Войдите в аккаунт, чтобы увидеть приглашение.'
					icon={<ShieldX className='size-10 text-brand' />}
					actions={
						<Link href='/auth'>
							<Button>Войти</Button>
						</Link>
					}
				/>
			</InviteLayout>
		)
	}

	if (isLoadingInvite) {
		return <InvitePageFallback />
	}

	if (inviteErrorStatus === 403) {
		return (
			<InviteLayout>
				<InviteStateCard
					title='Нет доступа'
					description='Приглашение недоступно или вы не можете его просматривать.'
					icon={<ShieldX className='size-10 text-destructive' />}
					actions={
						<Button variant='outline' onClick={() => refetchInvite()}>
							Попробовать снова
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
					title='Срок истёк'
					description='Срок действия приглашения закончился.'
					icon={<Timer className='size-10 text-amber-500' />}
				/>
			</InviteLayout>
		)
	}

	if (!invite || !cargo) {
		return (
			<InviteLayout>
				<InviteStateCard
					title='Приглашение не найдено'
					description='Не удалось получить детали приглашения.'
					icon={<AlertCircle className='size-10 text-destructive' />}
					actions={
						<Button variant='outline' onClick={() => refetchInvite()}>
							Обновить данные
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
						<CardTitle className='text-2xl font-bold'>Приглашение на груз</CardTitle>
						{expiryText && (
							<p className='text-sm text-muted-foreground flex items-center gap-2'>
								<Timer className='size-4' /> Истекает {expiryText}
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
								<span>{cargo.route_km ? `${cargo.route_km} км` : EMPTY}</span>
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
								<span className='font-semibold text-foreground'>Тип транспорта: </span>
								{transport}
							</p>
							<p>
								<span className='font-semibold text-foreground'>Вес: </span>
								{cargo.weight_t ? `${cargo.weight_t} т` : EMPTY}
							</p>
							<p>
								<span className='font-semibold text-foreground'>Стоимость: </span>
								{formattedPrice}
								{formattedPricePerKm ? ` (${formattedPricePerKm})` : ''}
							</p>
						</div>
						<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
							<span className='font-semibold text-foreground'>Компания:</span> {cargo.company_name}
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-3xl shadow-lg border-none'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-xl font-semibold'>Ответ на приглашение</CardTitle>
						<p className='text-sm text-muted-foreground'>Примите оффер, сделайте встречное или отклоните его.</p>
					</CardHeader>
					<CardContent className='space-y-4'>
						<InviteResponseActions
							key={`${inviteOfferId ?? cargo.id}-${defaultPriceValue}-${defaultCurrencyValue}`}
							offerId={inviteOfferId}
							defaultPrice={defaultPriceValue}
							defaultCurrency={defaultCurrencyValue}
							onAccept={(offerId) => {
								if (!offerId) {
									toast.error('Не удалось определить оффер для принятия.')
									return
								}
								acceptOffer(String(offerId), {
									onSuccess: () => router.push(DASHBOARD_URL.desk()),
								})
							}}
							onCounter={({ offerId, data }) => {
								if (!offerId) {
									toast.error('Не удалось определить оффер для ответа.')
									return
								}
								counterOffer(
									{ id: String(offerId), data },
									{
										onSuccess: () => router.push(DASHBOARD_URL.desk()),
									},
								)
							}}
							onReject={(offerId) => {
								if (!offerId) {
									toast.error('Не удалось определить оффер для отклонения.')
									return
								}
								rejectOffer(String(offerId), {
									onSuccess: () => router.push(DASHBOARD_URL.desk()),
								})
							}}
							isLoadingAccept={isLoadingAccept}
							isLoadingCounter={isLoadingCounter}
							isLoadingReject={isLoadingReject}
							isProcessing={isProcessing}
						/>

						{!inviteOfferId && (
							<p className='text-sm text-amber-600 flex items-center gap-2'>
								<AlertCircle className='size-4' />
								Не удалось получить идентификатор оффера. Обновите страницу или запросите новое приглашение.
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</InviteLayout>
	)
}

function InvitePageFallback() {
	return (
		<InviteLayout>
			<div className='flex flex-col items-center gap-3 text-muted-foreground'>
				<Loader />
				<p>Загрузка приглашения...</p>
			</div>
		</InviteLayout>
	)
}

function InviteLayout({ children }: { children: ReactNode }) {
	return (
		<div className='h-full bg-background rounded-4xl flex items-center justify-center'>
			{children}
		</div>
	)
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
	onAccept,
	onCounter,
	onReject,
	isLoadingAccept,
	isLoadingCounter,
	isLoadingReject,
	isProcessing,
}: InviteResponseActionsProps) {
	const [priceValue, setPriceValue] = useState(() => (defaultPrice ? String(defaultPrice) : ''))
	const [currency, setCurrency] = useState<PriceCurrencyCode | ''>(
		() => (defaultCurrency ? (defaultCurrency as PriceCurrencyCode) : ''),
	)

	const isActionDisabled = !offerId || isProcessing

	const handleAccept = () => {
		if (!offerId) {
			toast.error('Не удалось определить оффер для принятия.')
			return
		}
		onAccept(offerId)
	}

	const handleCounter = () => {
		if (!offerId) {
			toast.error('Не удалось определить оффер для ответа.')
			return
		}
		if (!priceValue || !currency) {
			toast.error('Укажите сумму и валюту.')
			return
		}

		onCounter({
			offerId,
			data: {
				price_value: String(priceValue),
				price_currency: currency as PriceCurrencyCode,
			},
		})
	}

	const handleReject = () => {
		if (!offerId) {
			toast.error('Не удалось определить оффер для отклонения.')
			return
		}
		onReject(offerId)
	}

	return (
		<>
			<div className='grid gap-3 md:grid-cols-[1fr_auto]'>
				<Input
					placeholder='Предложить сумму'
					value={priceValue}
					onChange={(event) => setPriceValue(event.target.value)}
					type='number'
					inputMode='decimal'
					min='0'
					className='rounded-full border-none bg-muted/40'
				/>
				<Select value={currency || undefined} onValueChange={(value) => setCurrency(value as PriceCurrencyCode)}>
					<SelectTrigger className='rounded-full border-none bg-muted/40 shadow-none'>
						<SelectValue placeholder='Выберите валюту' />
					</SelectTrigger>
					<SelectContent>
						{currencyOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='flex flex-wrap gap-3 justify-end pt-2'>
				<Button
					onClick={handleAccept}
					disabled={isActionDisabled}
					className='rounded-full bg-success-500 text-white hover:bg-success-600 disabled:opacity-60'
				>
					{isLoadingAccept ? 'Принятие...' : 'Принять'}
				</Button>
				<Button
					onClick={handleCounter}
					disabled={isActionDisabled || !priceValue || !currency}
					className='rounded-full bg-warning-500 text-white hover:bg-warning-600 disabled:opacity-60'
				>
					{isLoadingCounter ? 'Отправка...' : 'Сделать встречное'}
				</Button>
				<Button
					onClick={handleReject}
					disabled={isActionDisabled}
					variant='destructive'
					className='rounded-full'
				>
					{isLoadingReject ? 'Отклонение...' : 'Отклонить'}
				</Button>
			</div>
		</>
	)
}
