'use client'

import {
	formatDateValue,
	formatPlace,
	formatPricePerKmValue,
	formatPriceValue,
	formatRelativeDate,
	formatWeightValue,
} from '@/app/dashboard/desk/components/cardFormatters'
import { CardPaginationControls, useDeskCardPagination } from '@/app/dashboard/desk/my/components/DeskCardPagination'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { OfferModal } from '@/components/ui/modals/OfferModal'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { CalendarDays, Home, MapPin, Phone, Scale, Truck, Wallet } from 'lucide-react'
import { useMemo } from 'react'

type AnnouncementsCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
}

export function AnnouncementsCardList({ cargos, serverPagination }: AnnouncementsCardListProps) {
	if (!cargos.length) {
		return null
	}

	const pagination = useDeskCardPagination(serverPagination)

	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex-1 overflow-hidden rounded-4xl bg-background xs:p-4'>
				<div className='grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-2'>
					{cargos.map((cargo) => (
						<AnnouncementCard key={cargo.uuid} cargo={cargo} />
					))}
				</div>
			</div>

			<CardPaginationControls pagination={pagination} />
		</div>
	)
}

type AnnouncementCardProps = {
	cargo: ICargoList
}

function AnnouncementCard({ cargo }: AnnouncementCardProps) {
	const transportName =
		TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type

	const sections = useMemo(
		() => [
			{
				title: 'Откуда',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: 'Город / страна' },
					{ icon: Home, primary: cargo.origin_address || '—', secondary: 'Адрес' },
				],
			},
			{
				title: 'Куда',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.destination_city, cargo.destination_country), secondary: 'Город / страна' },
					{ icon: Home, primary: cargo.destination_address || '—', secondary: 'Адрес' },
				],
			},
			{
				title: 'Когда',
				items: [
					{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: 'Погрузка' },
					{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: 'Доставка' },
				],
			},
			{
				title: 'Тип транспорта / Вес',
				items: [
					{ icon: Truck, primary: transportName || '—', secondary: 'Тип транспорта' },
					{ icon: Scale, primary: formatWeightValue(cargo.weight_t), secondary: 'Вес' },
				],
			},
			{
				title: 'Цена / миля',
				items: [
					{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: 'Фиксированная' },
					{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.price_currency), secondary: 'Цена за км' },
				],
			},
			{
				title: 'Контакты',
				items: [
					{ icon: Phone, primary: cargo.contact_value || '—', secondary: 'Телефон' },
				],
			},
		],
		[cargo, transportName],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						Товар: {cargo.product || 'Без названия'}
					</CardTitle>
					<span className='text-sm text-muted-foreground'>Размещено: {formatRelativeDate(cargo.created_at)}</span>
				</div>
				<p className='text-sm text-muted-foreground'>Компания: {cargo.company_name || '—'}</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				{sections.map((section) => (
					<section key={section.title} className='flex flex-col gap-2'>
						<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{section.title}</span>
						<div className='flex flex-wrap gap-2'>
							{section.items.map((item, index) => (
								<div
									key={`${section.title}-${index}`}
									className='flex min-w-[160px] flex-1 items-center gap-2 rounded-full bg-card px-4 py-2'
								>
									<item.icon className='size-4 text-muted-foreground' aria-hidden />
									<div className='flex flex-col leading-tight'>
										<span className='font-medium text-foreground'>{item.primary}</span>
										<span className='text-xs text-muted-foreground'>{item.secondary}</span>
									</div>
								</div>
							))}
						</div>
					</section>
				))}
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button variant='outline' className='flex-1 min-w-[140px]'>
					Подробнее
				</Button>
				<OfferModal className='flex-1 min-w-[140px]' selectedRow={cargo} />
			</CardFooter>
		</Card>
	)
}

