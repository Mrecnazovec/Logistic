'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

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
import { cn } from '@/lib/utils'
import { useCreateOffer } from '@/hooks/queries/offers/useCreateOffer'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'

interface OfferModalProps {
	selectedRow?: ICargoList
	className?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
	isAction?: boolean
}

export function OfferModal({
	selectedRow,
	className,
	open,
	onOpenChange,
	isAction = false,
}: OfferModalProps) {
	const [priceValue, setPriceValue] = useState('')
	const [currency, setCurrency] = useState('')
	const { createOffer, isLoadingCreate } = useCreateOffer()

	const cargoId = (selectedRow as (ICargoList & { id?: number }) | undefined)?.id

	

	const transportName =
		selectedRow &&
		(TransportSelect.find((t) => t.type === selectedRow.transport_type)?.name ?? '—')

	useEffect(() => {
		if (!selectedRow) {
			setPriceValue('')
			setCurrency('')
			return
		}

		setPriceValue(selectedRow.price_value ? String(selectedRow.price_value) : '')
		setCurrency(selectedRow.price_currency ?? '')
	}, [selectedRow])

	const isCounterDisabled = !cargoId || !priceValue || !currency || isLoadingCreate

	const isAcceptDisabled =
		!cargoId || !selectedRow?.price_value || !selectedRow?.price_currency || isLoadingCreate

	const handleCounterOffer = () => {
		if (isCounterDisabled || !cargoId) return

		createOffer({
			cargo: cargoId,
			price_value: priceValue,
			price_currency: currency as NonNullable<ICargoList['price_currency']>,
		})
	}

	const handleAcceptOffer = () => {
		if (isAcceptDisabled || !cargoId || !selectedRow?.price_value || !selectedRow?.price_currency) return

		createOffer({
			cargo: cargoId,
			price_value: selectedRow.price_value,
			price_currency: selectedRow.price_currency,
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{!isAction && (
				<DialogTrigger asChild>
					<Button className={cn('bg-brand text-white', className)} disabled={!selectedRow}>
						Сделать предложение
					</Button>
				</DialogTrigger>
			)}

			<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>Предложить</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='text-center text-muted-foreground py-6'>Не выбрано ни одного объявления.</p>
				) : (
					<div className='space-y-6'>
						<div key={selectedRow.uuid} className='flex flex-col'>
							<div className='flex justify-between gap-6 items-center border-b-2 pb-6 flex-wrap'>
								<div>
									<p>
										{selectedRow.origin_city}, {selectedRow.origin_country}
									</p>
									<p>{format(selectedRow.load_date, 'dd.MM.yyyy', { locale: ru })}</p>
								</div>
								<div className='flex flex-col items-center justify-center gap-3'>
									<ArrowLeftRight className='size-5' />
									<p>{selectedRow.origin_dist_km} км</p>
								</div>
								<div>
									<p>
										{selectedRow.destination_city}, {selectedRow.destination_country}
									</p>
									<p>
										{selectedRow.delivery_date
											? format(selectedRow.delivery_date, 'dd.MM.yyyy', { locale: ru })
											: '-'}
									</p>
								</div>
								<div>
									<p>Тип: {transportName}</p>
									<p>Вес: {selectedRow.weight_t} тонн</p>
									<p>
										Цена: {selectedRow.price_value} {selectedRow.price_currency}
									</p>
									<p>({selectedRow.price_per_km} на км)</p>
								</div>
							</div>

							<div className='flex justify-between gap-6 items-center border-b-2 py-6'>
								<div>
									<p>
										<span className='font-semibold'>Компания: </span>
										{selectedRow.company_name}
									</p>
								</div>
								<div>
									<p>
										<span className='font-semibold'>Предложение: </span>
										{selectedRow.price_value} {selectedRow.price_currency} ({selectedRow.price_per_km} на км)
									</p>
								</div>
							</div>

							<div className='flex flex-col pt-6 md:flex-row gap-3'>
								<Input
									placeholder='Введите цену'
									value={priceValue}
									onChange={(event) => setPriceValue(event.target.value)}
									inputMode='decimal'
									type='number'
								/>
								<Select value={currency || undefined} onValueChange={setCurrency}>
									<SelectTrigger className='w-full rounded-full border-none shadow-none bg-grayscale-50'>
										<SelectValue placeholder='Выберите валюту' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='UZS'>UZS</SelectItem>
										<SelectItem value='USD'>USD</SelectItem>
										<SelectItem value='EUR'>EUR</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='flex max-md:flex-col md:justify-end gap-3 mt-6'>
								<Button
									className='bg-warning-400 text-white hover:bg-warning-500 max-md:w-full max-md:order-2'
									onClick={handleCounterOffer}
									disabled={isCounterDisabled}
								>
									Торговать
								</Button>
								<Button
									className='bg-success-400 text-white hover:bg-success-500 max-md:w-full max-md:order-1'
									onClick={handleAcceptOffer}
									disabled={isAcceptDisabled}
								>
									Принять
								</Button>
								<DialogClose asChild>
									<Button className='bg-error-400 text-white hover:bg-error-500 max-md:w-full max-md:order-3'>
										Назад
									</Button>
								</DialogClose>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
