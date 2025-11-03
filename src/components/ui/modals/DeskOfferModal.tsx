'use client'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowLeftRight, Search, Settings2 } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../form-control/InputGroup'

interface OfferModalProps {
	selectedRow?: ICargoList
	className?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function DeskOfferModal({ selectedRow, open, onOpenChange }: OfferModalProps) {
	const transportName =
		selectedRow &&
		(TransportSelect.find((t) => t.type === selectedRow.transport_type)?.name ?? '—')

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>
						Сделать предложение
					</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='text-center text-muted-foreground py-6'>
						Не выбрано ни одного объявления.
					</p>
				) : (
					<div className='space-y-6'>
						<div key={selectedRow.uuid} className='flex flex-col'>
							<div className='flex justify-between gap-6 items-center border-b-2 pb-6 flex-wrap'>
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
								<InputGroup>
									<InputGroupInput placeholder='Поиск по имени' />
									<InputGroupAddon className='pr-2'>
										<Search className='text-grayscale size-5' />
									</InputGroupAddon>
								</InputGroup>
								<Button variant={'outline'} className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand'>
									<Settings2 className='size-5' />
									Фильтр
								</Button>

							</div>

							<div className='flex max-md:flex-col md:justify-end gap-3 mt-6'>
								<DialogClose asChild>
									<Button className='bg-red-600 text-white hover:bg-red-700 max-md:w-full max-md:order-3'>
										Назад
									</Button>
								</DialogClose>
								<Button className='bg-brand text-white hover:bg-brand-900 max-md:w-full max-md:order-2'>
									Сделать предложение
								</Button>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

