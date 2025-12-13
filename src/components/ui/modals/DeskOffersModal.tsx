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
import { formatDateValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
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

const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function DeskOffersModal({ cargoUuid, open, onOpenChange }: DeskOffersModalProps) {
    const [activeTab, setActiveTab] = useState<'incoming' | 'accepted'>('incoming')
    const [formState, setFormState] = useState<Record<number, OfferFormState>>({})

    const { data, isLoading } = useGetOffers(cargoUuid ? { cargo_uuid: cargoUuid } : undefined, { enabled: Boolean(cargoUuid) })
    const { acceptOffer, isLoadingAccept } = useAcceptOffer()
    const { rejectOffer, isLoadingReject } = useRejectOffer()
    const { counterOffer, isLoadingCounter } = useCounterOffer()

    const offers = data?.results ?? []
    const incomingOffers = offers.filter((offer) => !offer.accepted_by_customer)
    const acceptedOffers = offers.filter((offer) => offer.accepted_by_customer)

    const cargoInfo = offers[0]
        ? {
              origin: `${offers[0].origin_city}, ${offers[0].origin_country}`,
              originDate: formatDateValue(offers[0].load_date, 'dd MMM, EEE', '-'),
              destination: `${offers[0].destination_city}, ${offers[0].destination_country}`,
              destinationDate: formatDateValue(offers[0].delivery_date, 'dd MMM, EEE', '-'),
              transport: TransportSelect.find((type) => type.type === offers[0].transport_type)?.name ?? offers[0].transport_type,
              weight: offers[0].weight_t ? formatWeightValue(offers[0].weight_t) : '-'
          }
        : null

    const renderOfferCard = (offer: IOfferShort, isReadOnly = false) => {
        const priceCurrency = offer.price_currency as PriceCurrencyCode
        const form = formState[offer.id] ?? {}
        const isCounterDisabled = !form.price || !form.currency || isLoadingCounter

        return (
            <div key={offer.id} className='space-y-4 rounded-2xl border border-border p-5'>
                <div className='flex flex-wrap items-start justify-between gap-3 text-sm'>
                    <div className='space-y-1'>
                        <p className='font-semibold text-foreground'>{offer.carrier_full_name || '—'}</p>
                        <p className='text-muted-foreground'>
                            <span className='font-semibold text-foreground'>Компания: </span>
                            {offer.carrier_company || '—'}
                        </p>
                    </div>
                    <div className='space-y-1 text-right text-sm text-muted-foreground'>
                        {offer.carrier_rating !== null && offer.carrier_rating !== undefined ? (
                            <p>
                                <span className='font-semibold text-foreground'>Рейтинг: </span>
                                {offer.carrier_rating}
                            </p>
                        ) : null}
                        <p className='font-semibold text-foreground'>
                            Предложение: {formatCurrencyValue(offer.price_value, priceCurrency)}
                            {offer.price_per_km ? (
                                <span className='text-muted-foreground'> ({formatCurrencyPerKmValue(offer.price_per_km, priceCurrency)})</span>
                            ) : null}
                        </p>
                    </div>
                </div>

                {!isReadOnly && (
                    <>
                        <div className='grid gap-3 pt-2 md:grid-cols-3'>
                            <Select
                                value={form.paymentMethod}
                                onValueChange={(value) =>
                                    setFormState((prev) => ({ ...prev, [offer.id]: { ...prev[offer.id], paymentMethod: value } }))
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
                                    setFormState((prev) => ({ ...prev, [offer.id]: { ...prev[offer.id], currency: value as PriceCurrencyCode } }))
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
                                    setFormState((prev) => ({ ...prev, [offer.id]: { ...prev[offer.id], price: event.target.value } }))
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
                                    counterOffer({ id: String(offer.id), data: { price_value: form.price, price_currency: form.currency } })
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
                            <TabsList className='flex w-full justify-center gap-8 border-b bg-transparent p-0'>
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
                                    incomingOffers.map((offer) => renderOfferCard(offer))
                                ) : (
                                    <p className='py-6 text-center text-muted-foreground'>Нет входящих предложений.</p>
                                )}
                            </TabsContent>

                            <TabsContent value='accepted' className='space-y-4'>
                                {acceptedOffers.length ? (
                                    acceptedOffers.map((offer) => renderOfferCard(offer, true))
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
