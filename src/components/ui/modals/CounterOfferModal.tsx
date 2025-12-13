'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Textarea } from '@/components/ui/form-control/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { formatDateValue } from '@/lib/formatters'
import type { IOfferShort } from '@/shared/types/Offer.interface'

const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

interface CounterOfferModalProps {
	offer: IOfferShort
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CounterOfferModal({ offer, open, onOpenChange }: CounterOfferModalProps) {
	const { counterOffer, isLoadingCounter } = useCounterOffer()
	const [price, setPrice] = useState(() => (offer.price_value ? String(offer.price_value) : ''))
	const [currency, setCurrency] = useState<PriceCurrencyCode | ''>(() => offer.price_currency ?? '')
	const [message, setMessage] = useState('')

	const formattedPrice = formatCurrencyValue(offer.price_value, offer.price_currency as PriceCurrencyCode)
	const formattedPricePerKm = formatCurrencyPerKmValue(offer.price_per_km, offer.price_currency as PriceCurrencyCode)
	const isDisabled = !price || !currency || isLoadingCounter

	const handleSubmit = () => {
		if (isDisabled) return

		counterOffer(
			{
				id: String(offer.id),
				data: {
					price_value: price,
					price_currency: currency,
					message: message || undefined,
				},
			},
			{
				onSuccess: () => onOpenChange(false),
			},
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='w-[720px] max-w-[calc(100vw-2rem)] rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>Контр-предложение</DialogTitle>
				</DialogHeader>

				<div className='space-y-6'>
					<div className='grid gap-4 rounded-2xl bg-muted/20 p-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'>
						<div>
							<p className='font-semibold text-foreground'>
								{offer.origin_city}, {offer.origin_country}
							</p>
							<p className='text-sm text-muted-foreground'>{formatDateValue(offer.load_date, 'dd MMM, EEE', '—')}</p>
						</div>

						<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
							<ArrowRight className='mb-2 size-5' />
							<span>—</span>
						</div>

						<div>
							<p className='font-semibold text-foreground'>
								{offer.destination_city}, {offer.destination_country}
							</p>
							<p className='text-sm text-muted-foreground'>{formatDateValue(offer.delivery_date, 'dd MMM, EEE', '—')}</p>
						</div>
					</div>

					<div className='space-y-2 rounded-2xl border border-border p-5 text-sm text-muted-foreground'>
						<p>
							<span className='font-semibold text-foreground'>Компания: </span>
							{offer.carrier_company || offer.carrier_full_name || '—'}
						</p>
						<p>
							<span className='font-semibold text-foreground'>Текущее предложение: </span>
							{formattedPrice}
							{formattedPricePerKm ? ` (${formattedPricePerKm})` : null}
						</p>
					</div>

					<div className='grid gap-3 md:grid-cols-[1fr_auto]'>
						<Input
							placeholder='Введите цену'
							value={price}
							onChange={(event) => setPrice(event.target.value)}
							type='number'
							inputMode='decimal'
							min='0'
							className='rounded-full border-none bg-muted/40'
						/>
						<Select value={currency || undefined} onValueChange={(value) => setCurrency(value as PriceCurrencyCode)}>
							<SelectTrigger className='rounded-full border-none bg-muted/40 shadow-none'>
								<SelectValue placeholder='Валюта' />
							</SelectTrigger>
							<SelectContent>
								{currencyOptions.map((option) => (
									<SelectItem key={`${offer.id}-${option}`} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Textarea
						placeholder='Комментарий (необязательно)'
						value={message}
						onChange={(event) => setMessage(event.target.value)}
						className='rounded-2xl'
						rows={3}
					/>

					<div className='flex flex-wrap justify-end gap-3'>
						<Button
							onClick={handleSubmit}
							disabled={isDisabled}
							className='h-11 rounded-full bg-warning-400 px-6 text-white hover:bg-warning-500 disabled:opacity-60'
						>
							Отправить
						</Button>
						<DialogClose asChild>
							<Button className='h-11 rounded-full bg-muted px-6 text-foreground hover:bg-muted/80'>Отмена</Button>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
