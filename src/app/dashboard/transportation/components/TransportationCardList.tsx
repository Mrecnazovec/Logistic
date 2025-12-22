'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { formatDateValue, formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import type { IOrderList } from '@/shared/types/Order.interface'
import { Building2, CalendarDays, Home, MapPin, Wallet } from 'lucide-react'
import Link from 'next/link'

type TransportationCardListProps = {
	cargos: IOrderList[]
	serverPagination?: ServerPaginationMeta
	statusValue: string
}

export function TransportationCardList({ cargos, serverPagination, statusValue }: TransportationCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo) => <TransportationCard cargo={cargo} statusValue={statusValue} />}
			pagination={pagination}
		/>
	)
}

type TransportationCardProps = {
	cargo: IOrderList
	statusValue: string
}

function TransportationCard({ cargo }: TransportationCardProps) {
	const sections: CardSection[] = [
		{
			title: 'Перевозчик / Посредник',
			items: [
				{ icon: Building2, primary: cargo.carrier_name || '—', secondary: 'Перевозчик' },
				{ icon: Building2, primary: cargo.logistic_name || '—', secondary: 'Посредник' },
			],
		},
		{
			title: 'Откуда',
			items: [
				{ icon: MapPin, primary: cargo.origin_city || '—', secondary: 'Город' },
				{ icon: Home, primary: 'Адрес не указан', secondary: 'Адрес' },
			],
		},
		{
			title: 'Куда',
			items: [
				{ icon: MapPin, primary: cargo.destination_city || '—', secondary: 'Город' },
				{ icon: Home, primary: 'Адрес не указан', secondary: 'Адрес' },
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
			title: 'Цена',
			items: [
				{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.currency), secondary: 'Цена за км' },
				{ icon: Wallet, primary: formatPriceValue(cargo.price_total, cargo.currency), secondary: 'Стоимость' },
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<UuidCopy id={cargo.id} isPlaceholder />
					</div>
					<span className='ml-auto text-xs text-muted-foreground'>Документы: {cargo.documents_count ?? 0}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.order(String(cargo.id))}>
					<Button className='w-full bg-warning-400 hover:bg-warning-500 text-white'>Посмотреть</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
