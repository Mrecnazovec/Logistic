'use client'

import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import { useGetOffers } from '@/hooks/queries/offers/useGet/useGetOffers'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatPriceValue } from '@/lib/formatters'
import { PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { TransportSelect } from '@/shared/enums/TransportType.enum'

interface DeskOffersModalProps {
	cargoUuid?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

type OfferFormState = {
	paymentMethod?: string
	currency?: PriceCurrencyCode
	price?: string
}

const EMPTY = '-'
const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

const normalizeOffer = (offer: IOfferShort) => {
	const priceCurrency = offer.price_currency as PriceCurrencyCode
	return {
		id: offer.id,
		origin: `${offer.origin_city}, ${offer.origin_country}`,
		originDate: formatDateValue(offer.load_date, 'dd MMM, EEE', EMPTY),
		originTime: formatDateValue(offer.load_date, 'HH:mm', EMPTY),
		destination: `${offer.destination_city}, ${offer.destination_country}`,
		destinationDate: formatDateValue(offer.delivery_date, 'dd MMM, EEE', EMPTY),
		destinationTime: formatDateValue(offer.delivery_date, 'HH:mm', EMPTY),
		transport: offer.transport_type_display || offer.transport_type || EMPTY,
		weight: offer.weight_t ? `${offer.weight_t} т` : EMPTY,
		price: formatCurrencyValue(offer.price_value, priceCurrency),
		pricePerKm: formatCurrencyPerKmValue(
			(offer as Partial<IOfferShort> & { price_per_km?: number | string }).price_per_km,
			priceCurrency,
		),
		company: offer.carrier_company || offer.carrier_full_name || EMPTY,
		carrier: offer.carrier_full_name || EMPTY,
		rating: offer.carrier_rating,
		route_km: offer.route_km,
	}
}

export function DeskOffersModal({ cargoUuid, open, onOpenChange }: DeskOffersModalProps) {
	const [activeTab, setActiveTab] = useState<'incoming' | 'accepted'>('incoming')
	const [formState, setFormState] = useState<Record<number, OfferFormState>>({})
	const params = useMemo(() => (cargoUuid ? { cargo_uuid: cargoUuid } : undefined), [cargoUuid])
	const { data, isLoading } = useGetOffers(params, { enabled: Boolean(cargoUuid) })
	const { acceptOffer, isLoadingAccept } = useAcceptOffer()
	const { rejectOffer, isLoadingReject } = useRejectOffer()
	const { counterOffer, isLoadingCounter } = useCounterOffer()

	const offers = useMemo(() => data?.results ?? [], [data])
	const incomingOffers = useMemo(() => offers.filter((offer) => !offer.accepted_by_customer), [offers])
	const acceptedOffers = useMemo(() => offers.filter((offer) => offer.accepted_by_customer), [offers])
	const normalizedIncomingOffers = useMemo(() => incomingOffers.map((offer) => normalizeOffer(offer)), [incomingOffers])
	const normalizedAcceptedOffers = useMemo(() => acceptedOffers.map((offer) => normalizeOffer(offer)), [acceptedOffers])

	const cargoInfo = useMemo(() => {
		const baseOffer = offers[0]
		if (!baseOffer) return null

		const priceCurrency = baseOffer.price_currency as PriceCurrencyCode
		return {
			origin: `${baseOffer.origin_city}, ${baseOffer.origin_country}`,
			originDate: formatDateValue(baseOffer.load_date, 'dd MMM, EEE', EMPTY),
			originTime: formatDateValue(baseOffer.load_date, 'HH:mm', EMPTY),
			destination: `${baseOffer.destination_city}, ${baseOffer.destination_country}`,
			destinationDate: formatDateValue(baseOffer.delivery_date, 'dd MMM, EEE', EMPTY),
			destinationTime: formatDateValue(baseOffer.delivery_date, 'HH:mm', EMPTY),
			transport: TransportSelect.find((type) => type.type === baseOffer.transport_type)?.name ?? baseOffer.transport_type,
			weight: baseOffer.weight_t ? `${baseOffer.weight_t}` : EMPTY,
			price: formatCurrencyValue(baseOffer.price_value, priceCurrency),
			pricePerKm: formatCurrencyPerKmValue(
				(baseOffer as Partial<IOfferShort> & { price_per_km?: number | string }).price_per_km,
				priceCurrency,
			),
			route_km: baseOffer.route_km,
			currency: baseOffer.price_currency
		}
	}, [offers])

	const renderOfferCard = (offer: ReturnType<typeof normalizeOffer>, isReadOnly?: boolean) => {
		const form = formState[offer.id] ?? {}
		const isCounterDisabled = !form.price || !form.currency || isLoadingCounter

		return (
			<div key={offer.id} className='space-y-4 rounded-2xl border border-border p-5'>
				<div className='flex flex-wrap items-start justify-between gap-3 text-sm'>
					<div className='space-y-1'>
						<p className='font-semibold text-foreground'>{offer.carrier}</p>
						<p className='text-muted-foreground'>
							<span className='font-semibold text-foreground'>Компания: </span>
							{offer.company}
						</p>
					</div>
					<div className='space-y-1 text-right text-sm text-muted-foreground'>
						{offer.rating !== null && offer.rating !== undefined ? (
							<p>
								<span className='font-semibold text-foreground'>Рейтинг: </span>
								{offer.rating}
							</p>
						) : null}
						<p className='font-semibold text-foreground'>
							Предложение: {offer.price}
							{offer.pricePerKm ? <span className='text-muted-foreground'> ({offer.pricePerKm})</span> : null}
						</p>
					</div>
				</div>

				{!isReadOnly && (
					<>
						<div className='grid gap-3 pt-2 md:grid-cols-3'>
							<Select
								value={form.paymentMethod}
								onValueChange={(value) =>
									setFormState((prev) => ({
										...prev,
										[offer.id]: { ...prev[offer.id], paymentMethod: value },
									}))
								}
							>
								<SelectTrigger className='w-full rounded-full border-none bg-muted/40 shadow-none'>
									<SelectValue placeholder='Способ оплаты' />
								</SelectTrigger>
								<SelectContent align='start'>
									{PaymentMethodSelector.map((option) => (
										<SelectItem key={`${offer.id}-${option.type}`} value={option.type}>
											{option.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={form.currency}
								onValueChange={(value) =>
									setFormState((prev) => ({
										...prev,
										[offer.id]: { ...prev[offer.id], currency: value as PriceCurrencyCode },
									}))
								}
							>
								<SelectTrigger className='w-full rounded-full border-none bg-muted/40 shadow-none'>
									<SelectValue placeholder='Выберите валюту' />
								</SelectTrigger>
								<SelectContent align='start'>
									{currencyOptions.map((currency) => (
										<SelectItem key={`${offer.id}-${currency}`} value={currency}>
											{currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Input
								type='number'
								inputMode='decimal'
								min='0'
								step='0.01'
								value={form.price ?? ''}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										[offer.id]: { ...prev[offer.id], price: event.target.value },
									}))
								}
								placeholder='Введите цену'
								className='w-full rounded-full border-none bg-muted/40 text-sm font-medium text-foreground placeholder:text-muted-foreground'
							/>
						</div>

						<div className='flex justify-end gap-3 pt-4'>
							<Button
								className='rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60'
								onClick={() => acceptOffer(String(offer.id))}
								disabled={isLoadingAccept}
							>
								Принять
							</Button>
							<Button
								className='rounded-full bg-warning-400 text-white hover:bg-warning-500 disabled:opacity-60'
								onClick={() => {
									if (!form.price || !form.currency) return
									counterOffer({
										id: String(offer.id),
										data: { price_value: form.price, price_currency: form.currency },
									})
								}}
								disabled={isCounterDisabled}
							>
								Ответить
							</Button>
							<Button
								className='rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60'
								onClick={() => rejectOffer(String(offer.id))}
								disabled={isLoadingReject}
							>
								Отказать
							</Button>
						</div>
					</>
				)}
			</div>
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[900px] rounded-3xl'>
				<DialogHeader className='pb-6 text-center'>
					<DialogTitle className='text-2xl font-bold text-center'>Предложения</DialogTitle>
				</DialogHeader>

				{!cargoUuid ? (
					<p className='py-10 text-center text-muted-foreground'>
						Ничего не выбрано. Укажите груз, чтобы увидеть предложения.
					</p>
				) : isLoading ? (
					<p className='py-10 text-center text-muted-foreground'>Загружаем предложения...</p>
				) : offers.length === 0 ? (
					<p className='py-10 text-center text-muted-foreground'>Предложений пока нет.</p>
				) : (
					<div className='space-y-6'>
						<div className='flex flex-wrap items-start justify-between gap-6 border-b pb-6'>
							<div>
								<p className='font-semibold text-foreground'>
									{cargoInfo?.origin}
								</p>
								<p className='text-sm text-muted-foreground'>{cargoInfo?.originDate}</p>
							</div>
							<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
								<ArrowRight className='mb-1 size-5' />
								{cargoInfo?.route_km}
							</div>
							<div>
								<p className='font-semibold text-foreground'>
									{cargoInfo?.destination}
								</p>
								<p className='text-sm text-muted-foreground'>{cargoInfo?.destinationDate}</p>
							</div>
							<div className='space-y-1 text-sm text-muted-foreground'>
								<p>
									<span className='font-semibold text-foreground'>Тип транспорта: </span>
									{cargoInfo?.transport}
								</p>
								<p>
									<span className='font-semibold text-foreground'>Вес: </span>
									{cargoInfo?.weight ? `${cargoInfo?.weight} т` : EMPTY}
								</p>
								<p>
									<span className='font-semibold text-foreground'>Цена: </span>
									{formatPriceValue(cargoInfo?.price, cargoInfo?.currency)}, ({formatCurrencyPerKmValue(cargoInfo?.pricePerKm)})
								</p>
							</div>
						</div>
						<Tabs
							value={activeTab}
							onValueChange={(value) => setActiveTab(value as 'incoming' | 'accepted')}
							className='space-y-4'
						>
							<TabsList className='w-full justify-center gap-8 bg-transparent p-0 border-b'>
								<TabsTrigger
									value='incoming'
									className='rounded-none border-2 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-brand'
								>
									Входящие
								</TabsTrigger>
								<TabsTrigger
									value='accepted'
									className='rounded-none border-2 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-brand'
								>
									Принятые
								</TabsTrigger>
							</TabsList>

							<TabsContent value='incoming' className='space-y-4'>
								{normalizedIncomingOffers.length ? (
									normalizedIncomingOffers.map((offer) => renderOfferCard(offer))
								) : (
									<p className='py-6 text-center text-muted-foreground'>Нет входящих предложений.</p>
								)}
							</TabsContent>

							<TabsContent value='accepted' className='space-y-4'>
								{normalizedAcceptedOffers.length ? (
									normalizedAcceptedOffers.map((offer) => renderOfferCard(offer, true))
								) : (
									<p className='py-6 text-center text-muted-foreground'>Нет принятых предложений.</p>
								)}
							</TabsContent>
						</Tabs>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
