'use client'

import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { AlertCircle, ArrowRight, ShieldX, Timer } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useMemo, useState, type ReactNode } from 'react'
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
import { useCreateOffer } from '@/hooks/queries/offers/useCreateOffer'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { getAccessToken } from '@/services/auth/auth-token.service'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import type { InviteResponseActionsProps } from '@/shared/types/Invite.interface'

const EMPTY = '—'
const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function InvitePage() {
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

	const { createOffer, isLoadingCreate } = useCreateOffer()

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

	const isProcessing = isLoadingInvite || isLoadingCreate

	if (!accessToken) {
		return (
			<InviteLayout>
				<InviteStateCard
					title='Нужна авторизация'
					description='Чтобы открыть приглашение, войдите в аккаунт перевозчика.'
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
					description='Приглашение доступно только авторизованным перевозчикам.'
					icon={<ShieldX className='size-10 text-destructive' />}
					actions={
						<Button variant='outline' onClick={() => refetchInvite()}>
							Обновить
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
					title='Ссылка истекла'
					description='Попросите отправителя сгенерировать новую ссылку на приглашение.'
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
					description='Не удалось загрузить данные приглашения.'
					icon={<AlertCircle className='size-10 text-destructive' />}
					actions={
						<Button variant='outline' onClick={() => refetchInvite()}>
							Попробовать снова
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
						<CardTitle className='text-2xl font-bold'>Приглашение на отклик по грузу</CardTitle>
						{expiryText && (
							<p className='text-sm text-muted-foreground flex items-center gap-2'>
								<Timer className='size-4' /> Ссылка действительна до {expiryText}
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
						<p className='text-sm text-muted-foreground'>Вы можете принять условия или предложить другую цену.</p>
					</CardHeader>
					<CardContent className='space-y-4'>
						<InviteResponseActions
							key={`${cargo?.id ?? 'no-cargo'}-${defaultPriceValue}-${defaultCurrencyValue}`}
							cargoId={cargo?.id ?? null}
							defaultPrice={defaultPriceValue}
							defaultCurrency={defaultCurrencyValue}
							onAccept={({ cargo: cargoId, price_currency, price_value }) => {
								if (!cargoId) {
									toast.error('Не удалось определить груз для создания предложения.')
									return
								}
								const payload = {
									cargo: cargoId,
									price_currency,
									price_value: price_value !== undefined && price_value !== null ? String(price_value) : undefined,
								}
								createOffer(payload, {
									onSuccess: () => router.push(DASHBOARD_URL.desk()),
								})
							}}
							onCounter={({ cargo: cargoId, price_currency, price_value }) => {
								if (!cargoId) {
									toast.error('Не удалось определить груз для создания предложения.')
									return
								}
								const payload = {
									cargo: cargoId,
									price_currency,
									price_value: String(price_value),
								}
								createOffer(payload, {
									onSuccess: () => router.push(DASHBOARD_URL.desk()),
								})
							}}
							isLoadingAccept={isLoadingCreate}
							isLoadingCounter={isLoadingCreate}
							isProcessing={isProcessing}
						/>

						{!cargo?.id && (
							<p className='text-sm text-amber-600 flex items-center gap-2'>
								<AlertCircle className='size-4' />
								Не удалось найти груз для ответа. Попробуйте обновить страницу или запросите новое приглашение.
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
				<p>Загружаем приглашение...</p>
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
	cargoId,
	defaultPrice,
	defaultCurrency,
	onAccept,
	onCounter,
	isLoadingAccept,
	isLoadingCounter,
	isProcessing,
}: InviteResponseActionsProps) {
	const [priceValue, setPriceValue] = useState(() => (defaultPrice ? String(defaultPrice) : ''))
	const [currency, setCurrency] = useState<PriceCurrencyCode | ''>(
		() => (defaultCurrency ? (defaultCurrency as PriceCurrencyCode) : ''),
	)
	const isActionDisabled = !cargoId || isProcessing

	const handleAccept = () => {
		if (!cargoId) {
			toast.error('Не удалось определить груз для создания предложения.')
			return
		}
		const currencyToUse = (defaultCurrency || 'UZS') as PriceCurrencyCode
		const priceToUse = defaultPrice ?? priceValue
		const payload = { cargo: cargoId, price_currency: currencyToUse, price_value: undefined as string | undefined }
		if (priceToUse !== '' && priceToUse !== null && priceToUse !== undefined) {
			payload.price_value = String(priceToUse)
		}
		onAccept(payload)
	}

	const handleCounter = () => {
		if (!cargoId) {
			toast.error('Не удалось определить груз для создания предложения.')
			return
		}
		if (!priceValue || !currency) {
			toast.error('Укажите стоимость и валюту.')
			return
		}

		const payload = {
			cargo: cargoId,
			price_value: String(priceValue),
			price_currency: currency as PriceCurrencyCode,
		}
		onCounter(payload)
	}

	return (
		<>
			<div className='grid gap-3 md:grid-cols-[1fr_auto]'>
				<Input
					placeholder='Введите стоимость'
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
			</div>
		</>
	)
}
