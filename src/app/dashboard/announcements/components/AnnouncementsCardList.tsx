'use client'

import {
	formatDateValue,
	formatPlace,
	formatPricePerKmValue,
	formatPriceValue,
	formatRelativeDate,
	formatWeightValue,
} from '@/components/card/cardFormatters'
import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { OfferModal } from '@/components/ui/modals/OfferModal'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { CalendarDays, Home, MapPin, Minus, Phone, Scale, Star, Truck, Wallet } from 'lucide-react'
import { useMemo } from 'react'

type AnnouncementsCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
}

export function AnnouncementsCardList({ cargos, serverPagination }: AnnouncementsCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.uuid}
			renderItem={(cargo) => <AnnouncementCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type AnnouncementCardProps = {
	cargo: ICargoList
}

function AnnouncementCard({ cargo }: AnnouncementCardProps) {
	const transportName =
		TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type
	const contact =
		cargo.contact_pref === 'email'
			? cargo.email
			: cargo.contact_pref === 'phone'
				? cargo.phone
				: cargo.phone || cargo.email

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
					{ icon: Phone, primary: contact || '—', secondary: 'Телефон' },
				],
			},
		],
		[cargo, transportName, contact],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b [.border-b]:pb-0'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<span className='text-sm text-muted-foreground flex items-center'><Star className='text-star ' /> {cargo.company_rating ? cargo.company_rating.toFixed(1) : <Minus />}</span>
					<CardTitle className='text-lg font-semibold leading-tight text-grayscale'>
						{cargo.company_name || '—'}
					</CardTitle>
					<span className='text-lg font-semibold leading-tight text-grayscale'>{formatRelativeDate(cargo.created_at)}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
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
