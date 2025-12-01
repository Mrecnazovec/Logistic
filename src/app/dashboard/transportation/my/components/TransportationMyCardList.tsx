'use client'

import { getTransportationStatusMeta } from '@/app/dashboard/transportation/constants/statusMeta'
import { formatDateValue, formatPlace, formatPricePerKmValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { CalendarDays, FileText, Home, MapPin, Scale, Truck, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

type TransportationMyCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
	statusLabel: string
}

export function TransportationMyCardList({ cargos, serverPagination, statusLabel }: TransportationMyCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.uuid}
			renderItem={(cargo) => <TransportationMyCard cargo={cargo} statusLabel={statusLabel} />}
			pagination={pagination}
		/>
	)
}

type TransportationMyCardProps = {
	cargo: ICargoList
	statusLabel: string
}

function TransportationMyCard({ cargo, statusLabel }: TransportationMyCardProps) {
	const { badgeVariant, label: normalizedStatusLabel } = getTransportationStatusMeta(statusLabel)
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
				title: 'Документы',
				items: [
					{ icon: FileText, primary: cargo.weight_t || '—', secondary: 'Документы' },
				],
			},
		],
		[cargo, transportName],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<Badge variant={badgeVariant}>{normalizedStatusLabel}</Badge>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{cargo.company_name || cargo.product || 'Без названия'}
					</CardTitle>
					<UuidCopy uuid={cargo.uuid} />
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<span>Товар: {cargo.product}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button className='flex-1 bg-warning-400 hover:bg-warning-500 min-w-[140px] text-white'>
					<Link href={DASHBOARD_URL.order(cargo.uuid)}>Посмотреть</Link>
				</Button>
				<Button className='flex-1 min-w-[140px] bg-error-400 hover:bg-error-500 text-white'>
					Отменить
				</Button>
			</CardFooter>
		</Card>
	)
}
