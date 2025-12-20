"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import {
	formatDateValue,
	formatPlace,
	formatPricePerKmValue,
	formatPriceValue,
	formatRelativeDate,
	formatWeightValue,
} from '@/lib/formatters'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { CalendarDays, Mail, MapPin, Minus, Phone, Scale, Star, Truck, Wallet } from 'lucide-react'
import dynamic from 'next/dynamic'

const AnnouncementDetailModal = dynamic(() =>
	import('@/components/ui/modals/AnnouncementDetailModal').then((mod) => mod.AnnouncementDetailModal),
)
const OfferModal = dynamic(() => import('@/components/ui/modals/OfferModal').then((mod) => mod.OfferModal))

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
	const transportName = getTransportName(cargo.transport_type) || cargo.transport_type || '-'
	const canShowPhone = cargo.contact_pref === 'phone' || cargo.contact_pref === 'both'
	const canShowEmail = cargo.contact_pref === 'email' || cargo.contact_pref === 'both'

	const sections: CardSection[] = [
		{
			title: 'Откуда',
			items: [
				{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: 'Город / страна' },
				{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: 'Загрузка' },
			],
		},
		{
			title: 'Куда',
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.destination_city, cargo.destination_country),
					secondary: 'Город / страна',
				},
				{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: 'Разгрузка' },
			],
		},
		{
			title: 'Транспорт / вес',
			items: [
				{ icon: Truck, primary: transportName || '—', secondary: 'Тип транспорта' },
				{ icon: Scale, primary: formatWeightValue(cargo.weight_t), secondary: 'Вес' },
			],
		},
		{
			title: 'Цена / км',
			items: [
				{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: 'Стоимость перевозки' },
				{
					icon: Wallet,
					primary: formatPricePerKmValue(cargo.price_per_km, cargo.price_currency),
					secondary: 'Цена за км',
				},
			],
		},
		{
			title: 'Телефон',
			items: [{ icon: Phone, primary: canShowPhone ? cargo.phone : '-' }],
		},
		{
			title: 'Почта',
			items: [{ icon: Mail, primary: canShowEmail ? cargo.email : '-' }],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b [.border-b]:pb-0'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<span className='flex items-center text-sm text-muted-foreground'>
						<Star className='text-star' /> {cargo.company_rating ? cargo.company_rating.toFixed(1) : <Minus />}
					</span>
					<CardTitle className='text-lg font-semibold leading-tight text-grayscale'>
						{cargo.company_name || '—'}
					</CardTitle>
					<span className='text-lg font-semibold leading-tight text-grayscale'>
						{formatRelativeDate(cargo.created_at)}
					</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex max-sm:flex-col gap-3 border-t pt-4'>
				<AnnouncementDetailModal cargo={cargo} />
				<OfferModal className='min-w-[140px] flex-1 max-sm:w-full' title='Предложить' selectedRow={cargo} />
			</CardFooter>
		</Card>
	)
}
