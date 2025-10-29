'use client'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
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
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowLeftRight } from 'lucide-react'

interface OfferModalProps {
	selectedRow?: ICargoList
	className?: string
}

export function OfferModal({ selectedRow, className }: OfferModalProps) {
	const transportName =
		selectedRow &&
		(TransportSelect.find((t) => t.type === selectedRow.transport_type)?.name ?? '—')

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className={cn('bg-brand text-white', className)}
					disabled={!selectedRow}
				>
					Сделать предложение
				</Button>
			</DialogTrigger>

			<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>
						Предложить
					</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='text-center text-muted-foreground py-6'>
						Не выбрано ни одного объявления.
					</p>
				) : (
					<div className='space-y-6'>
						<div
							key={selectedRow.id}
							className='flex flex-col'
						>
							<div className='flex justify-center gap-6 items-center border-b-2 pb-6 flex-wrap'>
								<div className='flex justify-between gap-6 items-center'>
									<div>
										<p>
											{selectedRow.origin_city}, {selectedRow.origin_country}
										</p>
										<p>
											{format(selectedRow.load_date, 'dd.MM.yyyy', { locale: ru })}
										</p>
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
										{selectedRow.price_value} {selectedRow.price_currency} (
										{selectedRow.price_per_km} на км)
									</p>
								</div>
							</div>

							<div className='flex flex-col pt-6 md:flex-row gap-3'>
								<Input placeholder='Введите цену' />
								<Select>
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
								<Button className='bg-yellow-500 text-white hover:bg-yellow-600 max-md:w-full max-md:order-2'>
									Торговать
								</Button>
								<Button className='bg-green-600 text-white hover:bg-green-700 max-md:w-full max-md:order-1'>
									Принять
								</Button>
								<DialogClose asChild>
									<Button className='bg-red-600 text-white hover:bg-red-700 max-md:w-full max-md:order-3'>
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
