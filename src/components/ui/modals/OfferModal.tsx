'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
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
import { useCreateOffer } from '@/hooks/queries/offers/useCreateOffer'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { cn } from '@/lib/utils'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { formatPriceValue } from '@/lib/formatters'


type OfferRow = ICargoList & { id?: number }
type CurrencyCode = NonNullable<ICargoList['price_currency']>

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
	title = 'Контрпредложение'
}: OfferModalProps) {
	const { createOffer, isLoadingCreate } = useCreateOffer()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{!isAction && (
				<DialogTrigger asChild>
					<Button className={cn('bg-brand text-white', className)} disabled={!selectedRow}>
						Сделать предложение
					</Button>
				</DialogTrigger>
			)}

			<DialogContent className='w-[900px] lg:max-w-none'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>{title}</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='text-center text-muted-foreground py-6'>
						Выберите запись, чтобы отправить предложение.
					</p>
				) : (
					<OfferDetails
						key={selectedRow.uuid}
						selectedRow={selectedRow}
						createOffer={createOffer}
						isLoadingCreate={isLoadingCreate}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}

type OfferDetailsProps = {
	selectedRow: OfferRow
	createOffer: ReturnType<typeof useCreateOffer>['createOffer']
	isLoadingCreate: boolean
}

function OfferDetails({ selectedRow, createOffer, isLoadingCreate }: OfferDetailsProps) {
	const [priceValue, setPriceValue] = useState(() =>
		selectedRow.price_value ? String(selectedRow.price_value) : '',
	)
	const [currency, setCurrency] = useState<CurrencyCode | ''>(() => selectedRow.price_currency ?? '')
	const cargoId = selectedRow.id

	const transportName = getTransportName(selectedRow.transport_type) || '—'
	const formattedPrice = formatCurrencyValue(selectedRow.price_value, selectedRow.price_currency)
	const formattedPricePerKm = formatCurrencyPerKmValue(selectedRow.price_per_km, selectedRow.price_currency)

	const isCounterDisabled = !cargoId || !priceValue || !currency || isLoadingCreate
	const isAcceptDisabled =
		!cargoId || !selectedRow.price_value || !selectedRow.price_currency || isLoadingCreate

	const handleCurrencyChange = (value: string) => setCurrency(value as CurrencyCode)

	const handleCounterOffer = () => {
		if (isCounterDisabled || !cargoId) return

		createOffer({
			cargo: cargoId,
			price_value: priceValue,
			price_currency: currency as NonNullable<ICargoList['price_currency']>,
		})
	}


	return (
		<div className='space-y-6'>
			<div className='flex flex-col'>
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
							{formatPriceValue(selectedRow.price_value, selectedRow.price_currency)}, ({formatCurrencyPerKmValue(selectedRow.price_per_km)})
						</p>
					</div>
				</div>

				<div className='flex flex-col pt-6 md:flex-row gap-3'>
					<Input
						placeholder='Введите сумму'
						value={priceValue}
						onChange={(event) => setPriceValue(event.target.value)}
						inputMode='decimal'
						type='number'
					/>
					<Select value={currency || undefined} onValueChange={handleCurrencyChange}>
						<SelectTrigger className='w-full rounded-full border-none shadow-none bg-grayscale-50'>
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
				</div>

				<div className='flex max-md:flex-col md:justify-end gap-3 mt-6'>
					<Button
						className='bg-success-400 text-white hover:bg-success-500 max-md:w-full max-md:order-2'
						onClick={handleCounterOffer}
						disabled={isCounterDisabled}
					>
						Предложить
					</Button>
					<DialogClose asChild>
						<Button className='bg-error-400 text-white hover:bg-error-500 max-md:w-full max-md:order-3'>
							Закрыть
						</Button>
					</DialogClose>
				</div>
			</div>
		</div>
	)
}
