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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { useCreateOffer } from '@/hooks/queries/offers/useCreateOffer'
import { useI18n } from '@/i18n/I18nProvider'
import { formatCurrencyPerKmValue } from '@/lib/currency'
import { formatPriceValue } from '@/lib/formatters'
import { formatPriceInputValue, handlePriceInput, normalizePriceValueForPayload } from '@/lib/InputValidation'
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
	title,
}: OfferModalProps) {
	const { t } = useI18n()
	const [internalOpen, setInternalOpen] = useState(false)
	const isControlled = typeof open === 'boolean'
	const resolvedOpen = isControlled ? open : internalOpen
	const handleOpenChange = (nextOpen: boolean) => {
		if (!isControlled) {
			setInternalOpen(nextOpen)
		}
		onOpenChange?.(nextOpen)
	}
	const resolvedTitle = title ?? t('components.offerModal.title')
	const { createOffer, isLoadingCreateOffer } = useCreateOffer()
	const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({})
	const [currencyDrafts, setCurrencyDrafts] = useState<Record<string, CurrencyCode | ''>>({})
	const [paymentDrafts, setPaymentDrafts] = useState<Record<string, PaymentMethodEnum | ''>>({})

	const priceValue = selectedRow
		? priceDrafts[selectedRow.uuid] ?? formatPriceInputValue(selectedRow.price_value ? String(selectedRow.price_value) : '')
		: ''
	const currency = selectedRow
		? currencyDrafts[selectedRow.uuid] ?? (selectedRow.price_currency ?? '')
		: ''
	const paymentMethod = selectedRow
		? paymentDrafts[selectedRow.uuid] ??
		(((selectedRow as { payment_method?: PaymentMethodEnum }).payment_method as PaymentMethodEnum | undefined) ?? '')
		: ''

	const cargoId = selectedRow?.id
	const transportName = selectedRow ? getTransportName(t, selectedRow.transport_type) || '-' : '-'
	const isCounterDisabled = !cargoId || !priceValue || !currency || !paymentMethod || isLoadingCreateOffer

	const handleCounterOffer = () => {
		if (isCounterDisabled || !cargoId || !selectedRow?.uuid) return

		createOffer(
			{
				cargo: cargoId,
				price_value: normalizePriceValueForPayload(priceValue) ?? '',
				price_currency: currency as NonNullable<ICargoList['price_currency']>,
				payment_method: paymentMethod as PaymentMethodEnum,
			},
			{
				onSuccess: () => handleOpenChange(false),
			},
		)
	}

	return (
		<Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
			{!isAction && (
				<DialogTrigger asChild>
					<Button className={cn('bg-brand text-white', className)} disabled={!selectedRow}>
						{resolvedTitle}
					</Button>
				</DialogTrigger>
			)}

			<DialogContent className='w-[900px] lg:max-w-none'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>{resolvedTitle}</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='py-6 text-center text-muted-foreground'>
						{t('components.offerModal.empty')}
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
									<span className='font-semibold text-foreground'>{t('components.offerModal.transportLabel')}: </span>
									{transportName}
								</p>
								<p>
									<span className='font-semibold text-foreground'>{t('components.offerModal.weightLabel')}: </span>
									{selectedRow.weight_t}
								</p>
								<p>
									<span className='font-semibold text-foreground'>{t('components.offerModal.priceLabel')}: </span>
									{formatPriceValue(selectedRow.price_value, selectedRow.price_currency)}, (
									{formatCurrencyPerKmValue(selectedRow.price_per_km)})
								</p>
							</div>
						</div>

						<div className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
							<Input
								placeholder={t('components.offerModal.pricePlaceholder')}
								value={priceValue}
								onChange={(event) =>
									selectedRow?.uuid &&
									handlePriceInput(event, (value) => setPriceDrafts((prev) => ({ ...prev, [selectedRow.uuid]: value })))
								}
								inputMode='numeric'
								type='text'
							/>
							<Select
								value={currency || undefined}
								onValueChange={(value) =>
									selectedRow?.uuid && setCurrencyDrafts((prev) => ({ ...prev, [selectedRow.uuid]: value as CurrencyCode }))
								}
							>
								<SelectTrigger className='w-full rounded-full border-none bg-grayscale-50 shadow-none *:data-[slot=select-value]:text-black'>
									<SelectValue placeholder={t('components.offerModal.currencyPlaceholder')} />
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
								{t('components.offerModal.submit')}
							</Button>
							<DialogClose asChild>
								<Button className='bg-error-400 text-white hover:bg-error-500 max-md:order-3 max-md:w-full'>
									{t('components.offerModal.close')}
								</Button>
							</DialogClose>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
