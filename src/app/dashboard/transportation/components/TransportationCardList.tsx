'use client'

import {
	formatDateValue,
	formatPlace,
	formatPricePerKmValue,
	formatPriceValue,
	formatWeightValue
} from '@/app/dashboard/desk/components/cardFormatters'
import { CardPaginationControls, useDeskCardPagination } from '@/app/dashboard/desk/my/components/DeskCardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { getTransportationStatusMeta } from '@/app/dashboard/transportation/constants/statusMeta'
import {
	CalendarDays,
	FileText,
	Home,
	MapPin,
	Scale,
	Truck,
	Wallet
} from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { IOrderList } from '@/shared/types/Order.interface'


type TransportationCardListProps = {
	cargos: IOrderList[]
	serverPagination?: ServerPaginationMeta
	statusValue: string
}

export function TransportationCardList({ cargos, serverPagination, statusValue }: TransportationCardListProps) {
	const pagination = useDeskCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex-1 overflow-hidden rounded-4xl xs:bg-background xs:p-4'>
				<div className='grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-2'>
					{cargos.map((cargo) => (
						<TransportationCard key={cargo.id} cargo={cargo} statusValue={statusValue} />
					))}
				</div>
			</div>

			<CardPaginationControls pagination={pagination} />
		</div>
	)
}

type TransportationCardProps = {
	cargo: IOrderList
	statusValue: string
}

function TransportationCard({ cargo, statusValue }: TransportationCardProps) {
	const { badgeVariant, label: statusLabel } = getTransportationStatusMeta(statusValue)
	// const transportName =
	// 	TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type

	const sections = useMemo(
		() => [
			// {
			// 	title: 'Откуда',
			// 	items: [
			// 		{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: 'Город / страна' },
			// 		{ icon: Home, primary: cargo.origin_address || '—', secondary: 'Адрес' },
			// 	],
			// },
			// {
			// 	title: 'Куда',
			// 	items: [
			// 		{ icon: MapPin, primary: formatPlace(cargo.destination_city, cargo.destination_country), secondary: 'Город / страна' },
			// 		{ icon: Home, primary: cargo.destination_address || '—', secondary: 'Адрес' },
			// 	],
			// },
			// {
			// 	title: 'Когда',
			// 	items: [
			// 		{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: 'Погрузка' },
			// 		{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: 'Доставка' },
			// 	],
			// },
			// {
			// 	title: 'Тип транспорта / Вес',
			// 	items: [
			// 		{ icon: Truck, primary: transportName || '—', secondary: 'Тип транспорта' },
			// 		{ icon: Scale, primary: formatWeightValue(cargo.weight_t), secondary: 'Вес' },
			// 	],
			// },
			// {
			// 	title: 'Цена / миля',
			// 	items: [
			// 		{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: 'Фиксированная' },
			// 		{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.price_currency), secondary: 'Цена за км' },
			// 	],
			// },
			// {
			// 	title: 'Документы',
			// 	items: [
			// 		{ icon: FileText, primary: cargo.weight_t || '—', secondary: 'Документы' },
			// 	],
			// },
		],
		[cargo],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<Badge variant={badgeVariant}>{statusLabel}</Badge>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						Название компании
					</CardTitle>
					<UuidCopy id={cargo.id} />
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<span>Товар: Название товара</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				{sections.map((section, index) => (
					<section key={index} className='flex flex-col gap-2'>
						<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Название</span>
						<div className='flex flex-wrap gap-2'>
							{/* {section.items.map((item, index) => (
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
							))} */}
						</div>
					</section>
				))}
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.order(String(cargo.id))}>
					<Button className='w-full bg-warning-400 hover:bg-warning-500  text-white'>
						Посмотреть
					</Button>
				</Link>
				<Button className='flex-1 min-w-[140px] bg-error-400 hover:bg-error-500 text-white'>
					Отменить
				</Button>
			</CardFooter>
		</Card>
	)
}
