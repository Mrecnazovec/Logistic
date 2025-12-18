"use client"

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import { useGetOffers } from '@/hooks/queries/offers/useGet/useGetOffers'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatWeightValue } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { ProfileLink } from '../actions/ProfileLink'
import { PaymentSelector } from '../selectors/PaymentSelector'

interface DeskOffersModalProps {
    cargoUuid?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

type OfferFormState = {
    paymentMethod?: PaymentMethodEnum | ''
    currency?: PriceCurrencyCode
    price?: string
}

const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function DeskOffersModal({ cargoUuid, open, onOpenChange }: DeskOffersModalProps) {
    const [activeTab, setActiveTab] = useState<'incoming' | 'accepted'>('incoming')
    const [formState, setFormState] = useState<Record<number, OfferFormState>>({})

    const { data, isLoading } = useGetOffers(cargoUuid ? { cargo_uuid: cargoUuid } : undefined, { enabled: Boolean(cargoUuid) })
    const { acceptOffer, isLoadingAccept } = useAcceptOffer()
    const { rejectOffer, isLoadingReject } = useRejectOffer()
    const { counterOffer, isLoadingCounter } = useCounterOffer()

    const offers = data?.results ?? []
    const incomingOffers = offers.filter(
        (offer) => !offer.accepted_by_customer && !offer.accepted_by_logistic && !offer.accepted_by_carrier
    )
    const acceptedOffers = offers.filter((offer) => offer.accepted_by_logistic || offer.accepted_by_carrier)

    const cargoInfo = offers[0]
        ? {
            origin: `${offers[0].origin_city}, ${offers[0].origin_country}`,
            originDate: formatDateValue(offers[0].load_date, 'dd MMM, EEE', '-'),
            destination: `${offers[0].destination_city}, ${offers[0].destination_country}`,
            destinationDate: formatDateValue(offers[0].delivery_date, 'dd MMM, EEE', '-'),
            transport: TransportSelect.find((type) => type.type === offers[0].transport_type)?.name ?? offers[0].transport_type,
            weight: offers[0].weight_t ? formatWeightValue(offers[0].weight_t) : '-',
            route_km: offers[0].route_km
        }
        : null

    const renderOfferCard = (offer: IOfferShort, mode: 'incoming' | 'accepted') => {
        const priceCurrency = offer.price_currency as PriceCurrencyCode
        const defaultForm: OfferFormState = {
            paymentMethod: (offer.payment_method as PaymentMethodEnum) || '',
            currency: priceCurrency,
            price: offer.price_value ?? ''
        }
        const form = { ...defaultForm, ...formState[offer.id] }
        const isCounterDisabled = !form.price || !form.currency || !form.paymentMethod || isLoadingCounter

        const updateForm = (next: Partial<OfferFormState>) =>
            setFormState((prev) => ({
                ...prev,
                [offer.id]: { ...defaultForm, ...prev[offer.id], ...next }
            }))

        const handleCounterOffer = () => {
            if (isCounterDisabled) return
            counterOffer({
                id: String(offer.id),
                data: { price_value: form.price as string, price_currency: form.currency as PriceCurrencyCode }
            })
        }

        return (
            <div key={offer.id} className='space-y-4'>
                <div className='flex flex-wrap items-start justify-between gap-3 text-sm'>
                    <div className='space-y-1'>
                        <p className='font-semibold text-foreground'><ProfileLink name={offer.carrier_full_name} id={offer.carrier_id} />

                        </p>
                        <p className='text-muted-foreground'>
                            <span className='font-semibold text-foreground'>Компания: </span>
                            {offer.carrier_company || '—'}
                        </p>
                        <span className='text-error-500 font-bold'>{offer.response_status}</span>
                    </div>
                    <div className='space-y-1 text-right text-sm text-muted-foreground'>
                        {offer.carrier_rating !== null && offer.carrier_rating !== undefined ? (
                            <p>
                                <span className='font-semibold text-foreground'>Рейтинг: </span>
                                {offer.carrier_rating}
                            </p>
                        ) : null}
                        <p className='font-semibold text-foreground text-start'>
                            Цена: {formatCurrencyValue(offer.price_value, priceCurrency)}
                            {offer.price_per_km ? (
                                <span className='text-muted-foreground'> ({formatCurrencyPerKmValue(offer.price_per_km, priceCurrency)})</span>
                            ) : null}
                        </p>
                    </div>
                </div>

                <div className='grid gap-3 pt-2 md:grid-cols-[1fr_auto_auto]'>
                    <Input
                        type='number'
                        inputMode='decimal'
                        min='0'
                        step='0.01'
                        value={form.price ?? ''}
                        onChange={(event) => updateForm({ price: event.target.value })}
                        placeholder='Введите цену'
                        className='w-full rounded-full border-none bg-muted/40 placeholder:text-muted-foreground'
                    />


                    <Select
                        value={form.currency}
                        onValueChange={(value) => updateForm({ currency: value as PriceCurrencyCode })}
                    >
                        <SelectTrigger className={cn(
                            'w-full rounded-full bg-grayscale-50 border-none ',
                            '*:data-[slot=select-value]:text-black',
                        )}>
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

                    <PaymentSelector
                        value={form.paymentMethod}
                        onChange={(value) => updateForm({ paymentMethod: value })}
                        placeholder='Способ оплаты'
                        className='bg-muted/40 shadow-none [&>button]:border-none [&>button]:bg-transparent'
                    />


                </div>

                <div className='flex justify-end gap-3 pt-4 max-sm:flex-col '>
                    {mode === 'incoming' ? (
                        <>
                            <Button
                                className='rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60'
                                onClick={handleCounterOffer}
                                disabled={isCounterDisabled}
                            >
                                Контрпредложение
                            </Button>
                            <Button
                                className='rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60'
                                onClick={() => rejectOffer(String(offer.id))}
                                disabled={isLoadingReject}
                            >
                                Отказать
                            </Button></>
                    ) : (
                        <>
                            <Button
                                className='rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60'
                                onClick={() => acceptOffer(String(offer.id))}
                                disabled={isLoadingAccept}
                            >
                                Принять
                            </Button>
                            <Button
                                className='rounded-full bg-warning-400 text-white hover:bg-warning-500 disabled:opacity-60'
                                onClick={handleCounterOffer}
                                disabled={isCounterDisabled}
                            >
                                Торговаться
                            </Button>
                            <Button
                                className='rounded-full bg-error-400 text-white hover:bg-error-500 disabled:opacity-60'
                                onClick={() => rejectOffer(String(offer.id))}
                                disabled={isLoadingReject}
                            >
                                Отказать
                            </Button>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className='pb-6 text-center'>
                    <DialogTitle className='text-center text-2xl font-bold'>Предложения</DialogTitle>
                </DialogHeader>

                {!cargoUuid ? (
                    <p className='py-10 text-center text-muted-foreground'>Выберите груз, чтобы увидеть предложения.</p>
                ) : isLoading ? (
                    <p className='py-10 text-center text-muted-foreground'>Загружаем предложения...</p>
                ) : offers.length === 0 ? (
                    <p className='py-10 text-center text-muted-foreground'>Предложений пока нет.</p>
                ) : (
                    <div className='space-y-6'>
                        {cargoInfo && (
                            <div className='flex flex-wrap items-start justify-between gap-6 border-b pb-6'>
                                <div>
                                    <p className='font-semibold text-foreground'>{cargoInfo.origin}</p>
                                    <p className='text-sm text-muted-foreground'>{cargoInfo.originDate}</p>
                                </div>
                                <div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
                                    <ArrowRight className='mb-1 size-5' />
                                    {cargoInfo.route_km}
                                </div>
                                <div>
                                    <p className='font-semibold text-foreground'>{cargoInfo.destination}</p>
                                    <p className='text-sm text-muted-foreground'>{cargoInfo.destinationDate}</p>
                                </div>
                                <div className='space-y-1 text-sm text-muted-foreground'>
                                    <p>
                                        <span className='font-semibold text-foreground'>Тип транспорта: </span>
                                        {cargoInfo.transport}
                                    </p>
                                    <p>
                                        <span className='font-semibold text-foreground'>Вес: </span>
                                        {cargoInfo.weight}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'incoming' | 'accepted')} className='space-y-4'>
                            <TabsList className='flex w-full justify-center gap-8 border-b bg-transparent p-0 overflow-x-auto'>
                                <TabsTrigger
                                    value='incoming'
                                    className='rounded-none border-2 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground'
                                >
                                    Входящие
                                </TabsTrigger>
                                <TabsTrigger
                                    value='accepted'
                                    className='rounded-none border-2 bg-transparent text-base font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-brand data-[state=active]:text-foreground'
                                >
                                    Принятые
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value='incoming' className='space-y-4'>
                                {incomingOffers.length ? (
                                    incomingOffers.map((offer) => renderOfferCard(offer, 'incoming'))
                                ) : (
                                    <p className='py-6 text-center text-muted-foreground'>Нет входящих предложений.</p>
                                )}
                            </TabsContent>

                            <TabsContent value='accepted' className='space-y-4'>
                                {acceptedOffers.length ? (
                                    acceptedOffers.map((offer) => renderOfferCard(offer, 'accepted'))
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
