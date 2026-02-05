"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { getOfferStatusMeta } from '@/components/ui/selectors/BadgeSelector'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDateValue, formatPlace, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { getTransportSymbol, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { Mail, MapPin, Phone, Scale, Truck, Wallet } from 'lucide-react'

type DeskMyCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
	onOpenDecision?: (offer: IOfferShort, options?: { forceFull?: boolean }) => void
	role?: RoleEnum
	unreadOfferIds?: Set<number>
}

export function DeskMyCardList({ cargos, serverPagination, onOpenDecision, role, unreadOfferIds }: DeskMyCardListProps) {
	const pagination = useCardPagination(serverPagination)
	if (!cargos.length) return null

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => String(cargo.id)}
			renderItem={(cargo, index) => (
				<DeskDriverCard cargo={cargo} index={index} onOpenDecision={onOpenDecision} role={role} isUnread={Boolean(unreadOfferIds?.has(cargo.id))} />
			)}
			pagination={pagination}
		/>
	)
}

type DeskDriverCardProps = {
	cargo: IOfferShort
	index: number
	onOpenDecision?: (offer: IOfferShort, options?: { forceFull?: boolean }) => void
	role?: RoleEnum
	isUnread?: boolean
}

function DeskDriverCard({ cargo, onOpenDecision, role, isUnread }: DeskDriverCardProps) {
	const { t } = useI18n()
	const transportName = getTransportSymbol(t, cargo.transport_type as TransportTypeEnum) || cargo.transport_type
	const { variant, label } = getOfferStatusMeta(cargo, role, t)
	const formattedLoadDate = formatDateValue(cargo.load_date)
	const formattedDeliveryDate = formatDateValue(cargo.delivery_date)
	const contactPhone = cargo.phone || '-'
	const contactEmail = cargo.email || '-'
	const rating = cargo.carrier_rating ?? '-'
	const sections = [
		{
			title: t('deskMy.income.card.from'),
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.origin_city, cargo.origin_country, '-'),
					secondary: formattedLoadDate || '-',
				},
			],
		},
		{
			title: t('deskMy.income.card.to'),
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.destination_city, cargo.destination_country, '-'),
					secondary: formattedDeliveryDate || '-',
				},
			],
		},
		{
			title: t('deskMy.income.card.price'),
			items: [
				{
					icon: Wallet,
					primary: formatPriceValue(cargo.price_value, cargo.price_currency),
					secondary: cargo.price_currency || '-',
				},
			],
		},
		{
			title: t('deskMy.income.card.contacts'),
			items: [
				{ icon: Phone, primary: contactPhone, secondary: t('deskMy.income.card.phone') },
				{ icon: Mail, primary: contactEmail, secondary: t('deskMy.income.card.email') },
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div className='relative'>
						<Badge variant={variant}>{label}</Badge>
						{isUnread ? <span className='absolute -top-1 -right-1 size-2 rounded-full bg-error-500' /> : null}
					</div>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{cargo.customer_full_name || '—'}
					</CardTitle>
					<UuidCopy uuid={cargo.cargo_uuid || String(cargo.id)} />
				</div>
				<div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
					<span className='font-semibold text-foreground'>{t('deskMy.income.card.rating')}: {rating}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button
					type='button'
					onClick={() => onOpenDecision?.(cargo)}
					className='flex-1 rounded-full bg-warning-500 text-white hover:bg-warning-400 disabled:opacity-60'
				>
					{t('deskMy.income.card.openOffer')}
				</Button>
				<Button
					type='button'
					onClick={() => onOpenDecision?.(cargo, { forceFull: true })}
					className='flex-1 rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60'
				>
					{t('deskMy.income.card.edit')}
				</Button>

			</CardFooter>
		</Card>
	)
}
