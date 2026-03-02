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
import { useConfirmOrderTerms } from '@/hooks/queries/orders/useConfirmOrderTerms'
import { useDeclineOrderInvite } from '@/hooks/queries/orders/useDeclineOrderInvite'
import { useGetInvitePreview } from '@/hooks/queries/orders/useGet/useGetInvitePreview'
import { useI18n } from '@/i18n/I18nProvider'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatDistanceKm } from '@/lib/formatters'
import { formatPriceInputValue, handlePriceInput, normalizePriceValueForPayload } from '@/lib/InputValidation'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { getTransportName, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { ProfileLink } from '../../../actions/ProfileLink'

interface OfferDecisionModalProps {
	offer?: IOfferShort
	open: boolean
	onOpenChange: (open: boolean) => void
	statusNote?: string
	allowActions?: boolean
}

const EMPTY = '-'
const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function OfferDecisionModalView({ offer, open, onOpenChange, statusNote, allowActions = true }: OfferDecisionModalProps) {
	const { t } = useI18n()
	const initialPriceValue = formatPriceInputValue(offer?.price_value ? String(offer.price_value) : '')
	const initialCurrency = (offer?.price_currency as PriceCurrencyCode) ?? ''
	const initialPaymentMethod = (offer?.payment_method as PaymentMethodEnum) ?? ''

	const [priceValue, setPriceValue] = useState(initialPriceValue)
	const [currency, setCurrency] = useState<PriceCurrencyCode | ''>(initialCurrency)
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum | ''>(initialPaymentMethod)
	const [isCounterMode, setIsCounterMode] = useState(false)
	const dialogKey = offer ? `${offer.id}-${open}` : 'empty'

	const { acceptOffer, isLoadingAcceptOffer } = useAcceptOffer()
	const { rejectOffer, isLoadingRejectOffer } = useRejectOffer()
	const { counterOffer, isLoadingCounterOffer } = useCounterOffer()
	const { acceptOrderInvite, isLoadingAccept: isLoadingAcceptInvite } = useAcceptOrderInvite()
	const { declineOrderInvite, isLoadingDecline } = useDeclineOrderInvite()
	const { confirmOrderTerms } = useConfirmOrderTerms()

	const isCounterDisabled = !priceValue || !currency || !paymentMethod || isLoadingCounterOffer || !offer
	const inviteToken = (offer as { invite_token?: string } | undefined)?.invite_token
	const isInviteFlow = Boolean(inviteToken)
	const { invitePreview } = useGetInvitePreview(isInviteFlow ? inviteToken : '')
	const resolvedOriginCity = invitePreview?.origin_city ?? offer?.origin_city ?? EMPTY
	const resolvedOriginCountry = offer?.origin_country ?? ''
	const resolvedDestinationCity = invitePreview?.destination_city ?? offer?.destination_city ?? EMPTY
	const resolvedDestinationCountry = offer?.destination_country ?? ''
	const resolvedLoadDate = formatDateValue(invitePreview?.load_date ?? offer?.load_date, 'dd.MM.yyyy', EMPTY)
	const resolvedDeliveryDate = formatDateValue(invitePreview?.delivery_date ?? offer?.delivery_date, 'dd.MM.yyyy', EMPTY)
	const resolvedRouteKm = invitePreview?.route_distance_km
		? formatDistanceKm(invitePreview.route_distance_km, EMPTY)
		: offer?.route_km ?? EMPTY
	const resolvedTransportType = invitePreview?.transport_type ?? offer?.transport_type
	const resolvedTransport = resolvedTransportType
		? getTransportName(t, resolvedTransportType as TransportTypeEnum) || resolvedTransportType || EMPTY
		: EMPTY
	const resolvedWeight = invitePreview?.weight_kg
		? Number(invitePreview.weight_kg) / 1000
		: offer?.weight_t
	const resolvedPriceValue = invitePreview?.driver_price ?? offer?.price_value
	const resolvedCurrency = (invitePreview?.driver_currency ?? offer?.price_currency) as PriceCurrencyCode | undefined
	const resolvedPrice = formatCurrencyValue(resolvedPriceValue, resolvedCurrency)
	const resolvedPricePerKm = formatCurrencyPerKmValue(offer?.price_per_km, resolvedCurrency)
	const inviter = invitePreview?.inviter as { id?: number; name?: string; company?: string } | null
	const inviteUserId = inviter?.id ?? null
	const inviteUserName = inviter?.name ?? EMPTY
	const inviteCompanyName = inviter?.company ?? EMPTY

	const resetCounterState = () => {
		setPriceValue(initialPriceValue)
		setCurrency(initialCurrency)
		setPaymentMethod(initialPaymentMethod)
		setIsCounterMode(false)
	}

	const handleAcceptInvite = () => {
		if (!inviteToken) return
		acceptOrderInvite(
			{ token: inviteToken },
			{
				onSuccess: (order) => {
					if (order?.order_id) {
						confirmOrderTerms(order.order_id)
					}
					onOpenChange(false)
				},
			},
		)
	}

	const handleDeclineInvite = () => {
		if (!inviteToken) return
		declineOrderInvite(
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
		if (!isCounterMode) {
			setIsCounterMode(true)
			return
		}
		if (isCounterDisabled || !offer) return
		counterOffer(
			{
				id: String(offer.id),
				data: {
					price_value: normalizePriceValueForPayload(priceValue) ?? '',
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
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (nextOpen) {
					resetCounterState()
				}
				onOpenChange(nextOpen)
			}}
		>
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
											{resolvedOriginCity}{resolvedOriginCountry ? `, ${resolvedOriginCountry}` : ''}
										</p>
										<p className='text-sm text-muted-foreground'>{resolvedLoadDate}</p>
									</div>
									<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
										<ArrowRight className='mb-1 size-5' />
										{resolvedRouteKm}
									</div>
									<div>
										<p className='font-semibold text-foreground'>
											{resolvedDestinationCity}{resolvedDestinationCountry ? `, ${resolvedDestinationCountry}` : ''}
										</p>
										<p className='text-sm text-muted-foreground'>{resolvedDeliveryDate}</p>
									</div>
									<div className='space-y-1 text-sm text-muted-foreground'>
										<p>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.transportLabel')}: </span>
											{resolvedTransport}
										</p>
										<p>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.weightLabel')}: </span>
											{resolvedWeight ? `${resolvedWeight} ${t('components.offerDecision.ton')}` : EMPTY}
										</p>
										<p>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.priceLabel')}: </span>
											{resolvedPrice || EMPTY} ({resolvedPricePerKm})
										</p>
									</div>
								</div>

								<div className='flex flex-wrap items-center justify-between gap-3 border-b pb-6 text-sm text-muted-foreground'>
									<div className='space-y-1'>
										<p className='font-semibold text-foreground'>
											{inviteUserId && inviteUserName !== EMPTY ? (
												<ProfileLink name={inviteUserName} id={inviteUserId} />
											) : (
												<ProfileLink name={offer.customer_full_name} id={offer.customer_id} />
											)}
										</p>
										<p className='text-muted-foreground'>
											<span className='font-semibold text-foreground'>{t('components.offerDecision.companyLabel')}: </span>
											{invitePreview ? inviteCompanyName : offer.customer_company || EMPTY}
										</p>
										<span className='text-error-500 font-bold'>{offer.response_status}</span>
									</div>
									<p className='font-semibold text-foreground'>
										{t('components.offerDecision.currentPrice')}: {resolvedPrice || EMPTY}
									</p>
								</div>

								{!isInviteFlow ? (
									<>
								<div className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
											<Input
												placeholder={t('components.offerDecision.pricePlaceholder')}
												value={priceValue}
												onChange={(event) => handlePriceInput(event, setPriceValue)}
												disabled={!isCounterMode}
												type='text'
												inputMode='numeric'
												min='0'
												className='rounded-full border-none bg-muted/40'
											/>
											<Select
												value={currency || undefined}
												onValueChange={(value) => setCurrency(value as PriceCurrencyCode)}
												disabled={!isCounterMode}
											>
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
												disabled={!isCounterMode}
												className='bg-muted/40 shadow-none'
											/>
										</div>

										<div className='flex max-sm:flex-col justify-end gap-3'>
											{!isCounterMode ? (
												<Button
													onClick={handleAccept}
													disabled={isLoadingAcceptOffer || !offer}
													className='rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60'
												>
													{t('components.offerDecision.accept')}
												</Button>
											) : null}
											<Button
												onClick={handleCounter}
												disabled={isCounterMode && isCounterDisabled}
												className='rounded-full bg-warning-400 text-white hover:bg-warning-500 disabled:opacity-60'
											>
												{isCounterMode ? t('components.offerDecision.send') : t('components.offerDecision.counter')}
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
										<Button
											onClick={handleDeclineInvite}
											disabled={!inviteToken || isLoadingDecline}
											variant='destructive'
											className='rounded-full'
										>
											{t('components.offerDecision.reject')}
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
