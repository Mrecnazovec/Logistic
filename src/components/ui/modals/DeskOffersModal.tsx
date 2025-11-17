'use client'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/shared/utils/currency'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowLeftRight } from 'lucide-react'

interface DeskOffersModalProps {
	selectedRow?: ICargoList
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function DeskOffersModal({ selectedRow, open, onOpenChange }: DeskOffersModalProps) {
	const transportName = selectedRow ? getTransportName(selectedRow.transport_type) || '—' : null

	const offers = selectedRow
		? Array.from({ length: 3 }).map((_, index) => {
			const originDate = new Date(selectedRow.load_date)
			const destinationDate = selectedRow.delivery_date ? new Date(selectedRow.delivery_date) : null
			const distanceValue = selectedRow.route_km ?? selectedRow.path_km
			const price = formatCurrencyValue(selectedRow.price_value, selectedRow.price_currency)
			const pricePerKm = selectedRow.price_per_km
				? formatCurrencyPerKmValue(selectedRow.price_per_km, selectedRow.price_currency)
				: ''

			return {
				id: `${selectedRow.uuid}-${index}`,
				loadDate: format(originDate, 'dd MMM, EEE', { locale: ru }),
				loadTime: format(originDate, 'HH:mm', { locale: ru }),
				deliveryDate: destinationDate ? format(destinationDate, 'dd MMM, EEE', { locale: ru }) : '-',
				deliveryTime: destinationDate ? format(destinationDate, 'HH:mm', { locale: ru }) : '-',
				distance: distanceValue ? `${distanceValue} км` : '—',
				price,
				pricePerKm,
				origin: `${selectedRow.origin_city}, ${selectedRow.origin_country}`,
				destination: `${selectedRow.destination_city}, ${selectedRow.destination_country}`,
				weight: selectedRow.weight_t ? `${selectedRow.weight_t} тонн` : '—',
				type: transportName ?? '—',
			}
		})
		: []

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>
						Предложения
					</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='text-center text-muted-foreground py-6'>
						Выберите груз, чтобы посмотреть предложения.
					</p>
				) : (
					<div className='space-y-6'>
						<Tabs defaultValue='received'>
							<TabsList className='bg-transparent w-full justify-start border-b border-border rounded-none px-0'>
								<TabsTrigger
									value='sent'
									className='flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none'
								>
									Отправленные
								</TabsTrigger>
								<TabsTrigger
									value='received'
									className='flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none'
								>
									Полученные
								</TabsTrigger>
							</TabsList>

							<TabsContent value='sent' className='mt-6'>
								<div className='space-y-6'>
									{offers.map((offer) => (
										<div key={offer.id} className='flex flex-col gap-6 border-b-2 pb-6 last:border-b-0'>
											<div className='flex flex-wrap items-center justify-between gap-6'>
												<div>
													<p>{offer.origin}</p>
													<p className='text-sm text-muted-foreground'>
														{offer.loadDate}, {offer.loadTime}
													</p>
												</div>

												<div className='flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground font-semibold'>
													<ArrowLeftRight className='size-5' />
													<span>{offer.distance}</span>
												</div>

												<div>
													<p>{offer.destination}</p>
													<p className='text-sm text-muted-foreground'>
														{offer.deliveryDate}, {offer.deliveryTime}
													</p>
												</div>

												<div className='text-sm text-muted-foreground'>
													<p>
														<span className='font-semibold text-foreground'>Тип: </span>
														{offer.type}
													</p>
													<p>
														<span className='font-semibold text-foreground'>Вес: </span>
														{offer.weight}
													</p>
													<p>
														<span className='font-semibold text-foreground'>Цена: </span>
														{offer.price}
													</p>
													{offer.pricePerKm && <p>({offer.pricePerKm})</p>}
												</div>
											</div>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value='received' className='mt-6'>
								<div className='space-y-6'>
									{offers.map((offer) => (
										<div key={`${offer.id}-received`} className='flex flex-col gap-6 border-b-2 pb-6 last:border-b-0'>
											<div className='flex flex-wrap items-center justify-between gap-6'>
												<div>
													<p>{offer.origin}</p>
													<p className='text-sm text-muted-foreground'>
														{offer.loadDate}, {offer.loadTime}
													</p>
												</div>

												<div className='flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground font-semibold'>
													<ArrowLeftRight className='size-5' />
													<span>{offer.distance}</span>
												</div>

												<div>
													<p>{offer.destination}</p>
													<p className='text-sm text-muted-foreground'>
														{offer.deliveryDate}, {offer.deliveryTime}
													</p>
												</div>

												<div className='text-sm text-muted-foreground'>
													<p>
														<span className='font-semibold text-foreground'>Тип: </span>
														{offer.type}
													</p>
													<p>
														<span className='font-semibold text-foreground'>Вес: </span>
														{offer.weight}
													</p>
													<p>
														<span className='font-semibold text-foreground'>Цена: </span>
														{offer.price}
													</p>
													{offer.pricePerKm && <p>({offer.pricePerKm})</p>}
												</div>
											</div>
										</div>
									))}
								</div>
							</TabsContent>
						</Tabs>

						<div className='flex justify-between border-t border-border pt-4 text-sm flex-wrap gap-4'>
							<p>
								<span className='font-semibold'>Компания: </span>
								{selectedRow.company_name ?? '—'}
							</p>
							<p>
								<span className='font-semibold'>Предложение: </span>
								{formatCurrencyValue(selectedRow.price_value, selectedRow.price_currency)} (
								{formatCurrencyPerKmValue(selectedRow.price_per_km, selectedRow.price_currency)})
							</p>
						</div>

						<div className='flex max-md:flex-col md:justify-end gap-3'>
							<Button className='bg-success-400 text-white hover:bg-success-500 max-md:w-full'>
								Принять
							</Button>
							<DialogClose asChild>
								<Button className='bg-error-400 text-white hover:bg-error-500 max-md:w-full'>
									Отказать
								</Button>
							</DialogClose>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
