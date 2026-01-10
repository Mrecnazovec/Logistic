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
import { getTransportSymbol, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { MapPin, Mail, Phone, Scale, Truck, Wallet } from 'lucide-react'

type DeskMyCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
	onOpenDecision?: (offer: IOfferShort, options?: { forceFull?: boolean }) => void
	role?: RoleEnum
}

export function DeskMyCardList({ cargos, serverPagination, onOpenDecision, role }: DeskMyCardListProps) {
	const pagination = useCardPagination(serverPagination)
	if (!cargos.length) return null

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.cargo_uuid || String(cargo.id)}
			renderItem={(cargo) => <DeskMyCard cargo={cargo} onOpenDecision={onOpenDecision} role={role} />}
			pagination={pagination}
		/>
	)
}

type DeskMyCardProps = {
	cargo: IOfferShort
	onOpenDecision?: (offer: IOfferShort, options?: { forceFull?: boolean }) => void
	role?: RoleEnum
}

function DeskMyCard({ cargo, onOpenDecision, role }: DeskMyCardProps) {
	const { t } = useI18n()
	const transportName = getTransportSymbol(t, cargo.transport_type as TransportTypeEnum) || cargo.transport_type
	const { variant, label, highlight } = getOfferStatusMeta(cargo, role, t)
	const formattedLoadDate = formatDateValue(cargo.load_date)
	const formattedDeliveryDate = formatDateValue(cargo.delivery_date)
	const contactPhone = cargo.phone || '-'
	const contactEmail = cargo.email || '-'
	const sections = [
		{
			title: t('deskMy.card.from'),
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.origin_city, cargo.origin_country, '-'),
					secondary: formattedLoadDate || '-',
				},
			],
		},
		{
			title: t('deskMy.card.to'),
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.destination_city, cargo.destination_country, '-'),
					secondary: formattedDeliveryDate || '-',
				},
			],
		},
		{
			title: t('deskMy.card.price'),
			items: [
				{
					icon: Wallet,
					primary: formatPriceValue(cargo.price_value, cargo.price_currency),
					secondary: cargo.price_currency || '-',
				},
			],
		},
		{
			title: t('deskMy.card.contacts'),
			items: [
				{ icon: Phone, primary: contactPhone, secondary: t('deskMy.card.phone') },
				{ icon: Mail, primary: contactEmail, secondary: t('deskMy.card.email') },
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<Badge variant={variant} className={highlight ? 'animate-pulse' : undefined}>{label}</Badge>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{cargo.customer_full_name || '-'}
					</CardTitle>
					<UuidCopy uuid={cargo.cargo_uuid || String(cargo.id)} />
				</div>
				<p className='text-sm text-muted-foreground'>{formatPriceValue(cargo.price_value, cargo.price_currency)}</p>
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
					{t('deskMy.card.openOffer')}
				</Button>
				<Button
					type='button'
					onClick={() => onOpenDecision?.(cargo, { forceFull: true })}
					className='flex-1 rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60'
				>
					{t('deskMy.card.edit')}
				</Button>

			</CardFooter>
		</Card>
	)
}
