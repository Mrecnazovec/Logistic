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
import { CardPaginationControls, useDeskCardPagination } from './DeskCardPagination'
import {
	ActionButton,
	InfoChip,
	InfoSection,
	formatDate,
	formatPrice,
	formatPricePerKm,
	formatWeight,
} from './DeskCardShared'

type DeskDriverCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
}

export function DeskDriverCardList({ cargos, serverPagination }: DeskDriverCardListProps) {
	const pagination = useDeskCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex-1 overflow-hidden rounded-4xl xs:bg-background p-4'>
				<div className='grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-2'>
					{cargos.map((cargo, index) => (
						<DeskDriverCard key={cargo.uuid} cargo={cargo} index={index} />
					))}
				</div>
			</div>

			<CardPaginationControls pagination={pagination} />
		</div>
	)
}

type DeskDriverCardProps = {
	cargo: ICargoList
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
						{cargo.company_name}
					</CardTitle>
					<UuidCopy uuid={cargo.uuid} />
				</div>
				<p className='text-sm text-muted-foreground'>Товар: {cargo.product}</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<InfoSection title='Откуда'>
					<InfoChip icon={MapPin} primary={`${cargo.origin_city}, ${cargo.origin_country}`} secondary='Город / страна' />
					<InfoChip icon={Home} primary={cargo.origin_address || '—'} secondary='Адрес' />
				</InfoSection>

				<InfoSection title='Куда'>
					<InfoChip icon={MapPin} primary={`${cargo.destination_city}, ${cargo.destination_country}`} secondary='Город / страна' />
					<InfoChip icon={Home} primary={cargo.destination_address || '—'} secondary='Адрес' />
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
						primary={formatPricePerKm(cargo.price_per_km, cargo.price_currency)}
						secondary='Цена за км'
					/>
				</InfoSection>

				<InfoSection title='Контакты'>
					<InfoChip icon={Phone} primary={cargo.contact_value || '—'} secondary='Телефон' className='flex-1' />
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
