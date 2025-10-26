'use client'

import { OfferModal } from '@/components/ui/modals/OfferModal'
import { ContactSelector } from '@/shared/enums/ContactPref.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export function ExpandedCargoRow({ cargo }: { cargo: ICargoList }) {
	const transportName = TransportSelect.find(t => t.type === cargo.transport_type)?.name ?? '—'

	const contactName = ContactSelector.find(t => t.type === cargo.contact_pref)?.name ?? '—'
	return (
		<div className='flex flex-col gap-4'>
			{/* Верхняя часть */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between'>
				<div>
					<p className='text-brand font-bold'>
						Рейтинг пользователя: <span className='text-black'>4.5</span> <span className='font-bold text-yellow-500'>★★★★☆</span>
					</p>
					<p className='font-bold'>
						Наименование груза: <span className='text-foreground font-semibold'>{cargo.product}</span>
					</p>
				</div>
			</div>

			{/* Детали */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-12 text-sm'>
				<div className='space-y-3'>
					<p className='font-medium text-brand'>Откуда</p>
					<p className='flex justify-between'><span className='text-grayscale'>Место:</span> <span className='font-bold'>{cargo.origin_city}, {cargo.origin_country}</span></p>
					<p className='flex justify-between'><span className='text-grayscale'>Дата погрузки:</span> <span className='font-bold'>{format(cargo.load_date, 'dd.MM.yyyy', { locale: ru })}</span></p>
				</div>

				<div className='space-y-3'>
					<p className='font-medium text-brand'>Куда</p>
					<p className='flex justify-between'><span className='text-grayscale'>Место:</span> <span className='font-bold'>{cargo.destination_city}, {cargo.destination_country}</span></p>
					<p className='flex justify-between'><span className='text-grayscale'>Дата отгрузки:</span> <span className='font-bold'>{cargo.delivery_date ? format(cargo.delivery_date, 'dd.MM.yyyy', { locale: ru }) : '-'}</span></p>
				</div>

				<div className='space-y-3'>
					<p className='font-medium text-brand'>Детали оборудования</p>
					<p className='flex justify-between'><span className='text-grayscale'>Наименование груза:</span> <span className='font-bold'>{cargo.product}</span></p>
					<p className='flex justify-between'><span className='text-grayscale'>Товар:</span> <span className='font-bold'>{cargo.product}</span></p>
					<p className='flex justify-between'><span className='text-grayscale'>Тип транспорта:</span> <span className='font-bold'>{transportName}</span></p>
				</div>

				<div className='space-y-3'>
					<p className='font-medium text-brand'>Детали перевозки</p>
					<p className='flex justify-between'><span className='text-grayscale'>Способ связи:</span> <span className='font-bold'>{contactName}</span></p>
					<p className='flex justify-between'><span className='text-grayscale'>Контакт:</span> <span className='font-bold'>{cargo.contact_value}</span></p>
					<p className='flex justify-between'><span className='text-grayscale'>Цена:</span> <span className='font-bold'>{cargo.price_value} {cargo.price_currency}</span></p>
				</div>
			</div>

			<div className='flex justify-end mt-6'>
				<OfferModal selectedRows={[cargo]} />
			</div>

		</div>
	)
}
