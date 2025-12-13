"use client"

import { ArrowRight, Link2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Input } from '@/components/ui/form-control/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGenerateLoadInvite } from '@/hooks/queries/loads/useGenerateLoadInvite'
import { useInviteOffer } from '@/hooks/queries/offers/useAction/useInviteOffer'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import { useGetOffers } from '@/hooks/queries/offers/useGet/useGetOffers'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import type { ICargoList } from '@/shared/types/CargoList.interface'
import type { IOfferShort } from '@/shared/types/Offer.interface'

interface DeskOfferModalProps {
    cargoUuid?: string
    selectedRow?: ICargoList
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

type OfferFormState = {
    paymentMethod?: string
    currency?: PriceCurrencyCode
    price?: string
}

const currencyOptions: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function DeskOfferModal({ cargoUuid, selectedRow, open, onOpenChange }: DeskOfferModalProps) {
    const [activeTab, setActiveTab] = useState<'incoming' | 'accepted'>('incoming')
    const [formState, setFormState] = useState<Record<number, OfferFormState>>({})
    const [shareCopyStatus, setShareCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
    const [carrierId, setCarrierId] = useState('')

    const cargoUuidValue = cargoUuid ?? selectedRow?.uuid
    const { data, isLoading } = useGetOffers(cargoUuidValue ? { cargo_uuid: cargoUuidValue } : undefined, { enabled: Boolean(cargoUuidValue) })
    const { acceptOffer, isLoadingAccept } = useAcceptOffer()
    const { rejectOffer, isLoadingReject } = useRejectOffer()
    const { counterOffer, isLoadingCounter } = useCounterOffer()
    const { generateLoadInvite, invite, isLoadingGenerate, resetInvite } = useGenerateLoadInvite()
    const { inviteOffer, isLoadingInvite } = useInviteOffer()

    const offers = data?.results ?? []
    const incomingOffers = offers.filter(
        (offer) => !offer.accepted_by_logistic && !offer.accepted_by_carrier && !offer.accepted_by_customer,
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
        }
        : null

    const shareLink = invite?.token ? `${window.location.origin}${DASHBOARD_URL.desk(`invite/${invite.token}`)}` : ''

    const handleModalOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setShareCopyStatus('idle')
            resetInvite()
        }
        onOpenChange?.(isOpen)
    }

    const handleInviteCarrier = () => {
        if (!offers[0]?.id) {
            toast.error('Не найден груз для приглашения перевозчика.')
            return
        }

        const parsedCarrierId = Number(carrierId)
        if (!carrierId || Number.isNaN(parsedCarrierId)) {
            toast.error('Введите корректный ID перевозчика.')
            return
        }

        inviteOffer(
            {
                cargo: offers[0].id,
                carrier_id: parsedCarrierId,
                price_currency: offers[0].price_currency ?? 'UZS',
                price_value: offers[0].price_value ?? undefined,
            },
            { onSuccess: () => setCarrierId('') },
        )
    }

    const handleGenerateInviteLink = () => {
        if (!offers[0]?.cargo_uuid) {
            toast.error('Не удалось получить данные объявления.')
            return
        }
        generateLoadInvite(offers[0].cargo_uuid)
    }

    const handleCopyShareLink = async () => {
        if (!shareLink) {
            toast.error('Сгенерируйте ссылку, чтобы её скопировать.')
            return
        }

        try {
            await navigator.clipboard.writeText(shareLink)
            setShareCopyStatus('copied')
            toast.success('Ссылка скопирована.')
        } catch (error) {
            console.error(error)
            setShareCopyStatus('error')
            toast.error('Не удалось скопировать ссылку.')
        }
    }

    const renderOfferCard = (offer: IOfferShort, mode: 'incoming' | 'accepted') => {
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

                <div className='grid gap-3 pt-2 md:grid-cols-3'>
                    <Select
                        value={form.paymentMethod}
                        onValueChange={(value) => setFormState((prev) => ({ ...prev, [offer.id]: { ...prev[offer.id], paymentMethod: value } }))}
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
                        onChange={(event) => setFormState((prev) => ({ ...prev, [offer.id]: { ...prev[offer.id], price: event.target.value } }))}
                        placeholder='Введите цену'
                        className='w-full rounded-full border-none bg-muted/40 text-sm font-medium text-foreground placeholder:text-muted-foreground'
                    />
                </div>

                <div className='flex justify-end gap-3 pt-4'>
                    {mode === 'incoming' ? (
                        <>
                            <Button
                                className='rounded-full bg-success-400 text-white hover:bg-success-500 disabled:opacity-60'
                                onClick={() => {
                                    if (!form.price || !form.currency) return
                                    counterOffer({ id: String(offer.id), data: { price_value: form.price, price_currency: form.currency } })
                                }}
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
                                onClick={() => {
                                    if (!form.price || !form.currency) return
                                    counterOffer({ id: String(offer.id), data: { price_value: form.price, price_currency: form.currency } })
                                }}
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
        <Dialog open={open} onOpenChange={handleModalOpenChange}>
            <DialogContent className='max-w-[900px] rounded-3xl'>
                <DialogHeader className='pb-6 text-center'>
                    <DialogTitle className='text-center text-2xl font-bold'>Предложения</DialogTitle>
                </DialogHeader>

                {!cargoUuidValue ? (
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

                        <div className='space-y-3 border-t pt-4'>
                            <div className='space-y-2'>
                                <p className='text-sm font-semibold text-foreground'>Пригласить перевозчика по ID</p>
                                <InputGroup className='bg-background'>
                                    <InputGroupInput
                                        type='number'
                                        value={carrierId}
                                        onChange={(event) => setCarrierId(event.target.value)}
                                        placeholder='Введите ID перевозчика'
                                    />
                                    <InputGroupAddon align='inline-end'>
                                        <Button
                                            size='sm'
                                            variant='ghost'
                                            className='flex items-center gap-2'
                                            type='button'
                                            onClick={handleInviteCarrier}
                                            disabled={isLoadingInvite}
                                        >
                                            {isLoadingInvite ? 'Отправка...' : 'Пригласить'}
                                            <Link2 className='size-4' />
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>

                            <p className='text-sm font-semibold text-foreground'>Приглашение по ссылке</p>
                            <p className='text-sm text-muted-foreground'>Сгенерируйте ссылку и отправьте партнёру.</p>
                            <InputGroup className='bg-background'>
                                <InputGroupInput readOnly value={shareLink} placeholder='Ссылка появится после генерации' />
                                <InputGroupAddon align='inline-end'>
                                    <Button
                                        size='sm'
                                        variant='ghost'
                                        className='flex items-center gap-2'
                                        type='button'
                                        onClick={shareLink ? handleCopyShareLink : handleGenerateInviteLink}
                                        disabled={isLoadingGenerate}
                                    >
                                        {shareLink ? 'Скопировать ссылку' : isLoadingGenerate ? 'Создаём...' : 'Сгенерировать ссылку'}
                                        <Link2 className='size-4' />
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                            {shareCopyStatus === 'copied' && <p className='text-sm text-success-500'>Ссылка скопирована в буфер обмена.</p>}
                            {shareCopyStatus === 'error' && <p className='text-sm text-error-500'>Не удалось скопировать ссылку.</p>}
                        </div>

                        <div className='flex gap-3 md:justify-end max-md:flex-col'>
                            <DialogClose asChild>
                                <Button className='bg-destructive text-white hover:bg-destructive/90 max-md:w-full' type='button'>
                                    Отменить
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
