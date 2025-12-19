"use client"

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { useCreateOffer } from '@/hooks/queries/offers/useCreateOffer'
import { formatCurrencyPerKmValue } from '@/lib/currency'
import { formatPriceValue } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { PriceCurrencyEnum } from '@/shared/enums/PriceCurrency.enum'

type OfferRow = ICargoList & { id?: number }
type CurrencyCode = PriceCurrencyEnum

interface OfferModalProps {
    selectedRow?: OfferRow
    className?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
    isAction?: boolean
    title?: string
}

const currencyOptions: CurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']

export function OfferModal({
    selectedRow,
    className,
    open,
    onOpenChange,
    isAction = false,
    title = 'Создать предложение',
}: OfferModalProps) {
    const { createOffer, isLoadingCreate } = useCreateOffer()
    const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({})
    const [currencyDrafts, setCurrencyDrafts] = useState<Record<string, CurrencyCode | ''>>({})
    const [paymentDrafts, setPaymentDrafts] = useState<Record<string, PaymentMethodEnum | ''>>({})

    const priceValue = selectedRow
        ? priceDrafts[selectedRow.uuid] ?? (selectedRow.price_value ? String(selectedRow.price_value) : '')
        : ''
    const currency = selectedRow
        ? currencyDrafts[selectedRow.uuid] ?? (selectedRow.price_currency ?? '')
        : ''
    const paymentMethod = selectedRow
        ? paymentDrafts[selectedRow.uuid] ??
          (((selectedRow as { payment_method?: PaymentMethodEnum }).payment_method as PaymentMethodEnum | undefined) ?? '')
        : ''

    const cargoId = selectedRow?.id
    const transportName = selectedRow ? getTransportName(selectedRow.transport_type) || '-' : '-'
    const isCounterDisabled = !cargoId || !priceValue || !currency || !paymentMethod || isLoadingCreate

    const handleCounterOffer = () => {
        if (isCounterDisabled || !cargoId || !selectedRow?.uuid) return

        createOffer({
            cargo: cargoId,
            price_value: priceValue,
            price_currency: currency as NonNullable<ICargoList['price_currency']>,
            payment_method: paymentMethod as PaymentMethodEnum,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!isAction && (
                <DialogTrigger asChild>
                    <Button className={cn('bg-brand text-white', className)} disabled={!selectedRow}>
                        Создать предложение
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className='w-[900px] lg:max-w-none'>
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-bold'>{title}</DialogTitle>
                </DialogHeader>

                {!selectedRow ? (
                    <p className='py-6 text-center text-muted-foreground'>
                        Выберите запись, чтобы отправить предложение.
                    </p>
                ) : (
                    <div className='flex flex-col space-y-6' key={selectedRow.uuid}>
                        <div className='flex flex-wrap items-start justify-between gap-6 border-b pb-6'>
                            <div>
                                <p className='font-semibold text-foreground'>
                                    {selectedRow.origin_city}, {selectedRow.origin_country}
                                </p>
                                <p className='text-sm text-muted-foreground'>{selectedRow.load_date}</p>
                            </div>
                            <div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
                                <ArrowRight className='mb-1 size-5' />
                                {selectedRow.route_km}
                            </div>
                            <div>
                                <p className='font-semibold text-foreground'>
                                    {selectedRow.destination_city}, {selectedRow.destination_country}
                                </p>
                                <p className='text-sm text-muted-foreground'>{selectedRow.delivery_date}</p>
                            </div>
                            <div className='space-y-1 text-sm text-muted-foreground'>
                                <p>
                                    <span className='font-semibold text-foreground'>Тип транспорта: </span>
                                    {transportName}
                                </p>
                                <p>
                                    <span className='font-semibold text-foreground'>Вес: </span>
                                    {selectedRow.weight_t}
                                </p>
                                <p>
                                    <span className='font-semibold text-foreground'>Цена: </span>
                                    {formatPriceValue(selectedRow.price_value, selectedRow.price_currency)}, (
                                    {formatCurrencyPerKmValue(selectedRow.price_per_km)})
                                </p>
                            </div>
                        </div>

                        <div className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
                            <Input
                                placeholder='Укажите сумму'
                                value={priceValue}
                                onChange={(event) =>
                                    selectedRow?.uuid &&
                                    setPriceDrafts((prev) => ({ ...prev, [selectedRow.uuid]: event.target.value }))
                                }
                                inputMode='decimal'
                                type='number'
                            />
                            <Select
                                value={currency || undefined}
                                onValueChange={(value) =>
                                    selectedRow?.uuid && setCurrencyDrafts((prev) => ({ ...prev, [selectedRow.uuid]: value as CurrencyCode }))
                                }
                            >
                                <SelectTrigger className='w-full rounded-full border-none bg-grayscale-50 shadow-none'>
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
                            <PaymentSelector
                                value={paymentMethod}
                                onChange={(value) =>
                                    selectedRow?.uuid && setPaymentDrafts((prev) => ({ ...prev, [selectedRow.uuid]: value }))
                                }
                            />
                        </div>

                        <div className='mt-6 flex gap-3 max-md:flex-col md:justify-end'>
                            <Button
                                className='bg-success-400 text-white hover:bg-success-500 max-md:order-2 max-md:w-full'
                                onClick={handleCounterOffer}
                                disabled={isCounterDisabled}
                            >
                                Отправить
                            </Button>
                            <DialogClose asChild>
                                <Button className='bg-error-400 text-white hover:bg-error-500 max-md:order-3 max-md:w-full'>
                                    Закрыть
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
