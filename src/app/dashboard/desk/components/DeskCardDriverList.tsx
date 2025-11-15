'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
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
import { CardPaginationControls, useDeskCardPagination } from '../my/components/DeskCardPagination'
import {
	formatDateValue,
	formatPlace,
	formatPricePerKmValue,
	formatPriceValue,
	formatWeightValue
} from './cardFormatters'
import { IOfferShort } from '@/shared/types/Offer.interface'

type DeskCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
}

export function DeskCardDriverList({ cargos, serverPagination }: DeskCardListProps) {
	const pagination = useDeskCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex-1 overflow-hidden rounded-4xl xs:bg-background xs:p-4'>
				<div className='grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-2'>
					{cargos.map((cargo) => (
						<DeskCard key={cargo.id} cargo={cargo} />
					))}
				</div>
			</div>

			<CardPaginationControls pagination={pagination} />
		</div>
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
				title: 'Откуда',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: 'Город / страна' },
					{ icon: Home, primary: cargo.origin_city || '—', secondary: 'Адрес' },
				],
			},
			{
				title: 'Куда',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.destination_city, cargo.destination_country), secondary: 'Город / страна' },
					{ icon: Home, primary: cargo.destination_city || '—', secondary: 'Адрес' },
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
				title: 'Стоимость',
				items: [
					{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: 'Фиксированная' },
					{ icon: Wallet, primary: formatPricePerKmValue(300, cargo.price_currency), secondary: 'Цена за км' },
				],
			},
		],
		[cargo, transportName],
	)

	const [open, setOpen] = useState(false)
	const [offerOpen, setOfferOpen] = useState(false)


	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						Название компании
					</CardTitle>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-semibold text-foreground'>ID:</span>
						<UuidCopy id={cargo.id} />
					</div>
				</div>
				<p className='text-sm text-muted-foreground'>Товар: Название товара</p>
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

				<section className='flex flex-col gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Предложения</span>
					<HasOffersField cargo={cargo} />
				</section>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button variant='outline' className='flex-1 min-w-[140px]'>
					<RefreshCcw /> Обновить
				</Button>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.edit(String(cargo.id))}>
					<Button variant='outline' className='w-full'>
						<Pen /> Изменить
					</Button>
				</Link>
				<Button variant='outline' className='flex-1 min-w-[140px]'>
					<EyeOff /> Скрыть
				</Button>
				<Button
					variant='outline'
					onClick={() => {
						setOpen(false)
						setOfferOpen(true)
					}}
					className='flex items-center gap-2 flex-1 min-w-[240px]'
				>
					<Handshake className='size-4 text-muted-foreground' />
					Сделать предложение
				</Button>
			</CardFooter>

			{/* <DeskOfferModal
				open={offerOpen}
				onOpenChange={setOfferOpen}
				selectedRow={cargo}
			/> */}
		</Card >
	)
}

function HasOffersField({ cargo }: { cargo: IOfferShort }) {
	const [open, setOpen] = useState(false)
	const hasOffers = Boolean(cargo.is_handshake)

	return (
		<>
			<Button
				type='button'
				variant='outline'
				className='flex items-center gap-2 p-0 text-sm font-semibold text-foreground disabled:text-muted-foreground border-0 shadow-none'
				onClick={() => setOpen(true)}
				disabled={!hasOffers}
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

			{/* <DeskOffersModal selectedRow={cargo} open={open} onOpenChange={setOpen} /> */}
		</>
	)
}
