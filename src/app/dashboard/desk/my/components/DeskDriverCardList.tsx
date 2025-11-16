'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import {
	Calendar,
	Home,
	MapPin,
	Phone,
	Scale,
	Truck,
	Wallet
} from 'lucide-react'
import { CardListLayout } from '@/components/card/CardListLayout'
import { useCardPagination } from '@/components/pagination/CardPagination'
import {
	ActionButton,
	InfoChip,
	InfoSection,
	formatDate,
	formatPrice,
	formatPricePerKm,
	formatWeight,
} from './DeskCardShared'
import { IOfferShort } from '@/shared/types/Offer.interface'

type DeskDriverCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
}

export function DeskDriverCardList({ cargos, serverPagination }: DeskDriverCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo, index) => <DeskDriverCard cargo={cargo} index={index} />}
			pagination={pagination}
		/>
	)
}

type DeskDriverCardProps = {
	cargo: IOfferShort
	index: number
}

function DeskDriverCard({ cargo, index }: DeskDriverCardProps) {
	const transportName =
		TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type
	const offerMeta = getOfferMeta(index)
	const rating = 5

	return (
		<Card className='h-full rounded-3xl border-0 bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					{Number(index) % 2 === 0 ? <Badge variant='warning' >
						Предложение от посредника
					</Badge> : <Badge variant='info' >
						Предложение от заказчика
					</Badge>}
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						Название компании
					</CardTitle>
					<UuidCopy id={cargo.id} />
				</div>
				<p className='text-sm text-muted-foreground'>Товар: Название товара</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<InfoSection title='Откуда'>
					<InfoChip icon={MapPin} primary={`${cargo.origin_city}, ${cargo.origin_country}`} secondary='Город / страна' />
					<InfoChip icon={Home} primary={cargo.origin_city || '—'} secondary='Адрес' />
				</InfoSection>

				<InfoSection title='Куда'>
					<InfoChip icon={MapPin} primary={`${cargo.destination_city}, ${cargo.destination_country}`} secondary='Город / страна' />
					<InfoChip icon={Home} primary={cargo.destination_city || '—'} secondary='Адрес' />
				</InfoSection>

				<InfoSection title='Когда'>
					<InfoChip icon={Calendar} primary={formatDate(cargo.load_date)} secondary='Дата загрузки' />
					<InfoChip icon={Calendar} primary={formatDate(cargo.delivery_date)} secondary='Дата доставки' />
				</InfoSection>

				<InfoSection title='Тип транспорта / Вес'>
					<InfoChip icon={Truck} primary={transportName} secondary='Тип транспорта' />
					<InfoChip icon={Scale} primary={formatWeight(cargo.weight_t)} secondary='Вес, т' />
				</InfoSection>

				<InfoSection title='Цена / км'>
					<InfoChip icon={Wallet} primary={formatPrice(cargo.price_value, cargo.price_currency)} secondary='Стоимость' />
					<InfoChip
						icon={Wallet}
						primary={formatPricePerKm(300, cargo.price_currency)}
						secondary='Цена за км'
					/>
				</InfoSection>

				<InfoSection title='Контакты'>
					<InfoChip icon={Phone} primary={cargo.carrier_contact || '—'} secondary='Телефон' className='flex-1' />
				</InfoSection>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<ActionButton label='Отказать' className='bg-error-400 text-white hover:bg-error-500 hover:text-white' />
				<ActionButton label='Принять' className='bg-success-400 text-white hover:bg-success-500 hover:text-white' />
			</CardFooter>
		</Card>
	)
}

function getOfferMeta(index: number) {
	const isCustomer = index % 2 === 0

	return isCustomer
		? {
			label: 'Предложение от заказчика',
			badgeClass: 'bg-blue-50 text-blue-600',
		}
		: {
			label: 'Предложение от посредника',
			badgeClass: 'bg-orange-50 text-orange-600',
		}
}
