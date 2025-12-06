'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { DeskOfferModal } from '@/components/ui/modals/DeskOfferModal'
import { DeskOffersModal } from '@/components/ui/modals/DeskOffersModal'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import {
	CalendarDays,
	CircleCheck,
	Eye,
	EyeOff,
	Handshake,
	Home,
	Mail,
	MapPin,
	Minus,
	Pen,
	Phone,
	RefreshCcw,
	Scale,
	Truck,
	Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatDateValue, formatPlace, formatPricePerKmValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { useToggleLoadVisibility } from '@/hooks/queries/loads/useToggleLoadVisibility'
import { useRefreshLoad } from '@/hooks/queries/loads/useRefreshLoad'

const hasOffersValue = (cargo: ICargoList) => {
	if (cargo.offers_count && cargo.offers_count > 0) return true
	const normalized = String(cargo.has_offers ?? '').toLowerCase()
	return normalized === 'true' || normalized === '1'
}

type DeskCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
}

export function DeskCardList({ cargos, serverPagination }: DeskCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.uuid}
			renderItem={(cargo) => <DeskCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type DeskCardProps = {
	cargo: ICargoList
}

function DeskCard({ cargo }: DeskCardProps) {
	const transportName =
		TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type
	const { toggleLoadVisibility, isLoadingToggle } = useToggleLoadVisibility()
	const { refreshLoad } = useRefreshLoad()



	const sections = useMemo(
		() => [
			{
				title: 'Откуда',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: 'Город / страна' },
					{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: 'Погрузка' },
				],
			},
			{
				title: 'Куда',
				items: [
					{ icon: MapPin, primary: formatPlace(cargo.destination_city, cargo.destination_country), secondary: 'Город / страна' },
					{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: 'Разгрузка' },
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
					{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.price_currency), secondary: 'Цена за км' },
				],
			},
			{
				title: 'Телефон',
				items: [{ icon: Phone, primary: cargo.contact_pref === 'phone' || cargo.contact_pref === 'both' ? cargo.phone : '—' }],
			},
			{
				title: 'Почта',
				items: [{ icon: Mail, primary: cargo.contact_pref === 'email' || cargo.contact_pref === 'both' ? cargo.email : '—' }],
			},
		],
		[cargo, transportName],
	)

	const [offerOpen, setOfferOpen] = useState(false)

	const isHiddenForMe = String(cargo.is_hidden_for_me ?? '').toLowerCase() === 'true'
	const visibilityActionLabel = isHiddenForMe ? 'Показать' : 'Скрыть'
	const VisibilityIcon = isHiddenForMe ? Eye : EyeOff


	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{cargo.company_name || cargo.product || 'Без названия'}
					</CardTitle>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-semibold text-foreground'>ID:</span>
						<UuidCopy uuid={cargo.uuid} />
					</div>
				</div>
				<p className='text-sm text-muted-foreground'>Товар: {cargo.product}</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />

				<section className='flex flex-col gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Предложения</span>
					<HasOffersField cargo={cargo} />
				</section>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button variant='outline' className='flex-1 min-w-[140px] bg-[#111827] text-white' onClick={() => {
					refreshLoad({ uuid: cargo.uuid, detail: 'Обновление объявления' })
				}}>
					<RefreshCcw /> Обновить
				</Button>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.edit(cargo.uuid)}>
					<Button variant='outline' className='w-full bg-warning-400 text-white'>
						<Pen /> Изменить
					</Button>
				</Link>
				<Button variant='outline' className='flex-1 min-w-[140px] bg-error-500 text-white' onClick={() => { toggleLoadVisibility({ uuid: cargo.uuid, isHiddenForMe: !isHiddenForMe }) }}>
					<VisibilityIcon className='size-4' />
					{visibilityActionLabel}
				</Button>
				<Button
					variant='outline'
					onClick={() => setOfferOpen(true)}
					className='flex items-center gap-2 flex-1 min-w-[240px] bg-brand text-white'
				>
					<Handshake className='size-4' />
					Сделать предложение
				</Button>
			</CardFooter>

			<DeskOfferModal
				open={offerOpen}
				onOpenChange={setOfferOpen}
				selectedRow={cargo}
			/>
		</Card >
	)
}

function HasOffersField({ cargo }: { cargo: ICargoList }) {
	const [open, setOpen] = useState(false)
	const hasOffers = hasOffersValue(cargo)

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

			<DeskOffersModal cargoUuid={cargo.uuid} open={open} onOpenChange={setOpen} />
		</>
	)
}
