'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { DeskOffersModal } from '@/components/ui/modals/DeskOffersModal'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import {
	CalendarDays,
	CircleCheck,
	EyeOff,
	Handshake,
	Home,
	MapPin,
	Minus,
	Pen,
	RefreshCcw,
	Scale,
	Truck,
	Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatDateValue, formatPlace, formatPricePerKmValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'

type DeskCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
}

export function DeskCardDriverList({ cargos, serverPagination }: DeskCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo) => <DeskCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type DeskCardProps = {
	cargo: IOfferShort
}

function DeskCard({ cargo }: DeskCardProps) {
	const transportName =
		TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type

	const sections = useMemo(
		() => [
			{
				title: 'Пункт отправления',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: 'Город / страна' },
					{ icon: Home, primary: cargo.origin_city || '—', secondary: 'Адрес' },
				],
			},
			{
				title: 'Пункт назначения',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.destination_city, cargo.destination_country), secondary: 'Город / страна' },
					{ icon: Home, primary: cargo.destination_city || '—', secondary: 'Адрес' },
				],
			},
			{
				title: 'Даты',
				items: [
					{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: 'Дата загрузки' },
					{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: 'Дата выгрузки' },
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
				title: 'Стоимость',
				items: [
					{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: 'Оплата' },
					{ icon: Wallet, primary: formatPricePerKmValue(300, cargo.price_currency), secondary: 'Цена за км' },
				],
			},
		],
		[cargo, transportName],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>Запрос перевозчика</CardTitle>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-semibold text-foreground'>ID:</span>
						<UuidCopy id={cargo.id} />
					</div>
				</div>
				<p className='text-sm text-muted-foreground'>Заявка: запрос перевозчика</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />

				<section className='flex flex-col gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Предложения</span>
					<HasOffersField cargo={cargo} />
				</section>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button variant='outline' className='flex-1 min-w-[140px] bg-[#111827] text-white'>
					<RefreshCcw /> Обновить
				</Button>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.edit(String(cargo.id))}>
					<Button variant='outline' className='w-full bg-warning-400 text-white'>
						<Pen /> Изменить
					</Button>
				</Link>
				<Button variant='outline' className='flex-1 min-w-[140px] bg-error-500 text-white'>
					<EyeOff /> Скрыть
				</Button>
				<Button variant='outline' className='flex items-center gap-2 flex-1 min-w-[240px] bg-brand text-white'>
					<Handshake className='size-4' />
					Сделать предложение
				</Button>
			</CardFooter>
		</Card>
	)
}

function HasOffersField({ cargo }: { cargo: IOfferShort }) {
	const hasOffers = Boolean(cargo.accepted_by_carrier)
	const [open, setOpen] = useState(false)

	return (
		<>
			<Button
				type='button'
				variant='outline'
				className='flex items-center gap-2 p-0 text-sm font-semibold text-foreground disabled:text-muted-foreground border-0 shadow-none'
				disabled={!hasOffers}
				onClick={() => setOpen(true)}
			>
				{hasOffers ? (
					<>
						<CircleCheck className='size-4 text-success-500' aria-hidden />
						<span>Есть предложения</span>
					</>
				) : (
					<>
						<Minus className='size-4 text-muted-foreground' aria-hidden />
						<span>Нет предложений</span>
					</>
				)}
			</Button>

			<DeskOffersModal cargoUuid={cargo.cargo_uuid} open={open} onOpenChange={setOpen} />
		</>
	)
}
