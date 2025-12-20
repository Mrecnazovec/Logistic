"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { getOfferStatusMeta } from '@/components/ui/selectors/BadgeSelector'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { formatDateValue, formatPlace, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { Mail, MapPin, Phone, Scale, Truck, Wallet } from 'lucide-react'
import { InfoChip, InfoSection } from './DeskCardShared'

type DeskMyCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
	onOpenDecision?: (offer: IOfferShort) => void
	role?: RoleEnum
}

export function DeskMyCardList({ cargos, serverPagination, onOpenDecision, role }: DeskMyCardListProps) {
	const pagination = useCardPagination(serverPagination)
	if (!cargos.length) return null

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.cargo_uuid || String(cargo.id)}
			renderItem={(cargo, index) => (
				<DeskDriverCard cargo={cargo} index={index} onOpenDecision={onOpenDecision} role={role} />
			)}
			pagination={pagination}
		/>
	)
}

type DeskDriverCardProps = {
	cargo: IOfferShort
	index: number
	onOpenDecision?: (offer: IOfferShort) => void
	role?: RoleEnum
}

function DeskDriverCard({ cargo, onOpenDecision, role }: DeskDriverCardProps) {
	const transportName = TransportSelect.find((type) => type.type === cargo.transport_type)?.symb ?? cargo.transport_type
	const { variant, label } = getOfferStatusMeta(cargo, role)
	const formattedLoadDate = formatDateValue(cargo.load_date)
	const formattedDeliveryDate = formatDateValue(cargo.delivery_date)
	const contactPhone = cargo.phone || '—'
	const contactEmail = cargo.email || '—'
	const rating = cargo.carrier_rating ?? '—'

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<Badge variant={variant}>{label}</Badge>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{cargo.customer_full_name || '—'}
					</CardTitle>
					<UuidCopy uuid={cargo.cargo_uuid || String(cargo.id)} />
				</div>
				<div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
					<span className='font-semibold text-foreground'>Рейтинг: {rating}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<InfoSection title='Откуда'>
					<InfoChip icon={MapPin} primary={formatPlace(cargo.origin_city, cargo.origin_country, '—')} secondary={formattedLoadDate || '—'} />
				</InfoSection>

				<InfoSection title='Куда'>
					<InfoChip
						icon={MapPin}
						primary={formatPlace(cargo.destination_city, cargo.destination_country, '—')}
						secondary={formattedDeliveryDate || '—'}
					/>
				</InfoSection>

				<InfoSection title='Транспорт / вес'>
					<InfoChip icon={Truck} primary={transportName || '—'} secondary='Тип транспорта' />
					<InfoChip icon={Scale} primary={formatWeightValue(cargo.weight_t)} secondary='Вес' />
				</InfoSection>

				<InfoSection title='Цена'>
					<InfoChip icon={Wallet} primary={formatPriceValue(cargo.price_value, cargo.price_currency)} secondary={cargo.price_currency || '—'} />
				</InfoSection>

				<InfoSection title='Контакты'>
					<InfoChip icon={Phone} primary={contactPhone} secondary='Телефон' className='flex-1' />
					<InfoChip icon={Mail} primary={contactEmail} secondary='Email' className='flex-1' />
				</InfoSection>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button
					type='button'
					onClick={() => onOpenDecision?.(cargo)}
					className='w-full rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60'
				>
					Открыть предложение
				</Button>
			</CardFooter>
		</Card>
	)
}
