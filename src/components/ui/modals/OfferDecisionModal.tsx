"use client"

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import { useAcceptOrderInvite } from '@/hooks/queries/orders/useAcceptOrderInvite'
import { useI18n } from '@/i18n/I18nProvider'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { formatDateValue } from '@/lib/formatters'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { getTransportName, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { ProfileLink } from '../actions/ProfileLink'

interface OfferDecisionModalProps {
	offer?: IOfferShort
	open: boolean
	onOpenChange: (open: boolean) => void
	statusNote?: string
	allowActions?: boolean
}

const EMPTY = '-'
const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function OfferDecisionModal({ offer, open, onOpenChange, statusNote, allowActions = true }: OfferDecisionModalProps) {
	const { t } = useI18n()
	const initialPriceValue = offer?.price_value ? String(offer.price_value) : ''
	const initialCurrency = (offer?.price_currency as PriceCurrencyCode) ?? ''
	const initialPaymentMethod = (offer?.payment_method as PaymentMethodEnum) ?? ''

	const [priceValue, setPriceValue] = useState(initialPriceValue)
	const [currency, setCurrency] = useState<PriceCurrencyCode | ''>(initialCurrency)
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum | ''>(initialPaymentMethod)
	const dialogKey = offer ? `${offer.id}-${open}` : 'empty'

	const { acceptOffer, isLoadingAcceptOffer } = useAcceptOffer()
	const { rejectOffer, isLoadingRejectOffer } = useRejectOffer()
	const { counterOffer, isLoadingCounterOffer } = useCounterOffer()
	const { acceptOrderInvite, isLoadingAccept: isLoadingAcceptInvite } = useAcceptOrderInvite()

	const transport = offer
		? getTransportName(t, offer.transport_type as TransportTypeEnum) || offer.transport_type || EMPTY
		: EMPTY

	const formattedPrice = formatCurrencyValue(offer?.price_value, offer?.price_currency as PriceCurrencyCode)
	const formattedPricePerKm = formatCurrencyPerKmValue(offer?.price_per_km, offer?.price_currency as PriceCurrencyCode)
	const isCounterDisabled = !priceValue || !currency || !paymentMethod || isLoadingCounterOffer || !offer
	const inviteToken = (offer as { invite_token?: string } | undefined)?.invite_token
	const isInviteFlow = Boolean(inviteToken)

	const handleAcceptInvite = () => {
		if (!inviteToken) return
		acceptOrderInvite(
			{ token: inviteToken },
			{
				onSuccess: () => onOpenChange(false),
			},
		)
	}

	const handleAccept = () => {
		if (!offer) return
		acceptOffer(String(offer.id), {
			onSuccess: () => onOpenChange(false),
		})
	}

	const handleReject = () => {
		if (!offer) return
		rejectOffer(String(offer.id), {
			onSuccess: () => onOpenChange(false),
		})
	}

	const handleCounter = () => {
		if (isCounterDisabled || !offer) return
		counterOffer(
			{
				id: String(offer.id),
				data: {
					price_value: priceValue,
					price_currency: currency as PriceCurrencyCode,
					payment_method: paymentMethod as PaymentMethodEnum,
				},
			},
			{
				onSuccess: () => onOpenChange(false),
			},
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent key={dialogKey} className='w-[900px] max-w-[calc(100vw-2rem)] rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>{t('components.offerDecision.title')}</DialogTitle>
				</DialogHeader>

				{!offer ? (
					<p className='py-6 text-center text-muted-foreground'>{t('components.offerDecision.empty')}</p>
				) : (
					<div className='space-y-6'>
						{!allowActions ? (
							<p className='py-10 text-center text-base font-semibold text-muted-foreground'>
								{statusNote || t('components.offerDecision.unavailable')}
							</p>
						) : (
							<>
								{statusNote ? (
									<p className='rounded-2xl bg-muted/60 px-4 py-3 text-center text-sm font-semibold text-muted-foreground'>{statusNote}</p>
								) : null}

								<div className='flex flex-wrap items-start justify-between gap-6 border-b pb-6'>
									<div>
										<p className='font-semibold text-foreground'>
											{offer.origin_city}, {offer.origin_country}
										</p>
										<p className='text-sm text-muted-foreground'>{formatDateValue(offer.load_date, 'dd.MM.yyyy', EMPTY)}</p>
									</div>
									<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
										<ArrowRight className='mb-1 size-5' />
										{offer.route_km}
									</div>
									<div>
										<p className='font-semibold text-foreground'>
											{offer.destination_city}, {offer.destination_country}
										</p>
										<p className='text-sm text-muted-foreground'>
											{formatDateValue(offer.delivery_date, 'dd.MM.yyyy', EMPTY)}
										</p>
									</div>
									<div className='space-y-1 text-sm text-muted-foreground'>
										<p>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.transportLabel')}: </span>
											{transport}
										</p>
										<p>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.weightLabel')}: </span>
											{offer.weight_t ? `${offer.weight_t} ${t('components.offerDecision.ton')}` : EMPTY}
										</p>
										<p>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.priceLabel')}: </span>
											{formattedPrice || EMPTY} ({formattedPricePerKm})
										</p>
									</div>
								</div>

								<div className='flex flex-wrap items-center justify-between gap-3 border-b pb-6 text-sm text-muted-foreground'>
									<div className='space-y-1'>
										<p className='font-semibold text-foreground'>
											<ProfileLink name={offer.customer_full_name} id={offer.customer_id} />
										</p>
										<p className='text-muted-foreground'>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.companyLabel')}: </span>
											{offer.customer_company || EMPTY}
										</p>
										<span className='text-error-500 font-bold'>{offer.response_status}</span>
									</div>
									<p className='font-semibold text-foreground'>
										{t('components.offerDecision.currentPrice')}: {formattedPrice || EMPTY}
									</p>
								</div>

								{!isInviteFlow ? (
									<>
										<div className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
											<Input
												placeholder={t('components.offerDecision.pricePlaceholder')}
												value={priceValue}
												onChange={(event) => setPriceValue(event.target.value)}
												type='number'
												inputMode='decimal'
												min='0'
												className='rounded-full border-none bg-muted/40'
											/>
											<Select value={currency || undefined} onValueChange={(value) => setCurrency(value as PriceCurrencyCode)}>
												<SelectTrigger className='rounded-full border-none bg-muted/40 shadow-none'>
													<SelectValue placeholder={t('components.offerDecision.currencyPlaceholder')} />
												</SelectTrigger>
												<SelectContent>
													{currencyOptions.map((option) => (
														<SelectItem key={`${offer.id}-${option}`} value={option}>
															{option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<PaymentSelector
												value={paymentMethod}
												onChange={(value) => setPaymentMethod(value)}
												placeholder={t('components.offerDecision.paymentPlaceholder')}
												className='bg-muted/40 shadow-none'
											/>
										</div>

										<div className='flex max-sm:flex-col justify-end gap-3'>
											<Button
												onClick={handleAccept}
												disabled={isLoadingAcceptOffer || !offer}
												className='rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60'
											>
												{t('components.offerDecision.accept')}
											</Button>
											<Button
												onClick={handleCounter}
												disabled={isCounterDisabled}
												className='rounded-full bg-warning-400 text-white hover:bg-warning-500 disabled:opacity-60'
											>
												{t('components.offerDecision.counter')}
											</Button>
											<Button
												onClick={handleReject}
												disabled={isLoadingRejectOffer || !offer}
												className='rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60'
											>
												{t('components.offerDecision.reject')}
											</Button>
										</div>
									</>
								) : null}

								{isInviteFlow ? (
									<div className='flex flex-wrap justify-end gap-3'>
										<Button
											onClick={handleAcceptInvite}
											disabled={!inviteToken || isLoadingAcceptInvite}
											className='rounded-full bg-success-500 text-white hover:bg-success-600 disabled:opacity-60'
										>
											{t('components.offerDecision.acceptInvite')}
										</Button>
									</div>
								) : null}
							</>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
