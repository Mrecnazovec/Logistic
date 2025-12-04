'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { BadgeSelector, getStatusBadge } from '@/components/ui/selectors/BadgeSelector'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { StatusEnum } from '@/shared/enums/Status.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import {
	Calendar,
	Home,
	MapPin,
	Phone,
	Scale,
	Truck,
	Wallet,
} from 'lucide-react'
import {
	ActionButton,
	InfoChip,
	InfoSection,
} from './DeskCardShared'
import { formatDateValue, formatPricePerKmValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { Badge } from '@/components/ui/Badge'

type DeskMyCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
}

export function DeskMyCardList({ cargos, serverPagination }: DeskMyCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo) => <DeskMyCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type DeskMyCardProps = {
	cargo: IOfferShort
}

function DeskMyCard({ cargo }: DeskMyCardProps) {
	const transportName =
		TransportSelect.find((type) => type.type === cargo.transport_type)?.name ?? cargo.transport_type
	const { variant, label } = getStatusBadge(cargo.status_display)


	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<Badge variant={variant}>{label}</Badge>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						Название компании
					</CardTitle>
					<UuidCopy uuid={String(cargo.id)} />
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
					<InfoChip icon={Calendar} primary={formatDateValue(cargo.load_date)} secondary='Дата загрузки' />
					<InfoChip icon={Calendar} primary={formatDateValue(cargo.delivery_date)} secondary='Дата доставки' />
				</InfoSection>

				<InfoSection title='Тип транспорта / Вес'>
					<InfoChip icon={Truck} primary={transportName} secondary='Тип транспорта' />
					<InfoChip icon={Scale} primary={formatWeightValue(cargo.weight_t)} secondary='Вес, т' />
				</InfoSection>

				<InfoSection title='Цена / км'>
					<InfoChip icon={Wallet} primary={formatPriceValue(cargo.price_value, cargo.price_currency)} secondary='Стоимость' />
					<InfoChip
						icon={Wallet}
						primary={formatPricePerKmValue(300, cargo.price_currency)}
						secondary='Цена за км'
					/>
				</InfoSection>

				<InfoSection title='Контакты'>
					<InfoChip icon={Phone} primary={'Контакт'} secondary='Телефон' className='flex-1' />
				</InfoSection>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<ActionButton label='Изменить' className='bg-warning-400 text-white hover:bg-warning-400 hover:text-white disabled:bg-grayscale' disabled={cargo.status_display === StatusEnum.COMPLETED} />
				<ActionButton label='Отказать' className='bg-error-400 text-white hover:bg-error-500 hover:text-white disabled:bg-grayscale' disabled={cargo.status_display === StatusEnum.COMPLETED} />
				<ActionButton label='Принять' className='bg-success-400 text-white hover:bg-success-500 hover:text-white disabled:bg-grayscale' disabled={cargo.status_display === StatusEnum.COMPLETED} />
			</CardFooter>
		</Card>
	)
}
