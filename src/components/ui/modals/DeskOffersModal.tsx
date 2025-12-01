'use client'

import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import { useGetOffers } from '@/hooks/queries/offers/useGet/useGetOffers'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyValue } from '@/lib/currency'
import { formatDateValue } from '@/lib/formatters'
import type { IOfferShort } from '@/shared/types/Offer.interface'

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

const EMPTY = '—'
const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']
const paymentOptions = [
	{ value: 'CASH', label: 'Наличными' },
	{ value: 'CARD', label: 'Перевод на карту' },
	{ value: 'BY_CARD', label: 'Безналичный расчёт (карта)' },
	{ value: 'BY_CASH', label: 'Безналичный расчёт (наличные)' },
]

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
		company: offer.carrier_name,
	}
}

export function DeskOffersModal({ cargoUuid, open, onOpenChange }: DeskOffersModalProps) {
	const [formState, setFormState] = useState<Record<number, OfferFormState>>({})
	const params = useMemo(() => (cargoUuid ? { cargo_uuid: cargoUuid } : undefined), [cargoUuid])
	const { data, isLoading } = useGetOffers(params, { enabled: Boolean(cargoUuid) })
	const { acceptOffer, isLoadingAccept } = useAcceptOffer()
	const { rejectOffer, isLoadingReject } = useRejectOffer()
	const { counterOffer, isLoadingCounter } = useCounterOffer()

	const offers = useMemo(() => data?.results ?? [], [data])
	const normalizedOffers = useMemo(() => offers.map((offer) => normalizeOffer(offer)), [offers])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[900px] rounded-3xl'>
				<DialogHeader className='pb-6 text-center'>
					<DialogTitle className='text-2xl font-bold text-center'>Предложения</DialogTitle>
				</DialogHeader>

				{!cargoUuid ? (
					<p className='py-10 text-center text-muted-foreground'>
						Выберите груз, чтобы посмотреть доступные предложения перевозчиков.
					</p>
				) : isLoading ? (
					<p className='py-10 text-center text-muted-foreground'>Загружаем предложения…</p>
				) : normalizedOffers.length === 0 ? (
					<p className='py-10 text-center text-muted-foreground'>Для этого груза пока нет предложений.</p>
				) : (
					<div className='space-y-6'>
						{normalizedOffers.map((offer) => {
							const form = formState[offer.id] ?? {}
							const isCounterDisabled = !form.price || !form.currency || isLoadingCounter
							return (
								<div key={offer.id} className='space-y-5'>
									<div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(150px,1fr)]'>
										<div>
											<p className='font-semibold text-foreground'>{offer.origin}</p>
											<p className='text-sm text-muted-foreground'>
												{offer.originDate} · {offer.originTime}
											</p>
										</div>

										<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
											<ArrowRight className='mb-1 size-5' />
											<span>-</span>
										</div>

										<div>
											<p className='font-semibold text-foreground'>{offer.destination}</p>
											<p className='text-sm text-muted-foreground'>
												{offer.destinationDate} · {offer.destinationTime}
											</p>
										</div>

										<div className='space-y-1 text-sm text-muted-foreground'>
											<p>
												<span className='font-semibold text-foreground'>Тип: </span>
												{offer.transport}
											</p>
											<p>
												<span className='font-semibold text-foreground'>Вес: </span>
												{offer.weight}
											</p>
											<p>
												<span className='font-semibold text-foreground'>Цена: </span>
												{offer.price}
												(x цена/км)
											</p>
										</div>
									</div>

									<div className='flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-foreground'>
										<p>
											<span className='font-semibold'>Компания: </span>
											{offer.company}
										</p>
										<p className='font-semibold'>
											Предложение: {offer.price}
											(x цена/км)
										</p>
									</div>

									<div className='grid gap-3 pt-2 md:grid-cols-3'>
										<Select
											value={form.paymentMethod}
											onValueChange={(value) =>
												setFormState((prev) => ({ ...prev, [offer.id]: { ...prev[offer.id], paymentMethod: value } }))
											}
										>
											<SelectTrigger className='rounded-full border-none bg-muted/40 shadow-none w-full'>
												<SelectValue placeholder='Способ оплаты' />
											</SelectTrigger>
											<SelectContent align='start'>
												{paymentOptions.map((option) => (
													<SelectItem key={`${offer.id}-${option.value}`} value={option.value}>
														{option.label}
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
											<SelectTrigger className='rounded-full border-none bg-muted/40 shadow-none w-full'>
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
											className='rounded-full border-none bg-muted/40 text-sm font-medium text-foreground placeholder:text-muted-foreground w-full'
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
											Торговать
										</Button>
										<Button
											className='rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60'
											onClick={() => rejectOffer(String(offer.id))}
											disabled={isLoadingReject}
										>
											Отказать
										</Button>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
